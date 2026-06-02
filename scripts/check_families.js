import pg from 'pg';
const { Client } = pg;

const checkDB = async () => {
  const client = new Client({ connectionString: `postgres://postgres:Antigravity@2026@db.zxoqbssgohkkamrhlrxs.supabase.co:5432/postgres` });
  
  await client.connect();
  
  try {
    const res = await client.query('SELECT * FROM families');
    console.log("Families in DB:");
    console.log(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
};

checkDB();
