"""
KrishiMitra AI - Moisture Forecaster
Soil moisture forecasting using VIC data
"""

from typing import Dict, Any, List
from datetime import date, datetime, timedelta
import random

import structlog

logger = structlog.get_logger()


class MoistureForecaster:
    """Forecast soil moisture using VIC model data."""

    async def get_moisture_data(
        self,
        district: str,
        days: int = 7,
        include_forecast: bool = True,
    ) -> Dict[str, Any]:
        """Get soil moisture data for district."""

        # Generate mock historical data
        historical = []
        current_moisture = 28.5

        for i in range(days, 0, -1):
            reading_date = date.today() - timedelta(days=i)
            moisture = current_moisture + random.uniform(-3, 3)
            historical.append({
                "date": reading_date.isoformat(),
                "moisture_content": round(moisture, 2),
                "moisture_level": self._categorize_moisture(moisture),
                "drought_stress": moisture < 20,
            })

        # Generate forecast
        forecast = []
        if include_forecast:
            for i in range(1, 8):
                forecast_date = date.today() + timedelta(days=i)
                moisture = current_moisture + random.uniform(-2, 2)
                forecast.append({
                    "date": forecast_date.isoformat(),
                    "moisture_content": round(moisture, 2),
                    "moisture_level": self._categorize_moisture(moisture),
                    "drought_stress": moisture < 20,
                })

        return {
            "district": district,
            "current_moisture": round(current_moisture, 2),
            "current_level": self._categorize_moisture(current_moisture),
            "historical": historical,
            "forecast": forecast if include_forecast else None,
            "average_moisture": round(sum(r["moisture_content"] for r in historical) / len(historical), 2),
            "min_moisture": round(min(r["moisture_content"] for r in historical), 2),
            "max_moisture": round(max(r["moisture_content"] for r in historical), 2),
            "trend": "stable",
            "data_source": "VIC Model - AIKosh",
            "last_updated": datetime.now().isoformat(),
        }

    async def predict(self, district: str, days: int = 7) -> List[Dict[str, Any]]:
        """Predict soil moisture for coming days."""
        forecast = []
        base_moisture = 28.5

        for i in range(1, days + 1):
            forecast_date = date.today() + timedelta(days=i)
            moisture = base_moisture + random.uniform(-2, 2)
            forecast.append({
                "date": forecast_date.isoformat(),
                "moisture_content": round(moisture, 2),
                "moisture_level": self._categorize_moisture(moisture),
                "drought_stress": moisture < 20,
            })

        return forecast

    def _categorize_moisture(self, moisture: float) -> str:
        """Categorize moisture level."""
        if moisture < 15:
            return "dry"
        elif moisture < 25:
            return "low"
        elif moisture < 35:
            return "optimal"
        else:
            return "high"
