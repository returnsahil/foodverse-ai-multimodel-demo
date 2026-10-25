# FoodVerse AI

A multimodal food-intelligence platform built with React and FastAPI. The current product slice includes a polished responsive dashboard, food-image recognition, nutrition and freshness summaries, kitchen-video hygiene review, adaptive cooking guidance, and personalized meal plans.

## What works

- Image upload with food recognition, portion estimates, macros, health score, freshness, and recommendations
- Dedicated freshness workflow using the same vision-service boundary
- Kitchen video upload with hygiene scoring, compliance checks, and timestamped alerts
- Natural-language recipe creation with ingredients, steps, and contextual tips
- Meal planning by goal, diet, and calorie target
- Responsive, accessible dashboard with actionable—not raw—AI output
- Typed React client and modular FastAPI domain services

The included inference services return deterministic demonstration results so the full experience works without model credentials. Production model adapters can replace the functions in `backend/app/services/` without changing the API or frontend.

## Run locally

### Frontend

```bash
pnpm install
pnpm dev
```

Open `http://localhost:5173`.

### Backend

```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.app.main:app --reload --port 8000
```

The API docs are available at `http://localhost:8000/docs`. Vite proxies `/api` calls to the backend.

Alternatively, run both services with:

```bash
docker compose up
```

## Architecture

```text
React client
  ├─ Food & freshness upload
  ├─ Hygiene video review
  ├─ Cooking copilot
  └─ Adaptive meal planner
          │
          ▼
FastAPI orchestration layer
  ├─ food_analysis service  → vision model + nutrition database
  ├─ hygiene service        → video sampling + detection/tracking
  ├─ recommendation service → LLM + profile/retrieval layer
  └─ response schemas       → normalized actionable insights
```

For production, add object storage for uploads, a job queue for long video analysis, PostgreSQL for user profiles/history, Redis for caching, and authenticated model-provider adapters. Confidence values and nutrition estimates should be labeled as estimates and validated against region-appropriate food databases.

