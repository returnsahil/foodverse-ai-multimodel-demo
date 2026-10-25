from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from .models import FoodAnalysis, MealPlanRequest, RecipeRequest
from .services.food_analysis import analyze_food
from .services.recommendations import build_meal_plan, build_recipe

app = FastAPI(
    title="FoodVerse AI API",
    description="Modular multimodal food intelligence services.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health() -> dict:
    return {"status": "healthy", "services": ["vision", "nutrition", "freshness", "hygiene", "planner"]}


@app.post("/api/analyze/food", response_model=FoodAnalysis)
async def food_analysis(file: UploadFile = File(...)) -> FoodAnalysis:
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=415, detail="Please upload an image file.")
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Image must be smaller than 10 MB.")
    return analyze_food(file.filename or "food.jpg", content)


@app.post("/api/analyze/hygiene")
async def hygiene_analysis(file: UploadFile = File(...)) -> dict:
    if not file.content_type or not file.content_type.startswith("video/"):
        raise HTTPException(status_code=415, detail="Please upload a video file.")
    return {
        "score": 86,
        "status": "Good",
        "duration": "00:42",
        "checks": [
            {"label": "Glove usage", "score": 94, "status": "Pass"},
            {"label": "Hair restraint", "score": 88, "status": "Pass"},
            {"label": "Surface cleanliness", "score": 82, "status": "Review"},
            {"label": "Safe food handling", "score": 91, "status": "Pass"},
        ],
        "alerts": [{"time": "00:31", "message": "Wipe preparation surface before the next task."}],
    }


@app.post("/api/meal-plan")
def meal_plan(request: MealPlanRequest) -> dict:
    return build_meal_plan(request)


@app.post("/api/recipe")
def recipe(request: RecipeRequest) -> dict:
    return build_recipe(request.prompt)

