import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import pg from 'pg';
const { Client } = pg;

const debugDb = async () => {
  const client = new Client({ connectionString: `postgres://postgres:Antigravity@2026@db.zxoqbssgohkkameraiye.supabase.co:5432/postgres` });
  try {
    await client.connect();
    
    console.log("--- MEMBERS ---");
    const members = await client.query('SELECT id, first_name, last_name FROM members');
    console.table(members.rows);
    
    console.log("--- RELATIONSHIPS ---");
    const rels = await client.query('SELECT r.id, r.type, m1.first_name as source, m2.first_name as target FROM relationships r JOIN members m1 ON r.source_id = m1.id JOIN members m2 ON r.target_id = m2.id');
    console.table(rels.rows);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
};
debugDb();
