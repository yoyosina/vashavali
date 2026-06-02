import pg from 'pg';
const { Client } = pg;

const checkAccess = async () => {
  const client = new Client({ connectionString: `postgres://postgres:Antigravity@2026@db.zxoqbssgohkkameraiye.supabase.co:5432/postgres` });
  
  try {
    await client.connect();
    
    // Check family
    const familyRes = await client.query(`SELECT id, code FROM families WHERE code = 'alf123bqc'`);
    const familyId = familyRes.rows[0]?.id;
    console.log("Family ID:", familyId);
    
    // Check family_access
    const accessRes = await client.query(`SELECT * FROM family_access`);
    console.log("Family Access Records:", accessRes.rows);
    
    // Check members auth_ids
    const membersRes = await client.query(`SELECT id, first_name, auth_id, is_super_user FROM members`);
    console.log("Members Records:", membersRes.rows);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
};

checkAccess();
