"""
KrishiMitra AI - Credit Endpoints
Credit gap analysis and scheme eligibility
"""

from typing import Optional, List
from fastapi import APIRouter, Query, HTTPException

router = APIRouter()


@router.get("/gaps")
async def get_credit_gaps(
    district: str,
    crop: str,
    land_holding: float = Query(..., gt=0, description="Land holding in acres"),
    annual_income: float = Query(..., gt=0),
) -> dict:
    """Analyze credit gaps based on farmer profile."""
    # Calculate credit requirements
    production_credit = land_holding * 30000  # ₹30k/acre for crop production
    machinery_credit = 200000 if land_holding > 3 else 80000
    storage_credit = 50000 if land_holding > 2 else 20000

    total_required = production_credit + machinery_credit + storage_credit

    # Calculate available credit
    available = min(annual_income * 0.5, 300000)  # Max ₹3 lakh

    return {
        "district": district,
        "land_holding": land_holding,
        "gaps": [
            {
                "category": "Crop Production",
                "required": production_credit,
                "available": int(production_credit * 0.7),
                "gap": int(production_credit * 0.3),
            },
            {
                "category": "Machinery",
                "required": machinery_credit,
                "available": int(machinery_credit * 0.4),
                "gap": int(machinery_credit * 0.6),
            },
            {
                "category": "Storage",
                "required": storage_credit,
                "available": int(storage_credit * 0.4),
                "gap": int(storage_credit * 0.6),
            },
        ],
        "total_required": total_required,
        "total_available": available,
        "total_gap": total_required - available,
    }


@router.get("/schemes/eligible")
async def get_eligible_schemes(
    farmer_type: str = Query("small_marginal", description="small_marginal, large, landowner"),
    land_holding: float = Query(..., gt=0),
) -> dict:
    """Get government schemes the farmer is eligible for."""
    schemes = [
        {
            "name": "Kisan Credit Card (KCC)",
            "amount": "Up to ₹3 lakh",
            "interest": "4% p.a.",
            "eligibility": "All farmers with land",
            "status": "eligible",
            "description": "Quick credit for crop cultivation, animal husbandry, and fishery",
        },
        {
            "name": "PM-KISAN",
            "amount": "₹6,000/year",
            "interest": "N/A",
            "eligibility": "Small & marginal farmers",
            "status": "eligible" if land_holding <= 2 else "not_eligible",
            "description": "Direct income support to farmer families",
        },
        {
            "name": "Agricultural Infrastructure Fund",
            "amount": "₹2 crore max",
            "interest": "3% subvention",
            "eligibility": "FPOs, agribusinesses",
            "status": "not_eligible" if farmer_type == "small_marginal" else "eligible",
            "description": "Post-harvest management infrastructure",
        },
        {
            "name": "Fasal Bima Yojana",
            "amount": "Crop loss coverage",
            "interest": "2% premium",
            "eligibility": "All farmers",
            "status": "eligible",
            "description": "Crop insurance against natural calamities",
        },
    ]
    return {"schemes": schemes}


@router.get("/cold-storages")
async def get_nearby_cold_storages(
    district: str,
    radius_km: int = Query(50, ge=10, le=100),
) -> dict:
    """Get nearby cold storage facilities."""
    # Simulated data
    return {
        "district": district,
        "radius_km": radius_km,
        "facilities": [
            {
                "name": "Patna Cold Storage",
                "distance_km": 15,
                "capacity_mt": 5000,
                "rating": 4.5,
                "phone": "0612-234567",
            },
            {
                "name": "Bihar Agro Cold Chain",
                "distance_km": 22,
                "capacity_mt": 3000,
                "rating": 4.2,
                "phone": "0612-345678",
            },
        ],
    }


@router.get("/input-dealers")
async def get_input_dealers(
    district: str,
    product_type: Optional[str] = Query(None, description="fertilizers, seeds, pesticides"),
) -> dict:
    """Get nearby input dealers."""
    return {
        "district": district,
        "dealers": [
            {
                "name": "Bharat Fertilizers",
                "products": "Urea, DAP, Potash",
                "distance_km": 3,
                "rating": 4.8,
            },
            {
                "name": "Krishna Seeds & Pesticides",
                "products": "Seeds, Pesticides, Fungicides",
                "distance_km": 5,
                "rating": 4.5,
            },
        ],
    }


@router.get("/training-centers")
async def get_training_centers(
    district: str,
) -> dict:
    """Get nearby training centers and extension services."""
    return {
        "district": district,
        "centers": [
            {
                "name": "KVK Patna",
                "type": "Government",
                "courses": "Organic Farming, Dairy, Fisheries",
                "distance_km": 12,
            },
            {
                "name": "BAU Sabour",
                "type": "University",
                "courses": "Advanced Crop Management, Horticulture",
                "distance_km": 45,
            },
        ],
    }