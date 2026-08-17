'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search, Filter, Activity, MapPin, Footprints, Info } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

interface ScoutDashboardProps {
  initialAthletes: any[];
}

export function ScoutDashboard({ initialAthletes }: ScoutDashboardProps) {
  const [athletes, setAthletes] = useState(initialAthletes);
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState('');
  const [minPassAcc, setMinPassAcc] = useState('');
  const [strongFoot, setStrongFoot] = useState('');

  const handleFilter = () => {
    let filtered = [...initialAthletes];

    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(a => 
        (a.full_name || '').toLowerCase().includes(s) ||
        (a.location || '').toLowerCase().includes(s)
      );
    }

    if (position) {
      filtered = filtered.filter(a => (a.position || '').toLowerCase().includes(position.toLowerCase()));
    }

    if (strongFoot) {
      filtered = filtered.filter(a => (a.strong_foot || '').toLowerCase() === strongFoot.toLowerCase());
    }

    if (minPassAcc) {
      const minAcc = parseInt(minPassAcc);
      filtered = filtered.filter(a => (a.stats?.avgPassAccuracy || 0) >= minAcc);
    }

    setAthletes(filtered);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Filters Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0 space-y-6">
        <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800">
          <h3 className="font-bold text-slate-100 flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4" />
            Filtros Avançados
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Buscar por Nome</Label>
              <Input 
                placeholder="Ex: Thomas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-slate-950 border-slate-800"
              />
            </div>

            <div className="space-y-2">
              <Label>Posição</Label>
              <select 
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Todas</option>
                <option value="Atacante">Atacante</option>
                <option value="Meio-Campo">Meio-Campo</option>
                <option value="Zagueiro">Zagueiro</option>
                <option value="Goleiro">Goleiro</option>
                <option value="Lateral">Lateral</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Pé Dominante</Label>
              <select 
                value={strongFoot}
                onChange={(e) => setStrongFoot(e.target.value)}
                className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Qualquer</option>
                <option value="Destro">Destro</option>
                <option value="Canhoto">Canhoto</option>
                <option value="Ambidestro">Ambidestro</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Precisão de Passe Mínima (%)</Label>
              <Input 
                type="number"
                placeholder="Ex: 80"
                value={minPassAcc}
                onChange={(e) => setMinPassAcc(e.target.value)}
                className="bg-slate-950 border-slate-800"
              />
            </div>

            <Button onClick={handleFilter} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white gap-2">
              <Search className="w-4 h-4" />
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-200">
            Resultados ({athletes.length})
          </h2>
        </div>

        {athletes.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed text-slate-400">
            <Search className="w-12 h-12 text-slate-600 mb-4" />
            <p>Nenhum atleta encontrado com esses filtros.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {athletes.map(athlete => (
              <Card key={athlete.id} className="bg-slate-900 border-slate-800 hover:border-emerald-500/50 transition-colors group overflow-hidden">
                <div className="h-24 bg-gradient-to-br from-slate-800 to-slate-950 relative">
                  {athlete.avatar_url && (
                    <img src={athlete.avatar_url} alt={athlete.full_name} className="w-16 h-16 rounded-full border-4 border-slate-900 absolute -bottom-8 left-4 object-cover" />
                  )}
                  {!athlete.avatar_url && (
                    <div className="w-16 h-16 rounded-full border-4 border-slate-900 absolute -bottom-8 left-4 bg-slate-800 flex items-center justify-center">
                      <span className="text-slate-400 text-xl">{athlete.full_name?.charAt(0) || '?'}</span>
                    </div>
                  )}
                </div>
                <CardContent className="pt-10 pb-4">
                  <h3 className="font-bold text-lg text-slate-100 truncate">{athlete.full_name}</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    {athlete.position || 'Sem posição'} • {athlete.strong_foot || 'Pé indf.'}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-slate-950 p-2 rounded-lg text-center">
                      <p className="text-xs text-slate-500">Partidas</p>
                      <p className="font-bold text-slate-200">{athlete.stats?.totalMatches || 0}</p>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg text-center">
                      <p className="text-xs text-slate-500">% de Passe</p>
                      <p className="font-bold text-emerald-400">{athlete.stats?.avgPassAccuracy || 0}%</p>
                    </div>
                  </div>

                  <Link href={`/p/${athlete.slug}`}>
                    <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800 hover:text-white">
                      Ver Perfil Completo
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
