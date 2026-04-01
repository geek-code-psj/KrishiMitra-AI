# KrishiMitra AI - Feature Store Design

A centralized feature store for managing ML features across training and serving.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     FEATURE STORE LAYER                       │
├─────────────────┬──────────────────┬────────────────────────────┤
│ Offline Store   │  Online Store    │  Metadata Store            │
│ (PostgreSQL)    │  (Redis)         │  (MLflow + PostgreSQL)    │
├─────────────────┼──────────────────┼────────────────────────────┤
│ Training data   │  Real-time       │  Feature definitions       │
│ Historical      │  Low-latency     │  Lineage tracking          │
│ Batch features  │  (p99 < 20ms)    │  Versioning                │
└────────┬────────┴────────┬─────────┴────────────┬─────────────┘
         │                 │                      │
         └─────────────────┼──────────────────────┘
                           ▼
              ┌─────────────────────┐
              │   Feature Registry  │
              │   (Python SDK)      │
              └─────────────────────┘
```

---

## Feature Categories

### 1. Farmer Profile Features (Static)
```python
farmer_profile = FeatureGroup(
    name="farmer_profile",
    entities=["farmer_id"],
    ttl_days=365,  # Update yearly
    features={
        "farm_size_acres": FeatureType.FLOAT,
        "soil_type": FeatureType.STRING,
        "water_source": FeatureType.STRING,
        "district_code": FeatureType.STRING,
        "years_farming": FeatureType.INTEGER,
        "primary_crops": FeatureType.STRING_LIST,
    }
)
```

### 2. Weather Features (Temporal)
```python
weather_features = FeatureGroup(
    name="weather_daily",
    entities=["district_code"],
    temporal=True,
    ttl_days=90,  // Keep last 90 days hot
    features={
        "temperature_max": FeatureType.FLOAT,
        "temperature_min": FeatureType.FLOAT,
        "humidity_avg": FeatureType.FLOAT,
        "rainfall_mm": FeatureType.FLOAT,
        "wind_speed": FeatureType.FLOAT,
        "sunshine_hours": FeatureType.FLOAT,
        "soil_moisture_vic": FeatureType.FLOAT,  # From AIKosh VIC
    }
)
```

### 3. Market Price Features (Temporal)
```python
price_features = FeatureGroup(
    name="commodity_prices",
    entities=["commodity", "market_mandi"],
    temporal=True,
    ttl_days=30,
    features={
        "current_price": FeatureType.FLOAT,
        "price_7d_avg": FeatureType.FLOAT,
        "price_30d_avg": FeatureType.FLOAT,
        "price_volatility": FeatureType.FLOAT,
        "volume_traded": FeatureType.INTEGER,
        "price_trend": FeatureType.FLOAT,  # Slope of trend
    }
)
```

### 4. Crop Growth Features (Temporal)
```python
crop_features = FeatureGroup(
    name="crop_growth",
    entities=["crop_season_id"],
    temporal=True,
    ttl_days=180,  # Growing season
    features={
        "days_since_planting": FeatureType.INTEGER,
        "growth_stage": FeatureType.STRING,  # germination, vegetative, etc.
        "gdd_accumulated": FeatureType.FLOAT,  # Growing Degree Days
        "water_requirement_mm": FeatureType.FLOAT,
        "pest_pressure_index": FeatureType.FLOAT,
        "disease_risk_score": FeatureType.FLOAT,
    }
)
```

---

## Feature Ingestion Pipelines

### Batch Ingestion (Hourly/Daily)

```python
# DAG: feature_ingestion_weather.py
from airflow import DAG
from feature_store import BatchIngestion

with DAG('weather_features', schedule='@hourly') as dag:

    # 1. Extract from AIKosh/IMD
    extract = PythonOperator(
        task_id='extract_weather',
        python_callable=extract_from_imd_api
    )

    # 2. Transform
    transform = PythonOperator(
        task_id='transform_features',
        python_callable=compute_weather_features
    )

    # 3. Validate
    validate = GreatExpectationsOperator(
        task_id='validate',
        expectation_suite='weather_features_suite'
    )

    # 4. Load to Feature Store
    load = FeatureStoreOperator(
        task_id='load_features',
        feature_group='weather_daily',
        mode='batch'
    )

    extract >> transform >> validate >> load
