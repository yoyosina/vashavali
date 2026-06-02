import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Create client using ANON key (no service role, no user logged in)
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testGuestAccess() {
  console.log("Testing Guest Access to 'demo' family...");
  
  // 1. Fetch family
  const { data: family, error: famError } = await supabase.from('families').select('*').eq('code', 'demo').maybeSingle();
  if (famError) console.error("Family Error:", famError);
  console.log("Family fetched:", family ? family.name : "NULL");

  if (!family) return;

  // 2. Fetch members
  const { data: members, error: memError } = await supabase.from('members').select('id, first_name').eq('family_id', family.id);
  if (memError) console.error("Members Error:", memError);
  console.log(`Members fetched: ${members ? members.length : 0}`);

  // 3. Fetch relationships
  const { data: rels, error: relError } = await supabase.from('relationships').select('id').eq('family_id', family.id);
  if (relError) console.error("Relationships Error:", relError);
  console.log(`Relationships fetched: ${rels ? rels.length : 0}`);
}

testGuestAccess();
