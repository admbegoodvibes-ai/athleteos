const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const parts = line.split('=');
  if(parts.length >= 2) acc[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^"|"$/g, '');
  return acc;
}, {});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  let links = await supabase.from('guardian_athletes').select('*');
  console.log('Guardian links:', links.data);
  if (links.data.length === 0) {
    let users = await supabase.from('users').select('id');
    if (users.data.length > 0) {
      console.log('Linking to user:', users.data[0].id);
      await supabase.from('guardian_athletes').insert({ athlete_id: '0f11c0ae-9888-4c5e-b572-dc0eec3c4af8', guardian_user_id: users.data[0].id });
      console.log('Linked!');
    }
  }
}
run();
