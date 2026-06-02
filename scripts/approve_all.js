import pg from 'pg';
const { Client } = pg;

const approve = async () => {
  const client = new Client({ connectionString: `postgres://postgres:Antigravity@2026@db.zxoqbssgohkkameraiye.supabase.co:5432/postgres` });
  
  try {
    await client.connect();
    
    // Update all pending access to APPROVED
    await client.query(`UPDATE family_access SET status = 'APPROVED' WHERE status = 'PENDING'`);
    console.log("All pending requests approved.");
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
};

approve();
