from pathlib import Path
from ..models import FoodAnalysis, FoodItem, Nutrition


FOOD_HINTS = {
    "salad": ("Mediterranean harvest bowl", 428, 18, 49, 19),
    "pizza": ("Garden vegetable pizza", 684, 27, 82, 28),
    "pasta": ("Tomato basil pasta", 612, 21, 94, 18),
    "rice": ("Vegetable rice bowl", 536, 19, 86, 14),
    "curry": ("Chickpea vegetable curry", 514, 24, 67, 18),
    "fruit": ("Seasonal fruit plate", 246, 4, 59, 2),
}


def analyze_food(filename: str, content: bytes) -> FoodAnalysis:
    """Deterministic demo inference. Swap this adapter for a vision model in production."""
    stem = Path(filename).stem.lower()
    key = next((name for name in FOOD_HINTS if name in stem), "salad")
    dish, calories, protein, carbs, fat = FOOD_HINTS[key]
    # A tiny, deterministic content signal keeps the demo responsive without pretending to be a trained model.
    confidence = round(0.87 + (len(content) % 9) / 100, 2)
    freshness_cycle = ["Fresh", "Fresh", "Moderately Fresh"]
    freshness = freshness_cycle[len(content) % len(freshness_cycle)]
    return FoodAnalysis(
        dish=dish,
        confidence=confidence,
        items=[
            FoodItem(name="Leafy greens", confidence=0.96, portion="2 cups"),
            FoodItem(name="Roasted chickpeas", confidence=0.92, portion="¾ cup"),
            FoodItem(name="Cherry tomatoes", confidence=0.89, portion="½ cup"),
            FoodItem(name="Avocado", confidence=0.86, portion="½ medium"),
        ],
        nutrition=Nutrition(calories=calories, protein=protein, carbs=carbs, fat=fat, fiber=12),
        health_score=88 if freshness == "Fresh" else 74,
        freshness=freshness,
        freshness_confidence=0.93,
        insights=[
            "High in fiber and plant protein",
            "Good balance of complex carbs and healthy fats",
            "Sodium appears moderate; dressing quantity can change the estimate",
        ],
    )

