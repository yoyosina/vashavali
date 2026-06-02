import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import pg from 'pg';
const { Client } = pg;

const updateAuth = async () => {
  const client = new Client({ connectionString: `postgres://postgres:Antigravity@2026@db.zxoqbssgohkkameraiye.supabase.co:5432/postgres` });
  try {
    await client.connect();
    
    await client.query(`ALTER TABLE members ADD COLUMN IF NOT EXISTS is_root BOOLEAN DEFAULT FALSE;`);
    
    // The user's auth_id
    const authId = '7a0ac60e-bcdf-44d8-93ff-e782c105bbaa';
    
    await client.query(`
      UPDATE members 
      SET auth_id = $1, is_root = TRUE 
      WHERE first_name = 'Narendra Kumar' AND last_name = 'Sinha';
    `, [authId]);
    
    console.log("Updated Narendra as root member with auth_id mapping!");
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
};
updateAuth();
