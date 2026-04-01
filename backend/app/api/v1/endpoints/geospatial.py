"""
KrishiMitra AI - Geospatial Endpoints
Credit mapping and resource location
"""

from typing import Optional, List
from fastapi import APIRouter, Query

router = APIRouter()


@router.get("/credit-zones")
async def get_credit_zones(
    district: Optional[str] = None,
    limit: int = Query(50, ge=1, le=100),
):
    """Get underserved regions for AIF credit targeting."""
    return {
        "zones": [
            {
                "id": "zone_001",
                "name": "Block A",
                "district": district or "patna",
                "credit_gap_crores": 12.5,
                "farmers_count": 1250,
                "priority": "high",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [],
                },
            }
        ],
        "total": 1,
    }


@router.get("/nearby/{resource_type}")
async def get_nearby_resources(
    resource_type: str,  # cold_storage, dealer, center
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude"),
    radius_km: float = Query(10, ge=1, le=50),
):
    """Get nearby resources (cold storage, dealers, training centers)."""
    resources = {
        "cold_storage": [
            {
                "id": "cs_001",
                "name": "Patna Cold Storage",
                "type": "cold_storage",
                "distance_km": 3.2,
                "capacity_tons": 500,
                "contact": "0612-123456",
                "location": {"lat": lat + 0.01, "lng": lng + 0.01},
            }
        ],
        "dealer": [
            {
                "id": "dealer_001",
                "name": "Krishi Kendra",
                "type": "input_dealer",
                "distance_km": 2.1,
                "products": ["seeds", "fertilizer", "pesticide"],
                "contact": "9876543210",
                "location": {"lat": lat - 0.005, "lng": lng + 0.008},
            }
        ],
        "center": [
            {
                "id": "center_001",
                "name": "KVK Patna",
                "type": "training_center",
                "distance_km": 5.5,
                "programs": ["organic_farming", "drip_irrigation"],
                "contact": "0612-789012",
                "location": {"lat": lat + 0.015, "lng": lng - 0.005},
            }
        ],
    }
    return {"resources": resources.get(resource_type, [])}


@router.post("/analyze-land")
async def analyze_land(
    lat: float,
    lng: float,
    area_acres: float,
):
    """Analyze land suitability for crops."""
    return {
        "location": {"lat": lat, "lng": lng},
        "soil_type": "clay_loam",
        "ph": 6.5,
        "suitable_crops": ["rice", "wheat", "maize"],
        "water_availability": "moderate",
        "recommendation": "Well suited for rice cultivation",
        "risk_factors": ["Seasonal flooding"],
    }


@router.get("/cold-storage-map")
async def get_cold_storage_map(
    district: str,
):
    """Get cold storage locations for map display."""
    return {
        "district": district,
        "cold_storages": [
            {
                "id": "cs_001",
                "name": "Patna Cold Storage",
                "capacity_tons": 500,
                "location": {"lat": 25.5941, "lng": 85.1376},
                "occupancy_percent": 65,
            },
            {
                "id": "cs_002",
                "name": "Gaya Cold Storage",
                "capacity_tons": 350,
                "location": {"lat": 24.7955, "lng": 85.0002},
                "occupancy_percent": 45,
            },
        ],
    }
