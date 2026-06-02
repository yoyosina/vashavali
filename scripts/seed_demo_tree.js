import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

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

  // 1. Ensure Family exists
  let familyId;
  const { data: existingFamily } = await supabase.from('families').select('id').eq('code', 'demo').maybeSingle();
  if (existingFamily) {
    familyId = existingFamily.id;
    // Clear existing data for fresh seed
    await supabase.from('relationships').delete().eq('family_id', familyId);
    await supabase.from('members').delete().eq('family_id', familyId);
  } else {
    const { data: newFam } = await supabase.from('families').insert([{ name: 'The Vanshavali Demo Family', code: 'demo' }]).select().single();
    familyId = newFam.id;
  }

  const members = [];
  const relationships = [];

  let idCounter = 1;

  function createMember(gender, birthYear) {
    const { first, last } = randomName(gender);
    const memberId = `demo_m_${idCounter++}`;
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
  
  // Insert in batches
  for (let i = 0; i < members.length; i += 20) {
    await supabase.from('members').insert(members.slice(i, i + 20));
  }
  for (let i = 0; i < relationships.length; i += 20) {
    await supabase.from('relationships').insert(relationships.slice(i, i + 20));
  }

  console.log("Demo tree seeded successfully!");
}

seedTree();
