import type { FoodAnalysis, HygieneAnalysis, MealPlan, Recipe } from './types'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, options)
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.detail || 'Something went wrong. Please try again.')
  }
  return response.json() as Promise<T>
}

export function analyzeFood(file: File) {
  const body = new FormData()
  body.append('file', file)
  return request<FoodAnalysis>('/api/analyze/food', { method: 'POST', body })
}

export function analyzeHygiene(file: File) {
  const body = new FormData()
  body.append('file', file)
  return request<HygieneAnalysis>('/api/analyze/hygiene', { method: 'POST', body })
}

export function createMealPlan(goal: string, diet: string, calories: number) {
  return request<MealPlan>('/api/meal-plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ goal, diet, calories }),
  })
}

export function createRecipe(prompt: string) {
  return request<Recipe>('/api/recipe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })
}

