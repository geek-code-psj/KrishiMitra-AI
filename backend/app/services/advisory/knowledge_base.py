"""
KrishiMitra AI - Knowledge Base
Agricultural advisory knowledge
"""

from typing import Dict, Any, Optional, List

import structlog

logger = structlog.get_logger()


class KnowledgeBase:
    """Knowledge base for agricultural advisory."""

    KNOWLEDGE_BASE = {
        "irrigation": {
            "rice": {
                "germination": "Keep soil continuously moist. Light irrigation after sowing.",
                "vegetative": "Maintain 2-5cm standing water. Increase during hot weather.",
                "flowering": "Critical stage - maintain water level. Avoid water stress.",
                "fruiting": "Gradually reduce water. Dry field 2 weeks before harvest.",
            },
            "wheat": {
                "germination": "Light irrigation immediately after sowing.",
                "vegetative": "Irrigate at crown root initiation (25-30 days).",
                "flowering": "Critical for grain formation. Maintain adequate moisture.",
                "fruiting": "Last irrigation at dough stage. Avoid excess water.",
            },
        },
        "pests": {
            "rice": {
                "stem_borer": "Use resistant varieties. Apply Carbofuran @ 3kg/acre.",
                "blast": "Avoid excess nitrogen. Spray Mancozeb @ 2g/liter.",
            },
            "wheat": {
                "rust": "Spray Propiconazole @ 1ml/liter at first appearance.",
                "aphid": "Use Imidacloprid @ 0.5ml/liter if threshold exceeded.",
            },
        },
        "fertilizer": {
            "rice": "N:P:K = 120:60:40 kg/ha. Apply N in 3 splits.",
            "wheat": "N:P:K = 120:60:40 kg/ha. Full P and K at sowing.",
            "maize": "N:P:K = 150:75:75 kg/ha. Side dress N at knee high stage.",
        },
    }

    async def get_irrigation_advice(
        self,
        entities: List[Dict[str, Any]],
        language: str = "hi",
        farmer_id: Optional[str] = None,
        location: Optional[Dict[str, float]] = None,
    ) -> Dict[str, Any]:
        """Get irrigation advice."""
        crop = self._extract_crop(entities) or "rice"
        stage = self._extract_stage(entities) or "vegetative"

        advice = self.KNOWLEDGE_BASE.get("irrigation", {}).get(crop, {}).get(stage,
            "Irrigate based on soil moisture. Check VIC data for your district.")

        return {
            "response_text": advice,
            "actions": [
                {"type": "check_moisture", "label": "Check Soil Moisture"},
                {"type": "view_schedule", "label": "View Irrigation Schedule"},
            ],
        }

    async def get_crop_recommendation(
        self,
        entities: List[Dict[str, Any]],
        language: str = "hi",
        farmer_id: Optional[str] = None,
        location: Optional[Dict[str, float]] = None,
    ) -> Dict[str, Any]:
        """Get crop recommendation."""
        return {
            "response_text": "Based on your location and season, I recommend Rice (IR64 variety). It has good yield potential and market demand.",
            "actions": [
                {"type": "view_plan", "label": "View Full Crop Plan"},
                {"type": "compare", "label": "Compare Other Crops"},
            ],
        }

    async def get_pest_disease_info(
        self,
        entities: List[Dict[str, Any]],
        language: str = "hi",
        farmer_id: Optional[str] = None,
        location: Optional[Dict[str, float]] = None,
    ) -> Dict[str, Any]:
        """Get pest and disease information."""
        crop = self._extract_crop(entities) or "rice"
        pest = self._extract_pest(entities)

        if pest:
            advice = self.KNOWLEDGE_BASE.get("pests", {}).get(crop, {}).get(pest, "Consult local agriculture officer.")
        else:
            advice = f"Common pests in {crop}: Monitor regularly and use integrated pest management."

        return {
            "response_text": advice,
            "actions": [
                {"type": "identify_pest", "label": "Identify Pest with Photo"},
                {"type": "contact_expert", "label": "Contact Agriculture Officer"},
            ],
        }

    async def get_market_price_info(
        self,
        entities: List[Dict[str, Any]],
        language: str = "hi",
        farmer_id: Optional[str] = None,
        location: Optional[Dict[str, float]] = None,
    ) -> Dict[str, Any]:
        """Get market price information."""
        crop = self._extract_crop(entities) or "rice"

        return {
            "response_text": f"Current {crop} price is ₹2,100 per quintal. Prices expected to increase 5% in next 2 weeks. Best time to sell is after 10 days.",
            "actions": [
                {"type": "view_prices", "label": "View Detailed Prices"},
                {"type": "price_alert", "label": "Set Price Alert"},
            ],
        }

    async def get_weather_info(
        self,
        entities: List[Dict[str, Any]],
        language: str = "hi",
        farmer_id: Optional[str] = None,
        location: Optional[Dict[str, float]] = None,
    ) -> Dict[str, Any]:
        """Get weather information."""
        return {
            "response_text": "Tomorrow: Light rain expected in evening. Temperature 28-34°C. Suitable for field work in morning. Consider irrigation if no rain.",
            "actions": [
                {"type": "forecast", "label": "7-Day Forecast"},
                {"type": "alerts", "label": "Weather Alerts"},
            ],
        }

    async def get_fertilizer_advice(
        self,
        entities: List[Dict[str, Any]],
        language: str = "hi",
        farmer_id: Optional[str] = None,
        location: Optional[Dict[str, float]] = None,
    ) -> Dict[str, Any]:
        """Get fertilizer advice."""
        crop = self._extract_crop(entities) or "rice"
        advice = self.KNOWLEDGE_BASE.get("fertilizer", {}).get(crop, "Apply balanced NPK based on soil test.")

        return {
            "response_text": advice,
            "actions": [
                {"type": "soil_test", "label": "Book Soil Test"},
                {"type": "calculator", "label": "Fertilizer Calculator"},
            ],
        }

    async def get_general_info(
        self,
        entities: List[Dict[str, Any]],
        language: str = "hi",
        farmer_id: Optional[str] = None,
        location: Optional[Dict[str, float]] = None,
    ) -> Dict[str, Any]:
        """Get general information."""
        return {
            "response_text": "I'm KrishiMitra, your AI farming assistant. I can help with irrigation schedules, crop recommendations, pest identification, market prices, and more. What would you like to know?",
            "actions": [
                {"type": "irrigation", "label": "Irrigation Advice"},
                {"type": "crops", "label": "Crop Recommendations"},
                {"type": "prices", "label": "Market Prices"},
            ],
        }

    def _extract_crop(self, entities: List[Dict[str, Any]]) -> Optional[str]:
        """Extract crop from entities."""
        for entity in entities:
            if entity.get("type") == "crop":
                return entity.get("value")
        return None

    def _extract_stage(self, entities: List[Dict[str, Any]]) -> Optional[str]:
        """Extract growth stage from entities."""
        # Simple extraction
        return None

    def _extract_pest(self, entities: List[Dict[str, Any]]) -> Optional[str]:
        """Extract pest name from entities."""
        return None
