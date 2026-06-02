import pg from 'pg';
const { Client } = pg;

const reloadSchema = async () => {
  const client = new Client({ connectionString: `postgres://postgres:Antigravity@2026@db.zxoqbssgohkkameraiye.supabase.co:5432/postgres` });
  
  try {
    await client.connect();
    await client.query(`NOTIFY pgrst, 'reload schema'`);
    console.log("PostgREST schema cache reloaded successfully.");
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
};

reloadSchema();
