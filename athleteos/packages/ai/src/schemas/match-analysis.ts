import { z } from 'zod'

export const MatchAnalysisSchema = z.object({
  tactical_notes: z.array(z.string()),
  technical_evaluation: z.object({
    passing: z.number().min(1).max(10),
    dribbling: z.number().min(1).max(10),
    shooting: z.number().min(1).max(10),
    positioning: z.number().min(1).max(10),
    first_touch: z.number().min(1).max(10),
  }),
  physical_rating: z.number().min(1).max(10),
  mental_rating: z.number().min(1).max(10),
  strengths: z.array(z.string()),
  improvement_areas: z.array(z.string()),
  training_recommendations: z.array(z.string()),
  overall_score: z.number().min(1).max(10),
  summary: z.string(),
})

export type MatchAnalysis = z.infer<typeof MatchAnalysisSchema>