```

### Real-time Ingestion (Streaming)

```python
# Kafka consumer for real-time features
from kafka import KafkaConsumer
from feature_store import OnlineStore

consumer = KafkaConsumer(
    'soil-moisture-readings',
    bootstrap_servers=['kafka:9092']
)

online_store = OnlineStore(redis_client)

for message in consumer:
    # Process incoming sensor data
    feature_vector = process_sensor_reading(message.value)

    # Write to online store (sub-20ms latency)
    online_store.write(
        feature_group='soil_moisture_realtime',
        entity_id=message.value['farm_id'],
        features=feature_vector,
        timestamp=message.timestamp
    )
```

---

## Feature Serving

### Training Dataset Generation

```python
from feature_store import FeatureStore

store = FeatureStore()

# Generate training dataset
training_data = store.get_historical_features(
    entity_df=farmers_df,  # [farmer_id, timestamp]
    feature_groups=[
        "farmer_profile",
        "weather_daily",
        "crop_growth",
    ],
    start_date="2020-01-01",
    end_date="2024-12-31",
).to_pandas()

# Point-in-time correct joins (no data leakage)
# Automatically handles temporal feature lookups
```

### Online Feature Serving

```python
from feature_store import FeatureStore

store = FeatureStore()

# Get features for real-time prediction (p99 < 20ms)
features = store.get_online_features(
    entity_ids=["farmer_12345"],
    feature_refs=[
        "weather_daily:temperature_max",
        "weather_daily:soil_moisture_vic",
        "crop_growth:growth_stage",
    ]
)

# Directly usable for model inference
prediction = yield_model.predict(features.to_numpy())
```

---

## Storage Design

### Offline Store (PostgreSQL + PostGIS)

```sql
-- Feature tables with partitioning
CREATE TABLE features_weather_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id VARCHAR(50) NOT NULL,  -- district_code
    event_timestamp TIMESTAMP NOT NULL,
    created_timestamp TIMESTAMP DEFAULT NOW(),

    -- Feature values
    temperature_max FLOAT,
    temperature_min FLOAT,
    humidity_avg FLOAT,
    rainfall_mm FLOAT,
    soil_moisture_vic FLOAT,

    -- Metadata
    feature_group VARCHAR(100) NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,

    -- Partitioning
    PRIMARY KEY (id, event_timestamp)
) PARTITION BY RANGE (event_timestamp);

-- Monthly partitions
CREATE TABLE features_weather_daily_2024_01
    PARTITION OF features_weather_daily
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Indexes for efficient lookups
CREATE INDEX idx_weather_entity_time
    ON features_weather_daily (entity_id, event_timestamp DESC);

-- Point-in-time query
CREATE INDEX idx_weather_pit
    ON features_weather_daily (entity_id, created_timestamp DESC);
```

### Online Store (Redis)

```
Key Structure: {feature_group}:{entity_id}:{feature_name}

Example:
weather_daily:patna:temperature_max → 35.2
weather_daily:patna:soil_moisture_vic → 25.4
crop_growth:cs_123:growth_stage → flowering

TTL: 90 days for most features
     30 days for volatile features (prices)
     No TTL for static features
```

### Metadata Store

```sql
-- Feature definitions
CREATE TABLE feature_metadata (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    feature_group VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    owner VARCHAR(100),
    tags TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    version INTEGER NOT NULL
);

-- Feature lineage
CREATE TABLE feature_lineage (
    id UUID PRIMARY KEY,
    feature_name VARCHAR(255) REFERENCES feature_metadata(name),
    source VARCHAR(255),  -- e.g., "aikosh_vic_api"
    transformation_logic TEXT,
    upstream_dependencies TEXT[],
    created_at TIMESTAMP DEFAULT NOW()
);

