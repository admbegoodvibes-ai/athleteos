'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { createOrganization, createCategory, createTeam } from '@/app/actions/tenant';
import { Loader2, Building, Plus, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface OrgManagerProps {
  initialOrg: any;
  initialCategories: any[];
}

export function OrgManager({ initialOrg, initialCategories }: OrgManagerProps) {
  const [org, setOrg] = useState(initialOrg);
  const [categories, setCategories] = useState(initialCategories);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forms State
  const [orgName, setOrgName] = useState('');
  const [catName, setCatName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [selectedCatId, setSelectedCatId] = useState('');

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await createOrganization(orgName);
    if (res.error) toast.error(res.error);
    else {
      toast.success('Clube criado com sucesso!');
      setOrg(res.org);
    }
    setIsSubmitting(false);
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org) return;
    setIsSubmitting(true);
    const res = await createCategory(org.id, catName);
    if (res.error) toast.error(res.error);
    else {
      toast.success('Categoria criada!');
      setCatName('');
      window.location.reload(); // Simple refresh for MVP
    }
    setIsSubmitting(false);
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCatId) return toast.error('Selecione uma categoria');
    setIsSubmitting(true);
    const res = await createTeam(selectedCatId, teamName);
    if (res.error) toast.error(res.error);
    else {
      toast.success('Equipe criada!');
      setTeamName('');
      window.location.reload();
    }
    setIsSubmitting(false);
  };

  if (!org) {
    return (
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-8 text-center">
          <Building className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-200 mb-2">Você ainda não possui um Clube</h2>
          <p className="text-slate-400 mb-6">Para gerenciar equipes e categorias, primeiro crie o seu Clube/Academia.</p>
          <form onSubmit={handleCreateOrg} className="max-w-md mx-auto space-y-4">
            <div className="space-y-2 text-left">
              <Label>Nome do Clube</Label>
              <Input 
                required value={orgName} onChange={e => setOrgName(e.target.value)} 
                placeholder="Ex: Palmeiras Base"
                className="bg-slate-950 border-slate-800"
              />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white">
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              Criar Clube
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Create Forms */}
      <div className="space-y-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <h3 className="font-bold text-slate-200 mb-4">1. Nova Categoria</h3>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <Input required value={catName} onChange={e => setCatName(e.target.value)} placeholder="Ex: Sub-17" className="bg-slate-950 border-slate-800" />
              <Button type="submit" disabled={isSubmitting} className="w-full" variant="secondary">
                Adicionar Categoria
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <h3 className="font-bold text-slate-200 mb-4">2. Nova Equipe</h3>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <select required value={selectedCatId} onChange={e => setSelectedCatId(e.target.value)} className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100">
                <option value="">Selecione a Categoria...</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <Input required value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="Ex: Sub-17 A" className="bg-slate-950 border-slate-800" />
              <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white">
                Adicionar Equipe
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Hierarchy View */}
      <div className="md:col-span-2 space-y-4">
        <h3 className="text-lg font-bold text-slate-200">Estrutura do Clube</h3>
        {categories.length === 0 ? (
          <p className="text-slate-500">Nenhuma categoria cadastrada.</p>
        ) : (
          categories.map(cat => (
            <div key={cat.id} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
              <h4 className="font-bold text-emerald-400 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" /> {cat.name}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cat.teams?.length === 0 ? (
                  <p className="text-sm text-slate-500 ml-6">Sem equipes.</p>
                ) : (
                  cat.teams?.map((team: any) => (
                    <div key={team.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
                      <span className="font-medium text-slate-300">{team.name}</span>
                      <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded">0 Atletas</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
