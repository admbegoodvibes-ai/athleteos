import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function run() {
  const slug = 'thomas-zavarizz-suprano-mp17';
  console.log('Fetching slug:', slug);
  const { data, error } = await supabase.from('athletes').select('*').eq('slug', slug).single();
  console.log('Athlete:', data ? 'FOUND' : 'NULL', 'Error:', error);
  
  if (data) {
     const res2 = await supabase
    .from('athlete_position_profiles')
    .select(`
      position_profiles(name),
      position_roles!athlete_position_profiles_primary_role_id_fkey(name)
    `)
    .eq('athlete_id', data.id)
    .maybeSingle();
    console.log('Pos profile error:', res2.error);
    console.log('Pos profile data:', JSON.stringify(res2.data));
  }
}
run();
