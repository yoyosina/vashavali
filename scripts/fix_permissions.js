import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import pg from 'pg';
const { Client } = pg;

const fixPermissions = async () => {
  const client = new Client({ connectionString: `postgres://postgres:Antigravity@2026@db.zxoqbssgohkkameraiye.supabase.co:5432/postgres` });
  try {
    await client.connect();
    await client.query(`
      GRANT ALL ON TABLE members TO anon, authenticated, service_role;
      GRANT ALL ON TABLE relationships TO anon, authenticated, service_role;
      GRANT ALL ON TABLE join_requests TO anon, authenticated, service_role;
      
      GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
    `);
    console.log('Permissions fixed!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
};
fixPermissions();
