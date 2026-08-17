import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1]] = match[2];
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: matches } = await supabase.from('matches').select('id, match_date, opponent').order('created_at', { ascending: true });
  if (matches && matches.length > 1) {
    const idsToDelete = matches.slice(1).map(m => m.id);
    await supabase.from('matches').delete().in('id', idsToDelete);
    console.log(`Deleted ${idsToDelete.length} duplicate matches.`);
  }
}
run();
