'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface EvaluationRadarProps {
  evaluations: any[];
}

export function EvaluationRadar({ evaluations }: EvaluationRadarProps) {
  if (!evaluations || evaluations.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-900 rounded-xl border border-slate-800 text-slate-500">
        Nenhuma avaliação registrada ainda.
      </div>
    );
  }

  // Calculate averages by domain
  const domainScores: Record<string, { total: number; count: number }> = {};

  evaluations.forEach(ev => {
    if (ev.evaluation_scores) {
      ev.evaluation_scores.forEach((s: any) => {
        const domain = s.evaluation_items?.domain;
        if (domain && s.score) {
          if (!domainScores[domain]) domainScores[domain] = { total: 0, count: 0 };
          domainScores[domain].total += Number(s.score);
          domainScores[domain].count += 1;
        }
      });
    }
  });

  const data = Object.keys(domainScores).map(domain => ({
    domain,
    Nota: Math.round((domainScores[domain].total / domainScores[domain].count) * 10) / 10,
    fullMark: 10
  }));

  if (data.length === 0) return null;

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="domain" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} />
          <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: '#64748b' }} tickCount={6} />
          <Radar
            name="Média do Atleta"
            dataKey="Nota"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.4}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '8px' }}
            itemStyle={{ color: '#10b981' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
