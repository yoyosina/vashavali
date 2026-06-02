import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// No need for supabase client anymore
const firstNamesM = ["Aarav", "Vihaan", "Aditya", "Sai", "Arjun", "Reyansh", "Ayaan", "Krishna", "Ishaan", "Shaurya", "Rudra", "Kabir", "Dhruv", "Ansh", "Aryan"];
const firstNamesF = ["Aadya", "Diya", "Pari", "Ananya", "Myra", "Saanvi", "Kiara", "Prisha", "Riya", "Avni", "Aanya", "Kavya", "Navya", "Meera", "Zara"];
const lastNames = ["Sharma", "Verma", "Gupta", "Singh", "Kapoor", "Chopra", "Malhotra", "Joshi", "Patel", "Kumar", "Mishra", "Pandey"];

function randomName(gender) {
  const first = gender === 'M' ? firstNamesM[Math.floor(Math.random() * firstNamesM.length)] : firstNamesF[Math.floor(Math.random() * firstNamesF.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  return { first, last };
}

function randomYear(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
}

async function seedTree() {
  console.log("Seeding Demo Tree...");

  const familyId = '648d745a-2101-4e1b-96be-b32f3cb2f09c';

  const members = [];
  const relationships = [];

  let idCounter = 1;

  function createMember(gender, birthYear) {
    const { first, last } = randomName(gender);
    const memberId = crypto.randomUUID();
    members.push({
      id: memberId,
      family_id: familyId,
      first_name: first,
      last_name: last,
      birth_date: `${birthYear}-01-01`,
      image_url: `https://i.pravatar.cc/150?u=${memberId}`,
      bio: `${first} grew up in North India and has always valued family traditions. A vibrant and loving soul who brings the family together.`,
      milestones: [
        { year: (parseInt(birthYear) + 18).toString(), event: 'Graduated High School' },
        { year: (parseInt(birthYear) + 22).toString(), event: 'Completed University Degree' }
      ]
    });
    return memberId;
  }

  // Generation 1 (Birth ~1920)
  const g1m = createMember('M', 1920);
  const g1f = createMember('F', 1922);
  relationships.push({ family_id: familyId, source_id: g1m, target_id: g1f, type: 'spouse' });

  let parentPairs = [[g1m, g1f]];

  // Generation 2 to 5
  let currentYear = 1945;
  for (let gen = 2; gen <= 5; gen++) {
    const nextParentPairs = [];
    
    for (const [p1, p2] of parentPairs) {
      // Each pair has 2 to 3 children
      const numChildren = members.length > 100 ? 1 : Math.floor(Math.random() * 2) + 2; 
      
      for (let i = 0; i < numChildren; i++) {
        const childGender = Math.random() > 0.5 ? 'M' : 'F';
        const childId = createMember(childGender, randomYear(currentYear, currentYear + 10));
        relationships.push({ family_id: familyId, source_id: p1, target_id: childId, type: 'child' });
        
        // At generation 5, we stop marriages to limit nodes
        if (gen < 5 && members.length < 110) {
          const spouseGender = childGender === 'M' ? 'F' : 'M';
          const spouseId = createMember(spouseGender, randomYear(currentYear, currentYear + 10));
          relationships.push({ family_id: familyId, source_id: childId, target_id: spouseId, type: 'spouse' });
          nextParentPairs.push([childId, spouseId]);
        }
      }
    }
    parentPairs = nextParentPairs;
    currentYear += 25;
    if (members.length >= 120) break;
  }

  console.log(`Generated ${members.length} members and ${relationships.length} relationships.`);
  
  let sql = `-- Clear existing data\nDELETE FROM public.relationships WHERE family_id = '${familyId}';\nDELETE FROM public.members WHERE family_id = '${familyId}';\n\n`;

  sql += `-- Insert Members\nINSERT INTO public.members (id, family_id, first_name, last_name, birth_date, image_url, bio, milestones) VALUES \n`;
  const memberValues = members.map(m => `('${m.id}', '${m.family_id}', '${m.first_name}', '${m.last_name}', '${m.birth_date}', '${m.image_url}', '${m.bio.replace(/'/g, "''")}', '${JSON.stringify(m.milestones)}'::jsonb)`);
  sql += memberValues.join(',\n') + ';\n\n';

  sql += `-- Insert Relationships\nINSERT INTO public.relationships (family_id, source_id, target_id, type) VALUES \n`;
  const relValues = relationships.map(r => `('${r.family_id}', '${r.source_id}', '${r.target_id}', '${r.type}')`);
  sql += relValues.join(',\n') + ';\n';

  fs.writeFileSync(path.join(process.cwd(), 'demo_seed.sql'), sql);
  console.log("SQL file generated at demo_seed.sql");
}

seedTree();
