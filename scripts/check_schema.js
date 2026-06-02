import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import pg from 'pg';
const { Client } = pg;

const checkSchema = async () => {
  const client = new Client({ connectionString: `postgres://postgres:Antigravity@2026@db.zxoqbssgohkkameraiye.supabase.co:5432/postgres` });
  try {
    await client.connect();
    const res = await client.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'members'`);
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
};
checkSchema();
