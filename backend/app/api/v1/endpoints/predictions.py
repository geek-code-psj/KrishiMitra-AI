"""
KrishiMitra AI - Predictions Endpoints
Yield forecasting and commodity price prediction
"""

from typing import Optional, List
from datetime import date, timedelta

from fastapi import APIRouter, Query, HTTPException
import structlog

from app.services.ml.yield_predictor import YieldPredictor
from app.services.ml.price_predictor import PricePredictor
from app.services.ml.crop_planner import CropPlanner
from app.schemas.predictions import (
    YieldPredictionRequest,
    YieldPredictionResponse,
    PricePredictionResponse,
    CropPlanRequest,
    CropPlanResponse,
)

logger = structlog.get_logger()
router = APIRouter()


@router.get("/yield/{crop}/{district}/{season}", response_model=YieldPredictionResponse)
async def predict_yield(
    crop: str,
    district: str,
    season: str = Query(..., description="kharif, rabi, or summer"),
    area_acres: float = Query(..., gt=0, description="Cultivated area in acres"),
    variety: Optional[str] = Query(None, description="Crop variety"),
    farmer_id: Optional[str] = Query(None, description="Farmer ID for personalized factors"),
) -> YieldPredictionResponse:
    """
    Predict crop yield using AIKosh historical data and ML models.

    **Path Parameters:**
    - **crop**: Crop name (rice, wheat, maize, etc.)
    - **district**: District code (e.g., "patna", "pune")
    - **season**: Growing season (kharif, rabi, summer)

    **Query Parameters:**
    - **area_acres**: Cultivated area in acres
    - **variety**: Specific variety name (optional)
    - **farmer_id**: For personalized recommendations (optional)

    **Returns:**
    Predicted yield in quintals with confidence intervals and contributing factors.

    **Example:**
    ```
    GET /predictions/yield/rice/patna/kharif?area_acres=2.5&variety=IR64
    ```
    """
    valid_seasons = ["kharif", "rabi", "summer"]
    if season.lower() not in valid_seasons:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid season. Must be one of: {valid_seasons}"
        )

    try:
        predictor = YieldPredictor()
        result = await predictor.predict(
            crop=crop,
            district=district,
            season=season,
            area_acres=area_acres,
            variety=variety,
            farmer_id=farmer_id,
        )

        logger.info(
            "Yield prediction generated",
            crop=crop,
            district=district,
            season=season,
            predicted_yield=result["predicted_yield_quintals"],
        )

        return YieldPredictionResponse(**result)

    except Exception as e:
        logger.error("Yield prediction failed", error=str(e))
        raise HTTPException(status_code=500, detail="Prediction service error")


@router.post("/yield/batch", response_model=List[YieldPredictionResponse])
async def predict_yield_batch(
    requests: List[YieldPredictionRequest],
) -> List[YieldPredictionResponse]:
    """
    Batch yield prediction for multiple crops/areas.

    Useful for comparing different crop options for the same land.
    """
    try:
        predictor = YieldPredictor()
        results = []

        for req in requests:
            result = await predictor.predict(
                crop=req.crop,
                district=req.district,
                season=req.season,
                area_acres=req.area_acres,
                variety=req.variety,
                farmer_id=req.farmer_id,
            )
            results.append(YieldPredictionResponse(**result))

        return results

    except Exception as e:
        logger.error("Batch yield prediction failed", error=str(e))
        raise HTTPException(status_code=500, detail="Batch prediction error")


