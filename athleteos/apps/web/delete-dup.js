const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const parts = line.split('=');
  if(parts.length >= 2) acc[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^"|"$/g, '');
  return acc;
}, {});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  await supabase.from('athletes').delete().eq('id', 'ccb0bfa3-c683-40b8-b2b7-347221503cea');
  let res2 = await supabase.from('athletes').select('id, full_name, avatar_url');
  console.log('Athletes remaining:', res2.data);
}

run();
