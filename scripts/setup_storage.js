import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import pg from 'pg';
const { Client } = pg;

const setupStorage = async () => {
  const client = new Client({ connectionString: `postgres://postgres:Antigravity@2026@db.zxoqbssgohkkameraiye.supabase.co:5432/postgres` });
  try {
    await client.connect();
    await client.query(`
      INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
      DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
      DROP POLICY IF EXISTS "Anyone can upload an avatar" ON storage.objects;
      CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
      CREATE POLICY "Anyone can upload an avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');
    `);
    console.log('Storage setup complete!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
};
setupStorage();
