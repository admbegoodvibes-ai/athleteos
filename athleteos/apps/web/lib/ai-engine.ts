export function generateInsight(matches: any[], trainings: any[]) {
  if (!matches || matches.length === 0) {
    return {
      title: 'Precisamos de mais dados!',
      description: 'Registre suas primeiras partidas para que possamos traçar seu perfil de desenvolvimento e gerar insights.',
      focus: 'Treino e Jogo'
    };
  }

  // Calculate recent average rating (last 3 matches)
  const recentMatches = [...matches].sort((a, b) => new Date(b.match_date).getTime() - new Date(a.match_date).getTime()).slice(0, 3);
  const avgRating = recentMatches.reduce((acc, m) => acc + (m.self_rating || 0), 0) / recentMatches.length;

  const totalTrainingMinutes = trainings?.reduce((acc, t) => acc + (t.duration_minutes || 0), 0) || 0;
  const hasTrainings = totalTrainingMinutes > 0;

  if (avgRating >= 8) {
    return {
      title: 'Excelente Fase! 🔥',
      description: `Sua média recente é de ${avgRating.toFixed(1)}/10. O desempenho técnico e tático está altíssimo nos últimos jogos.`,
      focus: hasTrainings ? 'Manutenção física e recuperação para evitar lesões.' : 'Manter o foco e adicionar treinos físicos à rotina.'
    };
  } else if (avgRating >= 6) {
    return {
      title: 'Desempenho Estável 📈',
      description: `Sua média recente é de ${avgRating.toFixed(1)}/10. Você tem mantido um bom ritmo, mas há espaço para subir o nível.`,
      focus: 'Focar em treinos táticos e corrigir os pontos fracos apontados nas últimas partidas.'
    };
  } else {
    return {
      title: 'Momento de Foco e Superação 💪',
      description: `Sua média recente foi de ${avgRating.toFixed(1)}/10. Fases difíceis fazem parte da evolução de qualquer atleta de alto nível.`,
      focus: 'Priorizar o trabalho mental e alinhar as expectativas com os treinadores. O próximo treino é a chave!'
    };
  }
}
