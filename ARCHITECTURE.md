# KrishiMitra AI - Architecture Document

## System Design Overview

### Core Design Principles

1. **Offline-First**: Rural areas have intermittent connectivity
2. **Voice-First**: Many farmers are not comfortable with typing
3. **Language-Agnostic**: Support all major Indian languages
4. **Microservices**: Modular architecture for scalability
5. **Privacy-First**: Farmer data stays on device when possible

---

## Service Architecture

### 1. Voice AI Service
**Purpose**: Speech recognition, synthesis, and natural language understanding

```python
class VoiceAIService:
    - stt_engine: AI4Bharat / Whisper-finetuned
    - nlu_engine: Sarvam-2 / Intent classifier
    - tts_engine: AI4Bharat Airavata
    - language_detector: Bhashini
```

**Endpoints:**
- `POST /voice/transcribe` - Speech to text
- `POST /voice/synthesize` - Text to speech
- `POST /voice/query` - Full voice query pipeline
- `GET /voice/languages` - Supported languages

### 2. Irrigation Intelligence Service
**Purpose**: Predictive irrigation scheduling based on soil moisture, weather, and crop stage

```python
class IrrigationService:
    - moisture_predictor: VIC model + ML ensemble
    - weather_service: IMD API integration
    - crop_calendar: Stage-specific requirements
    - recommendation_engine: Rules + ML
```

**Endpoints:**
- `GET /irrigation/schedule/{district}/{crop}`
- `POST /irrigation/optimize` - Personalized schedule
- `GET /irrigation/moisture-forecast`
- `POST /irrigation/alert/subscribe`

### 3. Predictive Analytics Service
**Purpose**: Yield and price forecasting

```python
class PredictiveService:
    - yield_model: XGBoost + LSTM ensemble
    - price_model: Prophet + ARIMA
    - market_analyzer: Mandi price aggregation
    - risk_assessor: Climate risk scoring
```

**Endpoints:**
- `GET /predict/yield/{crop}/{district}/{season}`
- `GET /predict/price/{commodity}/{market}/{days}`
- `POST /predict/crop-plan` - Optimal crop selection
- `GET /predict/market-sentiment`

### 4. Geospatial Service
**Purpose**: Credit mapping, resource location, land analysis

```python
class GeospatialService:
    - credit_mapper: AIF gap analysis
    - resource_locator: Cold storage, dealers, centers
    - land_analyzer: Soil + climate matching
    - route_optimizer: Post-harvest logistics
```

**Endpoints:**
- `GET /geo/credit-zones` - Underserved regions
- `GET /geo/nearby/{resource_type}`
- `POST /geo/analyze-land` - Suitability scoring
- `GET /geo/cold-storage-map`

### 5. Climate Advisory Service
**Purpose**: Climate-resilient crop recommendations

```python
class ClimateService:
    - climate_analyzer: Historical weather patterns
    - crop_recommender: Variety selection
    - risk_predictor: Drought/flood forecasting
    - adaptation_advisor: Mitigation strategies
```

**Endpoints:**
- `GET /climate/crop-recommendations`
- `GET /climate/risk-assessment`
- `POST /climate/adaptation-plan`
- `GET /climate/variety-database`

---

## Data Flow Architecture

### Offline Sync Strategy

```
Device (SQLite) ←→ Sync Engine ←→ Backend API ←→ Master DB
     │                    │              │            │
     │                    │              │            │
   Queue              Conflict        Validate     PostgreSQL
  Changes            Resolution      Transform    + PostGIS
     │                    │              │            │
   Apply                Merge          Load      AIKosh APIs
```

### Real-time Data Pipeline

```
AIKosh/External APIs → Kafka → Stream Processors → Feature Store → Models
                           │           │                  │
                           ▼           ▼                  ▼
                    Alert Engine  Aggregations     Online Features
```

---

## Database Schema

### Core Tables

