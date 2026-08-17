import { Sparkles, BrainCircuit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getRealInsight } from '@/app/actions/ai';

export async function AthleteInsights({ 
  athleteId, 
  totalMatches, 
  totalTrainings, 
  avgRating 
}: {
  athleteId: string;
  totalMatches: number;
  totalTrainings: number;
  avgRating: string;
}) {
  const insight = await getRealInsight(athleteId, totalMatches, totalTrainings, avgRating);

  return (
    <Card className="col-span-4 bg-slate-900/60 border-slate-800/50 backdrop-blur-xl relative overflow-hidden group">
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur opacity-30 group-hover:opacity-70 transition duration-1000"></div>
      <CardHeader className="relative">
        <CardTitle className="text-slate-100 flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-purple-400" />
          AthleteOS Brain (IA)
        </CardTitle>
        <CardDescription className="text-slate-400">
          Análise personalizada gerada por Inteligência Artificial estruturada.
        </CardDescription>
      </CardHeader>
      <CardContent className="relative flex flex-col items-center justify-center p-8 border border-dashed border-purple-500/30 rounded-xl mx-6 mb-6 bg-slate-950/50">
        <div className="text-center space-y-4">
          <div className="inline-block p-3 rounded-full bg-purple-500/10 mb-2 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <Sparkles className="h-8 w-8 text-purple-400 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-slate-100">{insight.title}</h3>
          <p className="text-slate-300 max-w-md mx-auto leading-relaxed">
            {insight.description}
          </p>
          <div className="bg-purple-950/40 border border-purple-500/30 p-4 rounded-lg mt-4 inline-block text-left w-full max-w-md shadow-inner">
            <p className="text-xs text-purple-400 font-bold mb-1 uppercase tracking-wider">Foco Recomendado pela IA:</p>
            <p className="text-sm text-slate-200">{insight.focus}</p>
          </div>
          <div className="pt-4">
             <p className="text-[10px] text-slate-600 font-mono text-left opacity-50 overflow-hidden text-ellipsis whitespace-nowrap">Prompt Context: {insight.promptUsed?.trim().substring(0, 100)}...</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
