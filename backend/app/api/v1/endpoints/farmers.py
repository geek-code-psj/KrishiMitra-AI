"""
KrishiMitra AI - Farmer Endpoints
Farmer profile and farm management
"""

from typing import Optional, List
from fastapi import APIRouter, Query
from pydantic import BaseModel, Field
from datetime import date

router = APIRouter()


class FarmerProfile(BaseModel):
    id: str
    phone: str
    name: str
    district_code: str
    preferred_language: str = "hi"
    farm_size_acres: float
    created_at: date


class FarmCreateRequest(BaseModel):
    name: str
    area_acres: float
    soil_type: str
    water_source: str
    location_lat: float
    location_lng: float


@router.get("/profile", response_model=FarmerProfile)
async def get_profile():
    """Get farmer profile."""
    return {
        "id": "farmer_12345",
        "phone": "9876543210",
        "name": "Ram Singh",
        "district_code": "patna",
        "preferred_language": "hi",
        "farm_size_acres": 5.5,
        "created_at": date.today(),
    }


@router.put("/profile")
async def update_profile():
    """Update farmer profile."""
    return {"message": "Profile updated successfully"}


@router.get("/farms")
async def get_farms():
    """Get all farms for farmer."""
    return {
        "farms": [
            {
                "id": "farm_001",
                "name": "Main Farm",
                "area_acres": 5.5,
                "soil_type": "clay_loam",
                "water_source": "tubewell",
                "location": {"lat": 25.5941, "lng": 85.1376},
            }
        ]
    }


@router.post("/farms")
async def create_farm(request: FarmCreateRequest):
    """Create a new farm."""
    return {
        "id": "farm_002",
        "message": "Farm created successfully",
        "farm": request.dict(),
    }


@router.get("/query-history")
async def get_query_history(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    """Get farmer's voice query history."""
    return {
        "queries": [
            {
                "id": "query_001",
                "text": "When should I irrigate my rice crop?",
                "response": "Irrigate your rice crop today...",
                "timestamp": "2024-04-01T10:30:00Z",
                "language": "hi",
            }
        ],
        "total": 1,
        "limit": limit,
        "offset": offset,
    }
