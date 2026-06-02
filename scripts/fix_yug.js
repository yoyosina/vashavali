import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import pg from 'pg';
const { Client } = pg;

const fixDb = async () => {
  const client = new Client({ connectionString: `postgres://postgres:Antigravity@2026@db.zxoqbssgohkkameraiye.supabase.co:5432/postgres` });
  try {
    await client.connect();
    
    await client.query(`
      UPDATE relationships 
      SET type = 'child' 
      WHERE id IN ('c8efea2b-b666-4569-a35a-ef8da8b9f652', 'bcf226c3-8932-47f4-8512-4c69e22e3312');
    `);
    
    console.log("Fixed: Changed Yug and Nitya to be children of Jaya instead of spouses!");
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
};
fixDb();
