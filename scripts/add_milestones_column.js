import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import pg from 'pg';
const { Client } = pg;

const alterTable = async () => {
  const client = new Client({ connectionString: `postgres://postgres:Antigravity@2026@db.zxoqbssgohkkameraiye.supabase.co:5432/postgres` });
  try {
    await client.connect();
    await client.query(`ALTER TABLE members ADD COLUMN milestones JSONB DEFAULT '[]'::jsonb;`);
    console.log("Column milestones added successfully!");
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
};
alterTable();
