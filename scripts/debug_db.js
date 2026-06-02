import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseAdmin = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY);

async function debugDB() {
  const { data: families } = await supabaseAdmin.from('families').select('*').eq('code', 'demo');
  console.log("Families with code 'demo':", families?.length);
  for (const fam of families || []) {
    const { data: members } = await supabaseAdmin.from('members').select('id').eq('family_id', fam.id);
    console.log(`Family ID ${fam.id} has ${members?.length || 0} members.`);
  }
}

debugDB();
