from typing import Literal
from pydantic import BaseModel, Field


class Nutrition(BaseModel):
    calories: int
    protein: float
    carbs: float
    fat: float
    fiber: float


class FoodItem(BaseModel):
    name: str
    confidence: float
    portion: str


class FoodAnalysis(BaseModel):
    dish: str
    confidence: float
    items: list[FoodItem]
    nutrition: Nutrition
    health_score: int
    freshness: Literal["Fresh", "Moderately Fresh", "Spoiled"]
    freshness_confidence: float
    insights: list[str]


class MealPlanRequest(BaseModel):
    goal: Literal["balanced", "weight-loss", "muscle-gain", "heart-health"] = "balanced"
    diet: Literal["everything", "vegetarian", "vegan", "pescatarian"] = "everything"
    calories: int = Field(default=2000, ge=1200, le=4500)


class RecipeRequest(BaseModel):
    prompt: str = Field(min_length=2, max_length=500)

