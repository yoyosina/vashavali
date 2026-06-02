import pg from 'pg';
const { Client } = pg;

const migrate = async () => {
  const client = new Client({ connectionString: `postgres://postgres:Antigravity@2026@db.zxoqbssgohkkameraiye.supabase.co:5432/postgres` });
  
  try {
    await client.connect();
    
    // 1. Create the family
    const insertFamilyQuery = `
      INSERT INTO families (name, code)
      VALUES ('Sinha''s Family', 'alf123bqc')
      ON CONFLICT (code) DO NOTHING
      RETURNING id;
    `;
    let res = await client.query(insertFamilyQuery);
    
    let familyId;
    if (res.rows.length > 0) {
      familyId = res.rows[0].id;
    } else {
      const existing = await client.query(`SELECT id FROM families WHERE code = 'alf123bqc'`);
      familyId = existing.rows[0].id;
    }
    
    console.log("Family ID:", familyId);
    
    // 2. Update existing members to belong to this family
    await client.query(`UPDATE members SET family_id = $1 WHERE family_id IS NULL`, [familyId]);
    console.log("Members updated.");
    
    // 3. Update existing relationships to belong to this family
    await client.query(`UPDATE relationships SET family_id = $1 WHERE family_id IS NULL`, [familyId]);
    console.log("Relationships updated.");
    
    // 4. Update existing join_requests
    await client.query(`UPDATE join_requests SET family_id = $1 WHERE family_id IS NULL`, [familyId]);
    console.log("Join requests updated.");
    
    // 5. Grant family_access to all users who already have an auth_id in members
    const membersRes = await client.query(`SELECT DISTINCT auth_id FROM members WHERE auth_id IS NOT NULL AND family_id = $1`, [familyId]);
    for (let row of membersRes.rows) {
      await client.query(`
        INSERT INTO family_access (family_id, user_id, status)
        VALUES ($1, $2, 'APPROVED')
        ON CONFLICT (family_id, user_id) DO NOTHING
      `, [familyId, row.auth_id]);
    }
    console.log("Family access granted to existing users.");
    
  } catch (error) {
    console.error('Migration Error:', error);
  } finally {
    await client.end();
  }
};

migrate();