```sql
-- Farmers
CREATE TABLE farmers (
    id UUID PRIMARY KEY,
    phone VARCHAR(10) UNIQUE,
    name VARCHAR(100),
    district_code VARCHAR(5),
    preferred_language VARCHAR(5),
    farm_size_acres DECIMAL(6,2),
    created_at TIMESTAMP DEFAULT NOW(),
    last_active TIMESTAMP
);

-- Farms
CREATE TABLE farms (
    id UUID PRIMARY KEY,
    farmer_id UUID REFERENCES farmers(id),
    location GEOGRAPHY(POINT, 4326),
    soil_type VARCHAR(50),
    total_area DECIMAL(8,2),
    water_source VARCHAR(50),
    boundary GEOGRAPHY(POLYGON, 4326)
);

-- Crop Seasons
CREATE TABLE crop_seasons (
    id UUID PRIMARY KEY,
    farm_id UUID REFERENCES farms(id),
    crop_name VARCHAR(50),
    variety VARCHAR(50),
    planting_date DATE,
    expected_harvest DATE,
    area_cultivated DECIMAL(6,2),
    stage VARCHAR(20), -- germination, vegetative, flowering, harvesting
    created_at TIMESTAMP DEFAULT NOW()
);

-- Irrigation Events
CREATE TABLE irrigation_events (
    id UUID PRIMARY KEY,
    farm_id UUID REFERENCES farms(id),
    scheduled_date DATE,
    actual_date DATE,
    recommended_duration INT, -- minutes
    actual_duration INT,
    soil_moisture_before DECIMAL(4,2),
    weather_conditions JSONB,
    status VARCHAR(20) -- pending, completed, skipped
);

-- Voice Queries
CREATE TABLE voice_queries (
    id UUID PRIMARY KEY,
    farmer_id UUID REFERENCES farmers(id),
    audio_url TEXT,
    transcribed_text TEXT,
    detected_language VARCHAR(5),
    intent VARCHAR(50),
    entities JSONB,
    response_text TEXT,
    response_audio_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    processing_time_ms INT
);

-- Price Predictions
CREATE TABLE price_predictions (
    id UUID PRIMARY KEY,
    commodity VARCHAR(50),
    market_mandi VARCHAR(100),
    district_code VARCHAR(5),
    predicted_date DATE,
    predicted_price DECIMAL(8,2),
    confidence_lower DECIMAL(8,2),
    confidence_upper DECIMAL(8,2),
    model_version VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Yield Predictions
CREATE TABLE yield_predictions (
    id UUID PRIMARY KEY,
    crop_season_id UUID REFERENCES crop_seasons(id),
    district_code VARCHAR(5),
    crop_name VARCHAR(50),
    variety VARCHAR(50),
    area_acres DECIMAL(6,2),
    predicted_yield_quintals DECIMAL(8,2),
    confidence_interval JSONB,
    factors JSONB, -- weather, soil, practices
    model_version VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Geospatial Index
CREATE INDEX idx_farms_location ON farms USING GIST(location);
CREATE INDEX idx_credit_zones ON credit_zones USING GIST(boundary);

-- Partition large tables
CREATE TABLE voice_queries_2024 PARTITION OF voice_queries
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

---

## ML Model Architecture

### 1. Yield Prediction Model

```
Input Features (47 total):
├── Weather: 20 features (temp, humidity, rainfall, etc.)
├── Soil: 8 features (type, pH, NPK levels, moisture)
├── Crop: 6 features (type, variety, stage, density)
├── Historical: 10 features (past yields, trends)
└── Management: 3 features (irrigation, fertilizer, pest control)

Architecture:
├── Feature Engineering Pipeline
│   ├── Time series decomposition
│   ├── Lag features (7, 14, 30 days)
│   ├── Rolling averages
│   └── District-level aggregations
│
├── Ensemble Model
│   ├── XGBoost (60% weight) - structured features
│   ├── LSTM (30% weight) - temporal patterns
│   └── Random Forest (10% weight) - ensemble diversity
│
└── Output: Yield in quintals/acre + confidence interval

Training: 10 years of data from AIKosh crop statistics
Metrics: RMSE, MAE, R²
```

### 2. Price Forecasting Model

```
Input:
├── Historical prices (90 days)
├── Seasonal patterns
├── Weather impacts
├── Market arrivals
├── Export demand
└── Policy announcements

Architecture:
├── Preprocessing
│   ├── Outlier removal (IQR method)
│   ├── Log transformation
│   └── Stationarity testing
│
├── Models
│   ├── Prophet - Trend + seasonality
│   ├── ARIMA-GARCH - Volatility modeling
│   └── XGBoost - External factors
│
└── Ensemble weighted by recent performance

Output: Price forecast for 7/30/90 days with confidence bands
```

### 3. Irrigation Recommendation Model

```
Input:
├── Soil moisture (VIC model current + forecast)
├── Weather forecast (rain probability)
├── Crop stage water requirements
├── Historical irrigation patterns
├── Soil type retention capacity
└── Water availability constraints

