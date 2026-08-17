export function buildMatchAnalysisPrompt(athleteName: string, position: string, matchData: any): string {
  return `
Por favor, gere uma análise detalhada da partida para o atleta ${athleteName}, que atua na posição de ${position}.
Dados da partida:
${JSON.stringify(matchData, null, 2)}

A análise deve ser baseada nos dados acima e estruturada estritamente de acordo com o esquema JSON esperado.
Retorne APENAS o JSON válido, sem texto ou markdown adicional.
  `.trim();
}
