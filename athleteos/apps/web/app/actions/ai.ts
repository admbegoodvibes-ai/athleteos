'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { cookies } from 'next/headers';

export async function getRealInsight(athleteId: string, totalMatches: number, totalTrainings: number, avgRating: string) {
  const supabase = createAdminClient();

  // 1. Coletar o contexto rico do atleta
  const { data: pdis } = await supabase
    .from('pdi_goals')
    .select('title, status')
    .eq('athlete_id', athleteId)
    .eq('status', 'in_progress');

  const { data: evaluations } = await supabase
    .from('evaluations')
    .select('general_notes, created_at')
    .eq('athlete_id', athleteId)
    .order('created_at', { ascending: false })
    .limit(1);

  // Aqui montaríamos o Prompt:
  const promptContext = `
    Atleta: ${athleteId}
    Partidas: ${totalMatches}
    Treinos: ${totalTrainings}
    Nota Média: ${avgRating}
    PDIs Ativos: ${pdis?.map(p => p.title).join(', ') || 'Nenhum'}
    Última Avaliação do Olheiro: ${evaluations?.[0]?.general_notes || 'Nenhuma'}
  `;

  // Se a chave existir, rodamos o Vercel AI SDK real. 
  // Como não há chave no `.env` ainda, criamos um simulador profundo que finge ser o LLM gerando o texto.
  
  // Simulando latência de LLM (2.5 segundos)
  await new Promise(resolve => setTimeout(resolve, 2500));

  const hasGoodRating = Number(avgRating) >= 7;
  const hasPdi = pdis && pdis.length > 0;
  const hasEval = evaluations && evaluations.length > 0;

  let title = 'Processando sua jornada...';
  let description = '';
  let focus = '';

  if (totalMatches === 0 && totalTrainings === 0) {
    title = 'Bem-vindo ao AthleteOS IA';
    description = 'Sou seu assistente de inteligência artificial. Quando você começar a registrar seus jogos e treinos, eu analisarei seus dados para te dar dicas táticas personalizadas.';
    focus = 'Registre seu primeiro evento.';
  } else {
    if (hasGoodRating) {
      title = 'Em Alta Performance 🔥';
      description = `Analisei seus últimos jogos (Média ${avgRating}). Seu desempenho está acima da curva. ` +
        (hasEval ? `O relatório do olheiro confirmou: "${evaluations[0].general_notes}". ` : '') +
        `É hora de consolidar essa fase e buscar a titularidade indiscutível.`;
      focus = hasPdi ? `Continue focando no seu PDI: ${pdis[0].title}` : 'Manutenção física e consistência tática.';
    } else {
      title = 'Momento de Ajustes 🧠';
      description = `Notei que sua média recente (${avgRating}) tem oscilado. Isso é normal no alto rendimento. ` +
        (hasPdi ? `O segredo para virar o jogo está no seu PDI aberto sobre '${pdis[0].title}'. ` : 'Precisamos alinhar seus treinos para corrigir os fundamentos técnicos.') +
        `Vamos intensificar a recuperação física pós-jogo.`;
      focus = 'Aumentar carga de treinos técnicos e revisar os vídeos táticos.';
    }
  }

  return {
    title,
    description,
    focus,
    promptUsed: promptContext
  };
}
