import pg from 'pg';
const { Client } = pg;

const clean = async () => {
  const client = new Client({ connectionString: `postgres://postgres:Antigravity@2026@db.zxoqbssgohkkameraiye.supabase.co:5432/postgres` });
  
  try {
    await client.connect();
    const res = await client.query("DELETE FROM join_requests WHERE request_data->>'requestType' = 'VIEW_AND_JOIN';");
    console.log(`Deleted ${res.rowCount} legacy requests.`);
  } catch(err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

clean();
