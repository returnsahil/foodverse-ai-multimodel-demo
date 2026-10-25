export type View = 'overview' | 'analyze' | 'freshness' | 'hygiene' | 'cook' | 'meal-plan'

export type FoodAnalysis = {
  dish: string
  confidence: number
  items: { name: string; confidence: number; portion: string }[]
  nutrition: { calories: number; protein: number; carbs: number; fat: number; fiber: number }
  health_score: number
  freshness: 'Fresh' | 'Moderately Fresh' | 'Spoiled'
  freshness_confidence: number
  insights: string[]
}

export type HygieneAnalysis = {
  score: number
  status: string
  duration: string
  checks: { label: string; score: number; status: string }[]
  alerts: { time: string; message: string }[]
}

export type MealPlan = {
  goal: string
  target_calories: number
  meals: { time: string; name: string; calories: number }[]
  coach_note: string
}

export type Recipe = {
  title: string
  subtitle: string
  time: string
  difficulty: string
  ingredients: string[]
  steps: string[]
  tip: string
}

