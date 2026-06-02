export const initialNodes = [
  {
    id: '1',
    type: 'memberNode',
    data: {
      id: '1',
      firstName: 'Arthur',
      lastName: 'Pendragon',
      birthYear: '1945',
      deathYear: '2015',
      imageUrl: 'https://i.pravatar.cc/150?u=arthur',
      bio: 'The patriarch of the family. A man of great honor and wisdom, Arthur built the family business from the ground up.',
      milestones: [
        { year: '1965', event: 'Graduated from Oxford University' },
        { year: '1970', event: 'Founded Pendragon Enterprises' }
      ],
      gallery: [
        'https://images.unsplash.com/photo-1544985229-f8004f2d7a96?auto=format&fit=crop&q=80&w=400',
        'https://images.unsplash.com/photo-1506880018603-83d5b62f40fc?auto=format&fit=crop&q=80&w=400'
      ]
    },
    position: { x: 250, y: 0 },
  },
  {
    id: '2',
    type: 'memberNode',
    data: {
      id: '2',
      firstName: 'Guinevere',
      lastName: 'Pendragon',
      birthYear: '1950',
      deathYear: null,
      imageUrl: 'https://i.pravatar.cc/150?u=guinevere',
      bio: 'A passionate artist and the heart of the family. Guinevere\'s paintings have been exhibited globally.',
      milestones: [
        { year: '1972', event: 'First Solo Exhibition in Paris' },
        { year: '1975', event: 'Married Arthur Pendragon' }
      ],
      gallery: [
        'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=400'
      ]
    },
    position: { x: 550, y: 0 },
  },
  {
    id: '3',
    type: 'memberNode',
    data: {
      id: '3',
      firstName: 'Morgana',
      lastName: 'Le Fay',
      birthYear: '1976',
      deathYear: null,
      imageUrl: 'https://i.pravatar.cc/150?u=morgana',
      bio: 'The eldest daughter. A brilliant software engineer who pioneered new algorithms in machine learning.',
      milestones: [
        { year: '1998', event: 'Graduated MIT' },
        { year: '2010', event: 'Published seminal AI research' }
      ],
      gallery: []
    },
    position: { x: 400, y: 200 },
  }
];

export const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', type: 'step', animated: false, style: { stroke: 'var(--color-border)', strokeWidth: 2 } }, // Spouse link (can be custom rendered)
  { id: 'e1-3', source: '1', target: '3', type: 'smoothstep', animated: true, style: { stroke: 'var(--color-accent-gold)', strokeWidth: 2 } }, // Parent-Child link
  { id: 'e2-3', source: '2', target: '3', type: 'smoothstep', animated: true, style: { stroke: 'var(--color-accent-gold)', strokeWidth: 2 } }, // Parent-Child link
];
