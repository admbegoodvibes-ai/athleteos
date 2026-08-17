import { getMyOrganizations, getOrganizationTeams } from '@/app/actions/tenant';
import { OrgManager } from '@/components/forms/org-manager';

export const metadata = {
  title: 'Meu Clube | AthleteOS',
  description: 'Gestão de categorias e equipes',
};

export default async function OrganizationPage() {
  const orgs = await getMyOrganizations();
  const myOrg = orgs[0]; // For MVP, we assume user is in one org
  
  let categories = [];
  if (myOrg?.organizations) {
    const orgData = myOrg.organizations as any;
    categories = await getOrganizationTeams(orgData.id);
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          {myOrg ? (myOrg.organizations as any).name : 'Meu Clube'}
        </h1>
        <p className="text-slate-400 mt-2">
          Gestão multi-tenant. Crie categorias (ex: Sub-17) e dentro delas suas equipes (ex: Sub-17 A).
        </p>
      </div>
      
      <OrgManager 
        initialOrg={myOrg?.organizations || null} 
        initialCategories={categories} 
      />
    </div>
  );
}
