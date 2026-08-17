const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const parts = line.split('=');
  if(parts.length >= 2) acc[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^"|"$/g, '');
  return acc;
}, {});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  console.log('Creating avatars bucket...');
  let { data, error } = await supabase.storage.createBucket('avatars', { public: true });
  console.log('Create Bucket:', { data, error });
  
  let res = await supabase.storage.getBucket('avatars');
  console.log('Get Bucket:', res.data);
  
  let res2 = await supabase.from('athletes').select('id, full_name, avatar_url');
  console.log('Athletes:', res2.data);
}

run();
