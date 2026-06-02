import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import pg from 'pg';
const { Client } = pg;

const addGalleryColumn = async () => {
  const client = new Client({ connectionString: `postgres://postgres:Antigravity@2026@db.zxoqbssgohkkameraiye.supabase.co:5432/postgres` });
  try {
    await client.connect();
    
    await client.query(`
      ALTER TABLE members ADD COLUMN IF NOT EXISTS gallery text[] DEFAULT '{}';
    `);
    console.log("Successfully added 'gallery' column to members table!");
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
};
addGalleryColumn();