@router.get("/price/{commodity}/{market}", response_model=PricePredictionResponse)
async def predict_price(
    commodity: str,
    market: str,
    days: int = Query(30, ge=7, le=90, description="Forecast horizon in days"),
    include_history: bool = Query(True, description="Include historical prices"),
) -> PricePredictionResponse:
    """
    Forecast commodity prices using time-series ML models.

    **Path Parameters:**
    - **commodity**: Commodity name (rice, wheat, tomato, onion, etc.)
    - **market**: Mandi/market name (delhi, mumbai, patna, etc.)

    **Query Parameters:**
    - **days**: Forecast horizon (7-90 days)
    - **include_history**: Include last 30 days historical prices

    **Returns:**
    Price forecasts with confidence bands and trend analysis.

    **Example:**
    ```
    GET /predictions/price/rice/delhi?days=30
    ```
    """
    try:
        predictor = PricePredictor()
        result = await predictor.predict(
            commodity=commodity,
            market=market,
            forecast_days=days,
            include_history=include_history,
        )

        logger.info(
            "Price prediction generated",
            commodity=commodity,
            market=market,
            forecast_days=days,
        )

        return PricePredictionResponse(**result)

    except Exception as e:
        logger.error("Price prediction failed", error=str(e))
        raise HTTPException(status_code=500, detail="Price prediction error")


@router.get("/price/comparison/{commodity}")
async def compare_market_prices(
    commodity: str,
    markets: List[str] = Query(..., description="List of markets to compare"),
    days: int = Query(7, ge=1, le=30),
) -> dict:
    """
    Compare predicted prices across multiple markets.

    Helps farmers decide which mandi to sell at for best returns.
    """
    if len(markets) > 5:
        raise HTTPException(status_code=400, detail="Maximum 5 markets allowed")

    try:
        predictor = PricePredictor()
        comparisons = []

        for market in markets:
            result = await predictor.predict(
                commodity=commodity,
                market=market,
                forecast_days=days,
                include_history=False,
            )
            comparisons.append({
                "market": market,
                "predicted_price": result["forecast"][0]["price"] if result["forecast"] else None,
                "trend": result["trend"],
                "volatility": result["volatility"],
            })

        # Sort by predicted price
        comparisons.sort(key=lambda x: x["predicted_price"] or 0, reverse=True)

        return {
            "commodity": commodity,
            "forecast_date": (date.today() + timedelta(days=days)).isoformat(),
            "comparisons": comparisons,
            "recommendation": comparisons[0]["market"] if comparisons else None,
        }

    except Exception as e:
        logger.error("Price comparison failed", error=str(e))
        raise HTTPException(status_code=500, detail="Comparison error")


@router.post("/crop-plan", response_model=CropPlanResponse)
async def generate_crop_plan(
    request: CropPlanRequest,
) -> CropPlanResponse:
    """
    Generate optimal crop plan based on predictions and constraints.

    Analyzes multiple factors:
    - Yield predictions for different crops
    - Price forecasts
    - Input costs
    - Risk factors
    - Farmer preferences

    Returns ranked crop recommendations with ROI analysis.
    """
    try:
        planner = CropPlanner()
        result = await planner.generate_plan(
            district=request.district,
            season=request.season,
            area_acres=request.area_acres,
            soil_type=request.soil_type,
            water_availability=request.water_availability,
            budget=request.budget,
            preferences=request.preferences,
            risk_tolerance=request.risk_tolerance,
        )

        logger.info(
            "Crop plan generated",
            district=request.district,
            season=request.season,
            recommendations_count=len(result.get("recommendations", [])),
        )

        return CropPlanResponse(**result)

    except Exception as e:
        logger.error("Crop plan generation failed", error=str(e))
        raise HTTPException(status_code=500, detail="Planning error")


@router.get("/trends/{district}")
async def get_district_trends(
    district: str,
    year: Optional[int] = Query(None, description="Year for historical comparison"),
) -> dict:
    """
    Get agricultural trends for a district.

    Includes yield trends, price volatility, and climate patterns.
    """
    try:
        predictor = YieldPredictor()
        price_predictor = PricePredictor()

        # Get multi-year trends
        trends = await predictor.get_district_trends(district, year)
        price_trends = await price_predictor.get_district_price_trends(district)

        return {
            "district": district,
            "yield_trends": trends,
            "price_trends": price_trends,
            "year": year or date.today().year,
        }

    except Exception as e:
        logger.error("Trend analysis failed", error=str(e))
        raise HTTPException(status_code=500, detail="Trend analysis error")