-- Feature statistics (for monitoring)
CREATE TABLE feature_statistics (
    id UUID PRIMARY KEY,
    feature_name VARCHAR(255),
    computed_at TIMESTAMP,
    mean FLOAT,
    std_dev FLOAT,
    min_value FLOAT,
    max_value FLOAT,
    null_count INTEGER,
    total_count INTEGER
);
```

---

## Feature Versioning

### Semantic Versioning

```
Format: {major}.{minor}.{patch}

major: Breaking change (feature definition changes)
minor: New features added (backward compatible)
patch: Bug fixes, data corrections

Examples:
v1.0.0: Initial weather features
v1.1.0: Added wind_speed feature
v2.0.0: Changed temperature unit (F → C)
```

### Backward Compatibility

```python
# Always serve features at specific versions
features_v1 = store.get_features(
    feature_refs=["weather_daily:v1.0.0"]
)

features_v2 = store.get_features(
    feature_refs=["weather_daily:v2.0.0"]
)

# Migration period: Serve both versions
```

---

## Monitoring & Quality

### Feature Statistics (Automated)

```python
# Computed hourly
def compute_feature_statistics(feature_group: str):
    df = store.get_features(feature_group=feature_group)

    stats = {
        "feature_name": feature_group,
        "computed_at": datetime.now(),
        "mean": df.mean(),
        "std_dev": df.std(),
        "null_percentage": df.isnull().mean() * 100,
        "unique_count": df.nunique(),
    }

    # Alert if quality degrades
    if stats["null_percentage"] > 5:
        alert(f"High null rate in {feature_group}")

    return stats
```

### Drift Detection

```python
# Compare current vs reference distribution
def detect_drift(feature_name: str, current_data: pd.Series):
    reference_data = store.get_reference_distribution(feature_name)

    # PSI (Population Stability Index)
    psi = calculate_psi(reference_data, current_data)

    if psi > 0.25:
        severity = "critical"
    elif psi > 0.1:
        severity = "warning"
    else:
        severity = "ok"

    return {
        "feature": feature_name,
        "psi": psi,
        "severity": severity,
        "timestamp": datetime.now()
    }
```

---

## Cost Optimization

### Storage Tiers

| Tier | Storage | Access Pattern | Cost |
|------|---------|----------------|------|
| Hot | Redis + PG (7 days) | Real-time inference | High |
| Warm | PostgreSQL (90 days) | Training, batch | Medium |
| Cold | S3 (Parquet) | Historical analysis | Low |
| Archive | Glacier | Compliance | Very Low |

### Feature TTL Strategy

```python
ttl_config = {
    "farmer_profile": None,           # Never expire
    "weather_daily": timedelta(days=90),
    "commodity_prices": timedelta(days=30),
    "crop_growth": timedelta(days=180),
    "voice_queries": timedelta(days=30),  # PII expiry
}
```

---

## Implementation Roadmap

### Phase 1: MVP (Week 1-2)
- [ ] Basic PostgreSQL offline store
- [ ] Simple Redis online store
- [ ] Feature ingestion for weather data
- [ ] Training dataset generation

### Phase 2: Production (Week 3-4)
- [ ] Feature versioning
- [ ] Metadata store
- [ ] Monitoring dashboards
- [ ] Drift detection

### Phase 3: Scale (Week 5-8)
- [ ] Feast integration (open source feature store)
- [ ] Streaming pipeline
- [ ] Multi-region replication
- [ ] Advanced caching

---

## Tools & Technologies

| Component | Primary | Alternative |
|-----------|---------|-------------|
| Feature Store | Custom + Feast | Tecton, SageMaker |
| Offline Store | PostgreSQL | BigQuery, Snowflake |
| Online Store | Redis | DynamoDB, Cassandra |
| Metadata | PostgreSQL + MLflow | DataHub, Amundsen |
| Monitoring | Prometheus + Grafana | Datadog, New Relic |
| Orchestration | Apache Airflow | Prefect, Dagster |

---

*Last Updated: April 2025*
