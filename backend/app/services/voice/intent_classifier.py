"""
KrishiMitra AI - Intent Classifier
Classify farmer query intent using NLP
"""

from typing import Dict, Any, List
import re

import structlog

logger = structlog.get_logger()


class IntentClassifier:
    """Classify intents from farmer queries."""

    INTENT_PATTERNS = {
        "irrigation_advice": [
            r"(?i)(water|irrigate|pani|pour|flood|dry|moisture|soil)",
            r"(?i)(when.*water|how.*much.*water|sprinkler|drip)",
        ],
        "crop_recommendation": [
            r"(?i)(what.*crop|which.*crop|sow|plant|kheti|farming)",
            r"(?i)(best.*crop|suitable.*crop|variety|seed)",
        ],
        "pest_disease": [
            r"(?i)(pest|disease|insect|keeda|rog|fungus|attack|worm)",
            r"(?i)(spray|medicine|dawa|treatment|symptom)",
        ],
        "market_price": [
            r"(?i)(price|rate|bhav|market|sell|buy|mandi|bazar)",
            r"(?i)(kitne.*paise|rate.*kya|selling.*price)",
        ],
        "weather": [
            r"(?i)(weather|mausam|rain|barish|temperature|forecast)",
            r"(?i)(rainfall|humidity|hot|cold|summer|winter)",
        ],
        "fertilizer": [
            r"(?i)(fertilizer|khad|urea|dap|npk|compost|manure)",
            r"(?i)(how.*much.*fertilizer|when.*apply|organic)",
        ],
    }

    async def classify(self, text: str, language: str = "hi") -> Dict[str, Any]:
        """Classify intent from text."""

        text_lower = text.lower()
        scores = {}

        # Score each intent
        for intent, patterns in self.INTENT_PATTERNS.items():
            score = 0
            for pattern in patterns:
                if re.search(pattern, text_lower):
                    score += 1
            scores[intent] = score

        # Get best intent
        best_intent = max(scores, key=scores.get) if max(scores.values()) > 0 else "general_info"

        # Extract entities
        entities = self._extract_entities(text_lower)

        return {
            "intent": best_intent,
            "confidence": min(0.95, 0.5 + (scores[best_intent] * 0.25)),
            "entities": entities,
            "all_scores": scores,
        }

    def _extract_entities(self, text: str) -> List[Dict[str, Any]]:
        """Extract entities from text."""
        entities = []

        # Crop entities
        crops = ["rice", "wheat", "maize", "tomato", "onion", "potato", "cotton", "sugarcane",
                 "dhaan", "gehun", "makka", "paddy"]
        for crop in crops:
            if crop in text:
                entities.append({"type": "crop", "value": crop, "start": text.find(crop)})

        # District/location
        districts = ["patna", "pune", "hyderabad", "delhi", "mumbai", "lucknow"]
        for district in districts:
            if district in text:
                entities.append({"type": "district", "value": district, "start": text.find(district)})

        # Numbers (acre, quintal, etc.)
        numbers = re.findall(r'(\d+(?:\.\d+)?)\s*(acre|quintal|kg|liter)', text)
        for num, unit in numbers:
            entities.append({"type": "quantity", "value": f"{num} {unit}", "unit": unit})

        return entities
