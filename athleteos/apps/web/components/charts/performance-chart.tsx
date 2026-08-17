'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function PerformanceChart({ matches }: { matches: any[] }) {
  if (!matches || matches.length === 0) return null;

  const validMatches = matches.filter(m => m.self_rating != null && m.self_rating > 0);
  if (validMatches.length < 2) return null; // Need at least 2 points to draw a line

  // Sort chronologically
  const sortedMatches = [...validMatches].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const data = sortedMatches.map((m, index) => ({
    name: `Jogo ${index + 1}`,
    nota: m.self_rating,
    data: new Date(m.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    adversario: m.opponent
  }));

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="data" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 10]} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc' }}
            itemStyle={{ color: '#10b981' }}
            labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
            formatter={(value: any, name: any, props: any) => [
              `${value} (${props.payload.adversario})`,
              'Nota'
            ]}
          />
          <Line 
            type="monotone" 
            dataKey="nota" 
            stroke="#10b981" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#020617' }} 
            activeDot={{ r: 6, fill: '#10b981', stroke: '#fff' }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
