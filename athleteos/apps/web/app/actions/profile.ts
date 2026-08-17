'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function updateUserProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Not authenticated' };
  }

  const fullName = formData.get('fullName') as string;
  const phone = formData.get('phone') as string;

  // Update auth metadata
  const { error: metadataError } = await supabase.auth.updateUser({
    data: { full_name: fullName, phone: phone }
  });

  if (metadataError) {
    return { error: metadataError.message };
  }

  // Update users table
  const { error: dbError } = await supabase
    .from('users')
    .update({ full_name: fullName, phone: phone })
    .eq('id', user.id);

  if (dbError) {
    console.error('Error updating users table:', dbError);
    // Continue since metadata was updated successfully
  }

  revalidatePath('/profile');
  return { success: true };
}

export async function createManagedAthlete(data: any) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Not authenticated' };
  }

  const supabaseAdmin = createAdminClient();

  const { error: athleteError, data: athleteData } = await supabaseAdmin
    .from('athletes')
    .insert({
      full_name: data.fullName,
      date_of_birth: data.dateOfBirth,
      position: data.position,
      dominant_foot: data.dominantFoot,
      height_cm: parseInt(data.height, 10),
      weight_kg: parseFloat(data.weight),
      user_id: null,
      avatar_url: data.avatar_url,
    })
    .select()
    .single();

  if (athleteError) {
    console.error('Athlete Insert Error:', athleteError);
    return { error: athleteError.message };
  }

  const { error: guardianError } = await supabaseAdmin
    .from('guardian_athletes')
    .insert({
      guardian_user_id: user.id,
      athlete_id: athleteData.id,
    });

  if (guardianError) {
    console.error('Guardian Insert Error:', guardianError);
    return { error: guardianError.message };
  }

  revalidatePath('/athletes');
  return { success: true };
}

export async function linkAthleteByCode(code: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Not authenticated' };
  }

  const { data: athlete, error: findError } = await supabase
    .from('athletes')
    .select('id')
    .eq('invite_code', code)
    .single();

  if (findError || !athlete) {
    return { error: 'Athlete not found or invalid code' };
  }

  const { error: linkError } = await supabase
    .from('guardian_athletes')
    .insert({
      guardian_user_id: user.id,
      athlete_id: athlete.id,
    });

  if (linkError) {
    return { error: linkError.message };
  }

  revalidatePath('/athletes');
  return { success: true };
}

export async function getMyAthletes() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return [];
  }

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = userData?.role;

  if (role === 'guardian') {
    const { data: guardiansData } = await supabase
      .from('guardian_athletes')
      .select('athletes(id, full_name)')
      .eq('guardian_user_id', user.id);

    return (guardiansData || []).map((g: any) => g.athletes).filter(Boolean);
  } else if (role === 'athlete') {
    const { data: athleteData } = await supabase
      .from('athletes')
      .select('id, full_name')
      .eq('user_id', user.id);
      
    return athleteData || [];
  }

  return [];
}

export async function saveAthleteProfile(data: any) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Not authenticated' };
  }

  let slug = data.slug;
  if (!slug && data.full_name) {
    const baseSlug = data.full_name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, '');
    const randomStr = Math.random().toString(36).substring(2, 6);
    slug = `${baseSlug}-${randomStr}`;
  }

  const payload: any = {
    full_name: data.full_name,
    date_of_birth: data.date_of_birth,
    position: data.position,
    secondary_position: data.secondary_position,
    dominant_foot: data.dominant_foot,
    height_cm: data.height_cm ? parseInt(data.height_cm, 10) : null,
    weight_kg: data.weight_kg ? parseFloat(data.weight_kg) : null,
    category: data.category,
    club: data.club,
    city: data.city,
    state: data.state,
    bio: data.bio,
    instagram_url: data.instagram_url,
    youtube_url: data.youtube_url,
    is_public: data.is_public !== undefined ? data.is_public : true,
    avatar_url: data.avatar_url,
  };

  if (slug) {
    payload.slug = slug;
  }

  const supabaseAdmin = createAdminClient();
  
  if (data.id) {
    const { error: updateError, data: updatedData } = await supabaseAdmin
      .from('athletes')
      .update(payload)
      .eq('id', data.id)
      .select()
      .single();
      
    if (updateError) {
      console.error('Athlete Update Error:', updateError);
      return { error: updateError.message };
    }
  } else {
    payload.user_id = user.id;
    const { error: insertError, data: insertedData } = await supabaseAdmin
      .from('athletes')
      .insert(payload)
      .select()
      .single();
      
    if (insertError) {
      console.error('Athlete Insert Error:', insertError);
      return { error: insertError.message };
    }
  }

  revalidatePath('/profile');
  revalidatePath('/athletes');
  if (slug) {
    revalidatePath(`/p/${slug}`, 'page');
  }
  return { success: true };
}
