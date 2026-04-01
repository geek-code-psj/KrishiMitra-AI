"""
KrishiMitra AI - Prediction Schemas
Pydantic models for yield and price prediction endpoints
"""

from typing import Optional, List, Dict, Any
from datetime import date
from pydantic import BaseModel, Field


class YieldPredictionRequest(BaseModel):
    """Request for yield prediction."""

    crop: str = Field(..., description="Crop name")
    district: str = Field(..., description="District code")
    season: str = Field(..., description="kharif, rabi, or summer")
    area_acres: float = Field(..., gt=0, description="Cultivated area in acres")
    variety: Optional[str] = Field(None, description="Crop variety")
    farmer_id: Optional[str] = Field(None, description="Farmer ID")


class YieldFactor(BaseModel):
    """Individual factor contributing to yield prediction."""

    name: str = Field(..., description="Factor name")
    impact: float = Field(..., description="Impact on yield (-1 to 1)")
    description: str = Field(..., description="Human-readable description")


class YieldPredictionResponse(BaseModel):
    """Response for yield prediction."""

    crop: str = Field(..., description="Crop name")
    district: str = Field(..., description="District code")
    season: str = Field(..., description="Season")
    area_acres: float = Field(..., description="Cultivated area")
    predicted_yield_quintals: float = Field(..., description="Predicted yield in quintals")
    yield_per_acre: float = Field(..., description="Yield per acre (quintals)")
    confidence_interval: Dict[str, float] = Field(
        ...,
        description="Lower and upper bounds of prediction",
        examples=[{"lower": 45.2, "upper": 52.8}]
    )
    confidence_level: float = Field(
        ...,
        description="Confidence level of prediction",
        ge=0,
        le=1
    )
    factors: List[YieldFactor] = Field(
        default=[],
        description="Contributing factors"
    )
    historical_average: Optional[float] = Field(
        None,
        description="Historical average yield for comparison"
    )
    comparison_to_historical: Optional[str] = Field(
        None,
        description="Above/below/average compared to historical"
    )
    model_version: str = Field(..., description="ML model version")
    prediction_date: date = Field(..., description="Date of prediction")


class PricePoint(BaseModel):
    """Individual price forecast point."""

    date: date = Field(..., description="Forecast date")
    price: float = Field(..., description="Predicted price per quintal (INR)")
    confidence_lower: float = Field(..., description="Lower bound of confidence interval")
    confidence_upper: float = Field(..., description="Upper bound of confidence interval")


class PricePredictionResponse(BaseModel):
    """Response for price prediction."""

    commodity: str = Field(..., description="Commodity name")
    market: str = Field(..., description="Market/Mandi name")
    current_price: float = Field(..., description="Current price per quintal")
    forecast: List[PricePoint] = Field(..., description="Price forecast series")
    trend: str = Field(
        ...,
        description="Overall trend (increasing, decreasing, stable)",
        examples=["increasing"]
    )
    trend_percentage: float = Field(..., description="Trend percentage over forecast period")
    volatility: str = Field(..., description="Expected volatility (low, medium, high)")
    seasonal_factor: str = Field(..., description="Seasonal price factor")
    best_selling_window: Optional[Dict[str, date]] = Field(
        None,
        description="Recommended date range to sell"
    )
    historical: Optional[List[Dict[str, Any]]] = Field(
        None,
        description="Last 30 days historical prices"
    )
    model_version: str = Field(..., description="ML model version")
    prediction_date: date = Field(..., description="Date of prediction")


class CropPlanRequest(BaseModel):
    """Request for crop planning recommendations."""

    district: str = Field(..., description="District code")
    season: str = Field(..., description="Growing season")
    area_acres: float = Field(..., gt=0, description="Available area")
    soil_type: Optional[str] = Field(None, description="Soil type")
    water_availability: Optional[str] = Field(
        None,
        description="Water availability (scarce, moderate, abundant)"
    )
    budget: Optional[float] = Field(None, description="Available budget in INR")
    preferences: Optional[List[str]] = Field(
        None,
        description="Preferred crops or constraints"
    )
    risk_tolerance: str = Field(
        "moderate",
        description="Risk tolerance (low, moderate, high)"
    )


class CropRecommendation(BaseModel):
    """Individual crop recommendation."""

    crop: str = Field(..., description="Crop name")
    variety: Optional[str] = Field(None, description="Recommended variety")
    expected_yield_quintals: float = Field(..., description="Expected yield")
    expected_price_per_quintal: float = Field(..., description="Expected selling price")
    estimated_revenue: float = Field(..., description="Estimated total revenue")
    estimated_cost: float = Field(..., description="Estimated input costs")
    estimated_profit: float = Field(..., description="Expected profit")
    roi_percentage: float = Field(..., description="Return on investment")
    risk_level: str = Field(..., description="Risk level (low, medium, high)")
    confidence_score: float = Field(..., description="Recommendation confidence")
    rationale: str = Field(..., description="Why this crop is recommended")
    key_requirements: List[str] = Field(..., description="Key requirements for success")


class CropPlanResponse(BaseModel):
    """Response for crop planning."""

    district: str = Field(..., description="District code")
    season: str = Field(..., description="Season")
    area_acres: float = Field(..., description="Available area")
    recommendations: List[CropRecommendation] = Field(..., description="Ranked recommendations")
    diversification_advice: Optional[str] = Field(
        None,
        description="Advice on crop diversification"
    )
    market_insights: Optional[Dict[str, Any]] = Field(
        None,
        description="Market insights for recommended crops"
    )
    generated_at: date = Field(..., description="Generation date")
