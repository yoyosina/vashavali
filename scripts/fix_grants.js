import pg from 'pg';
const { Client } = pg;

const fixGrants = async () => {
  const client = new Client({ connectionString: `postgres://postgres:Antigravity@2026@db.zxoqbssgohkkameraiye.supabase.co:5432/postgres` });
  
  try {
    await client.connect();
    
    // Grant privileges
    const tables = ['families', 'family_access', 'global_profiles'];
    for (let table of tables) {
      await client.query(`GRANT ALL ON TABLE public.${table} TO anon, authenticated;`);
      console.log(`Granted access on ${table}`);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
};

fixGrants();
