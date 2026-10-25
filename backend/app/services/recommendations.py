from ..models import MealPlanRequest


def build_meal_plan(request: MealPlanRequest) -> dict:
    multiplier = request.calories / 2000
    options = {
        "everything": ("Herb chicken grain bowl", "Miso salmon & greens"),
        "vegetarian": ("Paneer quinoa bowl", "Lentil bolognese"),
        "vegan": ("Tempeh harvest bowl", "Red lentil curry"),
        "pescatarian": ("Tuna quinoa bowl", "Miso salmon & greens"),
    }
    lunch, dinner = options[request.diet]
    meals = [
        ("Breakfast", "Overnight oats with berries", 410),
        ("Lunch", lunch, 560),
        ("Snack", "Apple, almonds & yogurt", 260),
        ("Dinner", dinner, 670),
    ]
    return {
        "goal": request.goal,
        "target_calories": request.calories,
        "meals": [
            {"time": time, "name": name, "calories": round(cals * multiplier)}
            for time, name, cals in meals
        ],
        "coach_note": "Keep water nearby and aim for a palm-sized protein serving at lunch and dinner.",
    }


def build_recipe(prompt: str) -> dict:
    return {
        "title": "Lemon herb chickpea skillet",
        "subtitle": f"A quick, balanced idea inspired by “{prompt.strip()}”",
        "time": "24 min",
        "difficulty": "Easy",
        "ingredients": ["Chickpeas", "Cherry tomatoes", "Spinach", "Lemon", "Garlic", "Herbs"],
        "steps": [
            "Warm olive oil and gently bloom the garlic.",
            "Add chickpeas and tomatoes; cook until the tomatoes soften.",
            "Fold in spinach, lemon zest, juice, and fresh herbs.",
            "Taste, season, and serve with toasted whole-grain bread.",
        ],
        "tip": "Pat the chickpeas dry before cooking for better browning.",
    }

