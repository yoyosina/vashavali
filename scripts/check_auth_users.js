import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import pg from 'pg';
const { Client } = pg;

const checkAuthUsers = async () => {
  const client = new Client({ connectionString: `postgres://postgres:Antigravity@2026@db.zxoqbssgohkkameraiye.supabase.co:5432/postgres` });
  try {
    await client.connect();
    const res = await client.query(`SELECT id, email FROM auth.users`);
    console.table(res.rows);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
};
checkAuthUsers();
