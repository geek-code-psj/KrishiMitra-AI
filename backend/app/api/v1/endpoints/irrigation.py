"""
KrishiMitra AI - Irrigation Endpoints
Smart irrigation scheduling using VIC soil moisture data
"""

from typing import Optional, List
from datetime import date, timedelta

from fastapi import APIRouter, Query, HTTPException
import structlog

from app.services.irrigation.scheduler import IrrigationScheduler
from app.services.irrigation.moisture_forecaster import MoistureForecaster
from app.schemas.irrigation import (
    IrrigationScheduleRequest,
    IrrigationScheduleResponse,
    IrrigationEvent,
    MoistureData,
)

logger = structlog.get_logger()
router = APIRouter()


@router.get("/schedule/{district}/{crop}", response_model=IrrigationScheduleResponse)
async def get_irrigation_schedule(
    district: str,
    crop: str,
    area_acres: float = Query(..., gt=0, description="Cultivated area in acres"),
    soil_type: str = Query(..., description="Soil type (clay, loam, sandy, etc.)"),
    crop_stage: str = Query(
        ...,
        description="Current crop stage (germination, vegetative, flowering, fruiting, maturity)"
    ),
    planting_date: Optional[date] = Query(None, description="Date of planting"),
    farmer_id: Optional[str] = Query(None, description="Farmer ID for personalized schedule"),
    days: int = Query(14, ge=7, le=30, description="Schedule horizon in days"),
) -> IrrigationScheduleResponse:
    """
    Generate optimized irrigation schedule using AIKosh VIC soil moisture data.

    **Path Parameters:**
    - **district**: District code (e.g., "patna", "pune")
    - **crop**: Crop name (rice, wheat, etc.)

    **Query Parameters:**
    - **area_acres**: Area under cultivation
    - **soil_type**: Soil classification
    - **crop_stage**: Current growth stage
    - **planting_date**: When crop was planted
    - **farmer_id**: For personalized recommendations
    - **days**: Schedule horizon (7-30 days)

    **Returns:**
    Optimized irrigation schedule with timing, duration, and water requirements.

    **Data Sources:**
    - Daily Soil Moisture (VIC) from AIKosh/NRSC
    - IMD weather forecasts
    - Crop-specific water requirements

    **Example:**
    ```
    GET /irrigation/schedule/patna/rice?area_acres=2.0&soil_type=clay&crop_stage=vegetative
    ```
    """
    valid_stages = ["germination", "vegetative", "flowering", "fruiting", "maturity"]
    if crop_stage not in valid_stages:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid crop stage. Must be one of: {valid_stages}"
        )

    try:
        scheduler = IrrigationScheduler()
        schedule = await scheduler.generate_schedule(
            district=district,
            crop=crop,
            area_acres=area_acres,
            soil_type=soil_type,
            crop_stage=crop_stage,
            planting_date=planting_date,
            farmer_id=farmer_id,
            days=days,
        )

        logger.info(
            "Irrigation schedule generated",
            district=district,
            crop=crop,
            events=len(schedule.get("schedule", [])),
        )

        return IrrigationScheduleResponse(**schedule)

    except Exception as e:
        logger.error("Schedule generation failed", error=str(e))
        raise HTTPException(status_code=500, detail="Schedule generation error")


@router.get("/moisture/{district}", response_model=MoistureData)
async def get_soil_moisture(
    district: str,
    days: int = Query(7, ge=1, le=30, description="Historical days to fetch"),
    include_forecast: bool = Query(True, description="Include forecast"),
) -> MoistureData:
    """
    Get soil moisture data from AIKosh VIC dataset.

    VIC (Variable Infiltration Capacity) model data provides
    district-level volumetric soil moisture content.

    **Path Parameters:**
    - **district**: District code

    **Query Parameters:**
    - **days**: Historical data days (1-30)
    - **include_forecast**: Include 7-day forecast

    **Returns:**
    Soil moisture readings with drought stress indicators.
    """
    try:
        forecaster = MoistureForecaster()
        data = await forecaster.get_moisture_data(
            district=district,
            days=days,
            include_forecast=include_forecast,
        )

        return MoistureData(**data)

    except Exception as e:
        logger.error("Moisture data fetch failed", error=str(e))
        raise HTTPException(status_code=500, detail="Data fetch error")


