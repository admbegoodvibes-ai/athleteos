/**
 * Calcula o Wellness Score normalizado para 0-100.
 * Inputs: sleep, fatigue, soreness, stress, mood (1-5 cada)
 */
export function calculateWellnessScore(
  sleep: number, fatigue: number, soreness: number, stress: number, mood: number
): number {
  const values = [sleep, fatigue, soreness, stress, mood]
  values.forEach((v, i) => {
    if (v < 1 || v > 5) throw new Error(`Value at index ${i} must be between 1 and 5`)
  })
  const average = values.reduce((sum, v) => sum + v, 0) / values.length
  return Number(((average / 5) * 100).toFixed(2))
}
