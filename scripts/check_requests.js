import pg from 'pg';
const { Client } = pg;

const check = async () => {
  const client = new Client({ connectionString: `postgres://postgres:Antigravity@2026@db.zxoqbssgohkkameraiye.supabase.co:5432/postgres` });
  
  try {
    await client.connect();
    const res = await client.query("SELECT * FROM join_requests WHERE status = 'pending';");
    console.log(JSON.stringify(res.rows, null, 2));
  } catch(err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

check();