@router.get("/moisture/forecast/{district}")
async def get_moisture_forecast(
    district: str,
    days: int = Query(7, ge=1, le=14, description="Forecast days"),
) -> dict:
    """
    Get soil moisture forecast for irrigation planning.

    Uses VIC model + weather forecasts to predict soil moisture.
    """
    try:
        forecaster = MoistureForecaster()
        forecast = await forecaster.predict(
            district=district,
            days=days,
        )

        return {
            "district": district,
            "forecast": forecast,
            "generated_at": date.today().isoformat(),
        }

    except Exception as e:
        logger.error("Forecast generation failed", error=str(e))
        raise HTTPException(status_code=500, detail="Forecast error")


@router.post("/optimize")
async def optimize_irrigation(
    request: IrrigationScheduleRequest,
) -> IrrigationScheduleResponse:
    """
    Optimize irrigation schedule based on constraints.

    Factors in:
    - Water availability constraints
    - Electricity/load shedding schedule
    - Labor availability
    - Cost optimization
    """
    try:
        scheduler = IrrigationScheduler()
        schedule = await scheduler.optimize_schedule(
            base_schedule=request,
            constraints=request.constraints,
        )

        return IrrigationScheduleResponse(**schedule)

    except Exception as e:
        logger.error("Schedule optimization failed", error=str(e))
        raise HTTPException(status_code=500, detail="Optimization error")


@router.post("/events/{event_id}/complete")
async def mark_irrigation_complete(
    event_id: str,
    actual_duration: int,
    soil_moisture_after: Optional[float] = None,
    notes: Optional[str] = None,
) -> dict:
    """
    Mark an irrigation event as completed.

    Used for feedback loop to improve future recommendations.
    """
    try:
        scheduler = IrrigationScheduler()
        result = await scheduler.complete_event(
            event_id=event_id,
            actual_duration=actual_duration,
            soil_moisture_after=soil_moisture_after,
            notes=notes,
        )

        return {
            "success": True,
            "event_id": event_id,
            "feedback_recorded": True,
            "next_adjustment": result.get("adjustment"),
        }

    except Exception as e:
        logger.error("Event completion failed", error=str(e))
        raise HTTPException(status_code=500, detail="Completion error")


@router.get("/alerts/{district}")
async def get_irrigation_alerts(
    district: str,
    farmer_id: Optional[str] = Query(None),
    severity: Optional[str] = Query(None, description="warning, critical"),
) -> dict:
    """
    Get irrigation alerts for a district/farmer.

    Includes:
    - Drought stress warnings
    - Optimal irrigation windows
    - Rainfall predictions affecting irrigation
    """
    try:
        scheduler = IrrigationScheduler()
        alerts = await scheduler.get_alerts(
            district=district,
            farmer_id=farmer_id,
            severity=severity,
        )

        return {
            "district": district,
            "alerts": alerts,
            "generated_at": date.today().isoformat(),
        }

    except Exception as e:
        logger.error("Alert fetch failed", error=str(e))
        raise HTTPException(status_code=500, detail="Alert fetch error")


@router.get("/water-budget/{district}/{crop}")
async def calculate_water_budget(
    district: str,
    crop: str,
    area_acres: float,
    growth_period_days: int = Query(120, description="Total growth period"),
) -> dict:
    """
    Calculate total water requirement for a crop season.

    Helps farmers plan water usage and costs.
    """
    try:
        scheduler = IrrigationScheduler()
        budget = await scheduler.calculate_water_budget(
            district=district,
            crop=crop,
            area_acres=area_acres,
            growth_period_days=growth_period_days,
        )

        return budget

    except Exception as e:
        logger.error("Water budget calculation failed", error=str(e))
        raise HTTPException(status_code=500, detail="Calculation error")
