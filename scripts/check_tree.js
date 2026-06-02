import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load the local environment variables we just checked
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTree() {
  console.log("Checking database for family code: alf123bcq...");
  
  const { data: family, error: familyError } = await supabase
    .from('families')
    .select('*')
    .eq('code', 'alf123bcq')
    .maybeSingle();

  if (familyError) {
    console.error("Database error:", familyError.message);
    return;
  }

  if (!family) {
    console.log("RESULT: No tree found with code 'alf123bcq'.");
    return;
  }

  console.log(`RESULT: Found tree! Name: "${family.name}"`);
  
  // Count how many members are in it
  const { count, error: memberError } = await supabase
    .from('members')
    .select('*', { count: 'exact', head: true })
    .eq('family_id', family.id);
    
  if (memberError) {
    console.error("Error fetching members:", memberError.message);
  } else {
    console.log(`Total members in this tree: ${count}`);
  }
}

checkTree();
