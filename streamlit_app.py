import streamlit as st

from backend.app.services.food_analysis import analyze_food
from backend.app.services.recommendations import build_meal_plan, build_recipe
from backend.app.models import MealPlanRequest


st.set_page_config(page_title="FoodVerse AI", page_icon="🥗", layout="wide")

st.markdown(
    """
    <style>
    .block-container { max-width: 1180px; padding-top: 2rem; }
    .hero { padding: 1.6rem 1.8rem; border-radius: 22px; background: linear-gradient(120deg,#e7f0d1,#f5f7ef); margin-bottom: 1.4rem; }
    .hero h1 { margin: 0; color: #204f39; font-size: 2.8rem; }
    .hero p { color: #68786b; margin: .5rem 0 0; }
    [data-testid="stMetricValue"] { color: #285a43; }
    </style>
    """,
    unsafe_allow_html=True,
)

st.markdown(
    '<div class="hero"><h1>foodverse<span style="color:#8da84c">.</span></h1>'
    '<p>Understand your food. Make one small, healthier choice.</p></div>',
    unsafe_allow_html=True,
)

tab_food, tab_cook, tab_plan = st.tabs(["Analyze a meal", "Cooking assistant", "Meal planner"])

with tab_food:
    st.subheader("Point. Snap. Know your food.")
    uploaded = st.file_uploader("Upload a food image", type=["jpg", "jpeg", "png", "webp"])
    if uploaded and st.button("Analyze meal", type="primary"):
        result = analyze_food(uploaded.name, uploaded.getvalue())
        left, right = st.columns([1.4, 1])
        with left:
            st.image(uploaded, caption=uploaded.name, use_container_width=True)
        with right:
            st.metric("Health score", f"{result.health_score}/100")
            st.metric("Estimated calories", f"{result.nutrition.calories} kcal")
            st.write(f"**{result.dish}** · {result.freshness} ({result.confidence:.0%} confidence)")
            st.write("**Recognized items**")
            for item in result.items:
                st.write(f"• {item.name} — {item.portion}")
            st.info(" · ".join(result.insights))
    else:
        st.info("Upload a meal photo to see recognition, nutrition, freshness, and practical insights.")

with tab_cook:
    st.subheader("Cook with confidence")
    prompt = st.text_area("What do you want to cook?", placeholder="I have chickpeas, spinach, and tomatoes...")
    if st.button("Create recipe", type="primary"):
        if len(prompt.strip()) < 2:
            st.warning("Tell me at least a little about what you want to cook.")
        else:
            recipe = build_recipe(prompt)
            st.markdown(f"### {recipe['title']}")
            st.caption(f"{recipe['subtitle']} · {recipe['time']} · {recipe['difficulty']}")
            col_a, col_b = st.columns(2)
            with col_a:
                st.write("**Ingredients**")
                for ingredient in recipe["ingredients"]:
                    st.write(f"• {ingredient}")
            with col_b:
                st.write("**Steps**")
                for index, step in enumerate(recipe["steps"], 1):
                    st.write(f"{index}. {step}")
            st.success(recipe["tip"])

with tab_plan:
    st.subheader("A plan that fits your day")
    goal = st.selectbox("Goal", ["balanced", "weight-loss", "muscle-gain", "heart-health"])
    diet = st.selectbox("Diet", ["everything", "vegetarian", "vegan", "pescatarian"])
    calories = st.slider("Daily calories", 1200, 4500, 2000, 100)
    if st.button("Build meal plan", type="primary"):
        plan = build_meal_plan(MealPlanRequest(goal=goal, diet=diet, calories=calories))
        st.write(f"**{plan['target_calories']} kcal · {plan['goal'].replace('-', ' ').title()}**")
        for meal in plan["meals"]:
            st.write(f"**{meal['time']}** — {meal['name']} · {meal['calories']} kcal")
        st.info(plan["coach_note"])

st.caption("Demo mode: deterministic FoodVerse inference. Nutrition values are estimates, not medical advice.")
