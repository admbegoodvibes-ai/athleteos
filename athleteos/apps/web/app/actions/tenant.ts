'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function getMyOrganizations() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) return [];

  const supabaseAdmin = createAdminClient();
  const { data: orgs } = await supabaseAdmin
    .from('organization_members')
    .select(`
      role,
      organizations (*)
    `)
    .eq('user_id', user.id);

  return orgs || [];
}

export async function createOrganization(name: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) return { error: 'Not authenticated' };

  const supabaseAdmin = createAdminClient();
  
  // 1. Create Organization
  const { data: org, error: orgError } = await supabaseAdmin
    .from('organizations')
    .insert({ name })
    .select()
    .single();
    
  if (orgError) return { error: orgError.message };

  // 2. Add creator as club_admin
  const { error: memberError } = await supabaseAdmin
    .from('organization_members')
    .insert({
      organization_id: org.id,
      user_id: user.id,
      role: 'club_admin'
    });

  if (memberError) return { error: memberError.message };

  revalidatePath('/organization');
  return { success: true, org };
}

export async function getOrganizationTeams(orgId: string) {
  const supabaseAdmin = createAdminClient();
  const { data: categories } = await supabaseAdmin
    .from('categories')
    .select(`
      *,
      teams (*)
    `)
    .eq('organization_id', orgId);

  return categories || [];
}

export async function createCategory(orgId: string, name: string) {
  const supabaseAdmin = createAdminClient();
  const { error } = await supabaseAdmin.from('categories').insert({
    organization_id: orgId,
    name
  });
  
  if (error) return { error: error.message };
  revalidatePath('/organization');
  return { success: true };
}

export async function createTeam(categoryId: string, name: string) {
  const supabaseAdmin = createAdminClient();
  const { error } = await supabaseAdmin.from('teams').insert({
    category_id: categoryId,
    name
  });
  
  if (error) return { error: error.message };
  revalidatePath('/organization');
  return { success: true };
}
