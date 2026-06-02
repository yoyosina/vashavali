import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import pg from 'pg';
const { Client } = pg;

const checkSchema = async () => {
  const client = new Client({ connectionString: `postgres://postgres:Antigravity@2026@db.zxoqbssgohkkameraiye.supabase.co:5432/postgres` });
  try {
    await client.connect();
    
    // Check tables
    const tables = await client.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`);
    console.log('Tables:', tables.rows.map(r => r.table_name));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
};
checkSchema();
