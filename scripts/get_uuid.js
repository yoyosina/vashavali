import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Service role client to bypass RLS and get the exact UUID
const supabaseAdmin = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY);

async function getDemoId() {
  const { data, error } = await supabaseAdmin.from('families').select('id').eq('code', 'demo').single();
  console.log("DEMO FAMILY ID IS:", data?.id);
  console.log("Error?", error);
}

getDemoId();
