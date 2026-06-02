import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import pg from 'pg';
const { Client } = pg;

const fixDb = async () => {
  const client = new Client({ connectionString: `postgres://postgres:Antigravity@2026@db.zxoqbssgohkkameraiye.supabase.co:5432/postgres` });
  try {
    await client.connect();
    await client.query(`
      DROP POLICY IF EXISTS "Allow auth update members" ON members;
      CREATE POLICY "Allow auth update members" ON members FOR UPDATE USING (auth.uid() IS NOT NULL);
      
      DROP POLICY IF EXISTS "Allow auth delete members" ON members;
      CREATE POLICY "Allow auth delete members" ON members FOR DELETE USING (auth.uid() IS NOT NULL);
      
      DROP POLICY IF EXISTS "Allow auth update relationships" ON relationships;
      CREATE POLICY "Allow auth update relationships" ON relationships FOR UPDATE USING (auth.uid() IS NOT NULL);
      
      DROP POLICY IF EXISTS "Allow auth delete relationships" ON relationships;
      CREATE POLICY "Allow auth delete relationships" ON relationships FOR DELETE USING (auth.uid() IS NOT NULL);
    `);
    console.log('RLS policies fixed for members and relationships (UPDATE and DELETE allowed for authenticated users)!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
};
fixDb();
