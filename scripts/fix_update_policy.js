import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import pg from 'pg';
const { Client } = pg;

const fixDb = async () => {
  const client = new Client({ connectionString: `postgres://postgres:Antigravity@2026@db.zxoqbssgohkkameraiye.supabase.co:5432/postgres` });
  try {
    await client.connect();
    await client.query(`
      -- Add UPDATE policy for join_requests
      DROP POLICY IF EXISTS "Allow authenticated users to update join_requests" ON join_requests;
      CREATE POLICY "Allow authenticated users to update join_requests" ON join_requests FOR UPDATE USING (auth.uid() IS NOT NULL);
      
      -- Add DELETE policy for join_requests (optional)
      DROP POLICY IF EXISTS "Allow authenticated users to delete join_requests" ON join_requests;
      CREATE POLICY "Allow authenticated users to delete join_requests" ON join_requests FOR DELETE USING (auth.uid() IS NOT NULL);

      -- Delete duplicates: Keep the one with the oldest created_at
      DELETE FROM members WHERE id IN (
        SELECT id FROM (
          SELECT id, ROW_NUMBER() OVER (PARTITION BY first_name, last_name ORDER BY created_at ASC) as rnum
          FROM members
        ) t WHERE t.rnum > 1
      );
      
      -- Update all existing join_requests to 'approved' to clear the pending list
      UPDATE join_requests SET status = 'approved' WHERE status = 'pending';
    `);
    console.log('Database fixes applied: Added UPDATE policy, cleared pending requests, deleted duplicate member nodes.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
};
fixDb();
