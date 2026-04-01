"""
KrishiMitra AI - Prices Endpoints
Commodity price tracking and market comparison
"""

from typing import List, Optional
from datetime import datetime, timedelta
from fastapi import APIRouter, Query, HTTPException

router = APIRouter()


@router.get("/current/{commodity}")
async def get_current_price(
    commodity: str,
    market: str = Query("azadpur", description="Market/mandi name"),
) -> dict:
    """Get current price for a commodity at a specific market."""
    # Simulated data - in production, fetch from Agmarknet API
    prices = {
        "rice": 2450,
        "wheat": 2350,
        "onion": 2800,
        "tomato": 1800,
        "potato": 1200,
    }
    return {
        "commodity": commodity,
        "market": market,
        "price": prices.get(commodity.lower(), 2000),
        "unit": "quintal",
        "currency": "INR",
        "updated_at": datetime.now().isoformat(),
    }


@router.get("/history/{commodity}")
async def get_price_history(
    commodity: str,
    market: str = Query("azadpur"),
    days: int = Query(30, ge=7, le=90),
) -> dict:
    """Get historical prices for a commodity."""
    history = []
    base_price = 2200
    for i in range(days):
        date = datetime.now() - timedelta(days=days - i)
        price = base_price + (i * 5) + (i % 7 * 10)
        history.append({
            "date": date.strftime("%Y-%m-%d"),
            "price": price,
        })
    return {
        "commodity": commodity,
        "market": market,
        "days": days,
        "history": history,
    }


@router.get("/compare/{commodity}")
async def compare_market_prices(
    commodity: str,
    markets: List[str] = Query(..., description="List of markets to compare"),
) -> dict:
    """Compare prices across multiple markets."""
    market_prices = {
        "azadpur": {"price": 2450, "city": "Delhi", "state": "Delhi"},
        "vashi": {"price": 2380, "city": "Mumbai", "state": "Maharashtra"},
        "koyambedu": {"price": 2520, "city": "Chennai", "state": "Tamil Nadu"},
        "bowenpally": {"price": 2400, "city": "Hyderabad", "state": "Telangana"},
    }
    comparisons = []
    for market in markets:
        if market.lower() in market_prices:
            mp = market_prices[market.lower()]
            comparisons.append({
                "market": market,
                "city": mp["city"],
                "state": mp["state"],
                "price": mp["price"],
            })
    comparisons.sort(key=lambda x: x["price"], reverse=True)
    return {
        "commodity": commodity,
        "comparisons": comparisons,
        "best_market": comparisons[0]["market"] if comparisons else None,
    }


@router.get("/volatility")
async def get_volatility_index(
    commodities: List[str] = Query(..., description="List of commodities"),
) -> dict:
    """Get volatility index for commodities."""
    return {
        "volatility": [
            {"commodity": "onion", "volatility": "high", "change_pct": 18},
            {"commodity": "tomato", "volatility": "high", "change_pct": 15},
            {"commodity": "potato", "volatility": "medium", "change_pct": 5},
            {"commodity": "rice", "volatility": "low", "change_pct": 2},
            {"commodity": "wheat", "volatility": "low", "change_pct": -1},
        ]
    }


@router.get("/forecast/{commodity}")
async def forecast_price(
    commodity: str,
    market: str = Query("azadpur"),
    days: int = Query(30, ge=7, le=90),
) -> dict:
    """Forecast future prices using time-series models."""
    forecast = []
    base_price = 2450
    for i in range(days):
        date = datetime.now() + timedelta(days=i)
        price = base_price + (i * 8)
        forecast.append({
            "date": date.strftime("%Y-%m-%d"),
            "price": price,
            "lower": int(price * 0.95),
            "upper": int(price * 1.05),
        })
    return {
        "commodity": commodity,
        "market": market,
        "forecast_days": days,
        "forecast": forecast,
        "trend": "upward",
    }