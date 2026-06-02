import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import pg from 'pg';
const { Client } = pg;

const checkGallery = async () => {
  const client = new Client({ connectionString: `postgres://postgres:Antigravity@2026@db.zxoqbssgohkkameraiye.supabase.co:5432/postgres` });
  try {
    await client.connect();
    const res = await client.query(`SELECT first_name, gallery FROM members WHERE first_name = 'Jaya'`);
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
};
checkGallery();
