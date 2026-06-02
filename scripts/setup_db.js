import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import pg from 'pg';
const { Client } = pg;

const PASSWORD = 'Antigravity@2026';
const PROJECT_REF = 'zxoqbssgohkkameraiye';
const CONNECTION_STRING = `postgres://postgres.${PROJECT_REF}:${PASSWORD}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`; 
const FALLBACK_CONNECTION_STRING = `postgres://postgres:${PASSWORD}@db.${PROJECT_REF}.supabase.co:5432/postgres`;

const setupDatabase = async () => {
  let client = new Client({ connectionString: FALLBACK_CONNECTION_STRING });
  try {
    console.log('Connecting to database...');
    await client.connect();
    
    console.log('Creating tables...');
    const query = `
      -- Create members table
      CREATE TABLE IF NOT EXISTS members (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          auth_id UUID,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          birth_date DATE,
          death_date DATE,
          bio TEXT,
          image_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create relationships table
      CREATE TABLE IF NOT EXISTS relationships (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          source_id UUID REFERENCES members(id) ON DELETE CASCADE,
          target_id UUID REFERENCES members(id) ON DELETE CASCADE,
          type TEXT NOT NULL CHECK (type IN ('parent', 'child', 'spouse')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create join_requests table
      CREATE TABLE IF NOT EXISTS join_requests (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          submitted_by UUID,
          request_data JSONB NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Enable Row Level Security (RLS)
      ALTER TABLE members ENABLE ROW LEVEL SECURITY;
      ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;
      ALTER TABLE join_requests ENABLE ROW LEVEL SECURITY;

      -- Drop existing policies if they exist (to allow rerunning script safely)
      DROP POLICY IF EXISTS "Allow public read access on members" ON members;
      DROP POLICY IF EXISTS "Allow public read access on relationships" ON relationships;
      DROP POLICY IF EXISTS "Allow authenticated users to insert members" ON members;
      DROP POLICY IF EXISTS "Allow authenticated users to insert relationships" ON relationships;
      DROP POLICY IF EXISTS "Allow authenticated users to insert join_requests" ON join_requests;
      DROP POLICY IF EXISTS "Allow users to view their own requests" ON join_requests;

      -- Simple policies for now: Anyone can read members and relationships
      CREATE POLICY "Allow public read access on members" ON members FOR SELECT USING (true);
      CREATE POLICY "Allow public read access on relationships" ON relationships FOR SELECT USING (true);
      
      -- Only authenticated users can insert/update for now
      CREATE POLICY "Allow authenticated users to insert members" ON members FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
      CREATE POLICY "Allow authenticated users to insert relationships" ON relationships FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
      CREATE POLICY "Allow authenticated users to insert join_requests" ON join_requests FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
      CREATE POLICY "Allow users to view their own requests" ON join_requests FOR SELECT USING (auth.uid() = submitted_by OR auth.uid() IN (SELECT auth_id FROM members WHERE auth_id IS NOT NULL));

    `;
    
    await client.query(query);
    console.log('Database setup complete!');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await client.end();
  }
};

setupDatabase();