Architecture:
├── Rule-based base layer
│   ├── Critical moisture thresholds by crop
│   ├── Growth stage multipliers
│   └── Soil type adjustments
│
├── ML enhancement layer
│   ├── Random Forest for optimization
│   └── Reinforcement Learning for farmer feedback
│
└── Output: Irrigation schedule (when, how long, how much)
```

---

## Security Architecture

### Authentication & Authorization

```
┌─────────────────────────────────────────┐
│           API Gateway                  │
│  ┌─────────────────────────────────┐    │
│  │  JWT Token Validation           │    │
│  │  - Issuer: KrishiMitra Auth    │    │
│  │  - Expiry: 24 hours            │    │
│  └─────────────────────────────────┘    │
│                   │                     │
│                   ▼                     │
│  ┌─────────────────────────────────┐    │
│  │  Rate Limiting (per farmer)    │    │
│  │  - 100 req/min authenticated   │    │
│  │  - 10 req/min unauthenticated  │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│         Service Level Auth             │
│  - Role-based access control           │
│  - Resource-level permissions          │
│  - Audit logging                       │
└─────────────────────────────────────────┘
```

### Data Protection

| Data Type | Storage | Encryption | Retention |
|-----------|---------|------------|-----------|
| PII (phone, name) | PostgreSQL | AES-256 at rest | 7 years |
| Voice recordings | S3-compatible | AES-256 | 30 days |
| Farm location | PostGIS | Anonymized coordinates | 5 years |
| Query logs | Elasticsearch | Field-level encryption | 1 year |

---

## Scalability Design

### Horizontal Scaling

```
                   Load Balancer (Nginx)
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
   ┌─────────┐      ┌─────────┐      ┌─────────┐
   │ API Pod │      │ API Pod │      │ API Pod │
   │   x3    │      │   x3    │      │   x3    │
   └────┬────┘      └────┬────┘      └────┬────┘
        │                │                │
        └────────────────┼────────────────┘
                         ▼
                ┌─────────────────┐
                │  Redis Cluster  │
                │  - Session store│
                │  - Task queue   │
                │  - Cache layer  │
                └─────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
  ┌──────────┐     ┌──────────┐     ┌──────────┐
  │  ML Pod  │     │  ML Pod  │     │  ML Pod  │
  │  x2      │     │  x2      │     │  x2      │
  └──────────┘     └──────────┘     └──────────┘
```

### Caching Strategy

| Layer | Technology | TTL | Use Case |
|-------|------------|-----|----------|
| CDN | CloudFront | 1 hour | Static assets |
| Edge | Nginx | 5 min | API responses |
| Application | Redis | Variable | Session, predictions |
| Model | ONNX Runtime | - | Compiled model cache |

---

## Deployment Architecture

### Kubernetes Setup

```yaml
# Production namespace
krishimitra-prod/
├── deployments/
│   ├── api-deployment.yaml (replicas: 6)
│   ├── ml-deployment.yaml (replicas: 4)
│   ├── voice-deployment.yaml (replicas: 3)
│   └── worker-deployment.yaml (replicas: 4)
├── services/
│   ├── api-service.yaml (ClusterIP)
│   ├── ml-service.yaml (ClusterIP)
│   └── ingress.yaml
├── configmaps/
│   └── app-config.yaml
└── secrets/
    └── db-credentials.yaml
```

### CI/CD Pipeline

```
Developer Push
      │
      ▼
┌─────────────┐
│  GitHub     │
│  Actions    │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│   Test      │────▶│  Build      │
│   Suite     │     │  Images     │
└─────────────┘     └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Push to   │
                    │   Registry  │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Deploy    │
                    │   Staging   │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   E2E Test  │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Deploy    │
                    │Production   │
                    └─────────────┘
```

---

## Monitoring & Observability

### Metrics

| Category | Metric | Target | Alert |
|----------|--------|--------|-------|
| Performance | API p99 latency | < 500ms | > 1s |
| | Voice processing | < 3s | > 5s |
| | Model inference | < 200ms | > 500ms |
| Availability | API uptime | 99.9% | < 99% |
| | ML service uptime | 99.5% | < 99% |
| Business | Active users/day | 10K | < 5K |
| | Queries processed | 100K/day | < 50K |
| | Offline sync success | > 95% | < 90% |

### Logging Strategy

```python
{
    "timestamp": "2024-01-15T10:30:00Z",
    "level": "INFO",
    "service": "voice-ai",
    "trace_id": "abc123",
    "span_id": "def456",
    "farmer_id": "uuid",
    "event": "voice_query_processed",
    "duration_ms": 1200,
    "language": "hi",
    "intent": "irrigation_advice",
    "model_version": "sarvam-2.1"
}
```

---

## Disaster Recovery

### Backup Strategy

| Data | Frequency | Retention | Location |
|------|-----------|-----------|----------|
| Database | Daily | 30 days | S3 + Cross-region |
| Voice recordings | Real-time | 30 days | S3 Glacier |
| Model artifacts | Weekly | 10 versions | S3 + EFS |
| Configuration | On change | All versions | Git |

### RPO/RTO

- **Recovery Point Objective (RPO)**: 24 hours
- **Recovery Time Objective (RTO)**: 4 hours

---

## Future Enhancements

1. **Edge AI**: Deploy models on-device for zero-latency inference
2. **Satellite Integration**: Real-time crop health monitoring
3. **Blockchain**: Supply chain traceability
4. **IoT Integration**: Automated sensor data collection
5. **AR Visualization**: Farm planning with augmented reality
6. **Federated Learning**: Privacy-preserving model improvements

---

*Last Updated: April 2025*
