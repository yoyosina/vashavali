import pg from 'pg';
const { Client } = pg;

const checkRLS = async () => {
  const client = new Client({ connectionString: `postgres://postgres:Antigravity@2026@db.zxoqbssgohkkameraiye.supabase.co:5432/postgres` });
  
  try {
    await client.connect();
    
    // Check if RLS is enabled on families
    const rlsRes = await client.query(`
      SELECT relname, relrowsecurity 
      FROM pg_class 
      WHERE relname IN ('families', 'family_access', 'members');
    `);
    console.log("RLS Enabled:", rlsRes.rows);
    
    // Check policies
    const polRes = await client.query(`
      SELECT tablename, policyname, roles, cmd, qual, with_check 
      FROM pg_policies 
      WHERE tablename IN ('families', 'family_access', 'members');
    `);
    console.log("Policies:", polRes.rows);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
};

checkRLS();
