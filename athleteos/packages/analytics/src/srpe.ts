/**
 * Calcula a Carga de Treino Subjetiva (sRPE = RPE x Duracao em minutos).
 */
export function calculateSRPE(rpe: number, durationMinutes: number): number {
  if (rpe < 1 || rpe > 10) throw new Error('RPE must be between 1 and 10')
  if (durationMinutes <= 0) throw new Error('Duration must be positive')
  return rpe * durationMinutes
}
