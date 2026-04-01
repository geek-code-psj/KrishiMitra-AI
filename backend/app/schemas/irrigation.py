"""
KrishiMitra AI - Irrigation Schemas
Pydantic models for irrigation scheduling endpoints
"""

from typing import Optional, List, Dict, Any
from datetime import date, datetime
from pydantic import BaseModel, Field


class MoistureReading(BaseModel):
    """Single soil moisture reading."""

    date: date = Field(..., description="Reading date")
    moisture_content: float = Field(
        ...,
        description="Volumetric soil moisture content (%)",
        ge=0,
        le=100
    )
    moisture_level: str = Field(
        ...,
        description="Categorized level (dry, low, optimal, high)"
    )
    drought_stress: Optional[bool] = Field(
        None,
        description="Whether crop is under drought stress"
    )


class MoistureData(BaseModel):
    """Soil moisture data response."""

    district: str = Field(..., description="District code")
    current_moisture: float = Field(..., description="Current moisture content")
    current_level: str = Field(..., description="Current moisture level")
    historical: List[MoistureReading] = Field(..., description="Historical readings")
    forecast: Optional[List[MoistureReading]] = Field(
        None,
        description="Forecasted readings"
    )
    average_moisture: float = Field(..., description="Average over period")
    min_moisture: float = Field(..., description="Minimum recorded")
    max_moisture: float = Field(..., description="Maximum recorded")
    trend: str = Field(..., description="Moisture trend (increasing, decreasing, stable)")
    data_source: str = Field(default="VIC Model - AIKosh", description="Data source")
    last_updated: datetime = Field(..., description="Last data update")


class IrrigationEvent(BaseModel):
    """Single irrigation event in schedule."""

    id: str = Field(..., description="Event ID")
    date: date = Field(..., description="Scheduled date")
    start_time: Optional[str] = Field(None, description="Recommended start time")
    duration_minutes: int = Field(..., description="Recommended duration")
    water_volume_liters: Optional[float] = Field(
        None,
        description="Estimated water volume needed"
    )
    method: Optional[str] = Field(
        None,
        description="Irrigation method (flood, drip, sprinkler)"
    )
    priority: str = Field(
        ...,
        description="Priority (low, normal, high, critical)"
    )
    reason: str = Field(..., description="Reason for irrigation recommendation")
    soil_moisture_before: Optional[float] = Field(
        None,
        description="Expected soil moisture before irrigation"
    )
    weather_expected: Optional[str] = Field(
        None,
        description="Expected weather conditions"
    )
    status: str = Field(default="scheduled", description="Event status")
    completed: Optional[datetime] = Field(None, description="Completion timestamp")


class IrrigationScheduleRequest(BaseModel):
    """Request for irrigation schedule optimization."""

    district: str = Field(..., description="District code")
    crop: str = Field(..., description="Crop name")
    area_acres: float = Field(..., gt=0, description="Cultivated area")
    soil_type: str = Field(..., description="Soil type")
    crop_stage: str = Field(..., description="Current crop stage")
    planting_date: Optional[date] = Field(None, description="Planting date")
    farmer_id: Optional[str] = Field(None, description="Farmer ID")
    days: int = Field(default=14, ge=7, le=30, description="Schedule horizon")
    constraints: Optional[Dict[str, Any]] = Field(
        None,
        description="Optimization constraints",
        examples=[{
            "water_availability": "limited",
            "electricity_schedule": "6pm-8am",
            "preferred_times": ["early_morning", "evening"]
        }]
    )


class IrrigationScheduleResponse(BaseModel):
    """Response for irrigation schedule."""

    district: str = Field(..., description="District code")
    crop: str = Field(..., description="Crop name")
    area_acres: float = Field(..., description="Cultivated area")
    soil_type: str = Field(..., description="Soil type")
    crop_stage: str = Field(..., description="Current crop stage")
    schedule: List[IrrigationEvent] = Field(..., description="Irrigation events")
    total_water_required_liters: float = Field(
        ...,
        description="Total water requirement for period"
    )
    estimated_cost_inr: Optional[float] = Field(
        None,
        description="Estimated irrigation cost"
    )
    water_saving_tips: List[str] = Field(
        default=[],
        description="Water conservation recommendations"
    )
    drought_risk: Optional[str] = Field(
        None,
        description="Drought risk level (low, medium, high)"
    )
    next_check_date: date = Field(
        ...,
        description="When to check for schedule updates"
    )
    generated_at: datetime = Field(..., description="Generation timestamp")
    model_version: str = Field(..., description="Model version used")


class WaterBudget(BaseModel):
    """Water budget calculation."""

    district: str = Field(..., description="District code")
    crop: str = Field(..., description="Crop name")
    area_acres: float = Field(..., description="Cultivated area")
    growth_period_days: int = Field(..., description="Growth period")
    total_water_required_liters: float = Field(..., description="Total water needed")
    total_water_required_acre_inches: float = Field(
        ...,
        description="Water in acre-inches"
    )
    breakdown_by_stage: Dict[str, float] = Field(
        ...,
        description="Water needs by growth stage"
    )
    rainfall_contribution: float = Field(
        ...,
        description="Expected effective rainfall"
    )
    irrigation_required: float = Field(
        ...,
        description="Net irrigation water needed"
    )
    estimated_pumping_hours: float = Field(
        ...,
        description="Estimated pumping hours required"
    )
    estimated_electricity_cost: Optional[float] = Field(
        None,
        description="Estimated electricity cost"
    )


class IrrigationAlert(BaseModel):
    """Irrigation alert."""

    id: str = Field(..., description="Alert ID")
    type: str = Field(..., description="Alert type")
    severity: str = Field(..., description="Severity (warning, critical)")
    message: str = Field(..., description="Alert message")
    district: str = Field(..., description="Affected district")
    recommended_action: str = Field(..., description="Recommended action")
    valid_until: date = Field(..., description="Alert validity")
    created_at: datetime = Field(..., description="Alert timestamp")
