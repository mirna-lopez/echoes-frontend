// Game rooms configuration
// TODO: Add more rooms later
// TODO: Implement collectible system (keys, letters) — each room should define its own items.

export const ROOMS = {
  entrance: {
    id:  'entrance',
    name: 'Grand Entrance Hall',
    description:  'Thunder rumbles outside as rain lashes against cracked stained glass windows. A grand staircase spirals into darkness above.',
    connections: ['library', 'dining', 'garden'],
    music: '/music/thunder-dreams.mp3',
    background: 'https://i.imgur.com/U0t9EZn.png',
    cardImage: 'https://i.imgur.com/U0t9EZn.png'
     // NOTE: Might link entrance to attic once secret mechanics are added
  },
  
  library: {
    id: 'library',
    name: 'Forbidden Library',
    description:  'Ancient tomes line towering shelves, their leather bindings cracked with age. The air smells of decay and old secrets.',
    connections: ['entrance', 'study'],
    music: '/music/the-chamber.mp3',
    background: 'https://i.imgur.com/JWWK66y.png',
    cardImage:  'https://i.imgur.com/gtYhFrc.png'
  },
  
  dining: {
    id: 'dining',
    name: 'Cursed Dining Room',
    description: 'A long table set for twelve ghostly guests. Cobwebs drape the corners like funeral shrouds.',
    connections: ['entrance', 'kitchen'],
    music: '/music/ghostpocalypse.mp3',
    background: 'https://i.imgur.com/HcVTV7i.png',
    cardImage: 'https://i.imgur.com/zVIMjaK.png'
  },
  
  garden: {
    id: 'garden',
    name: 'Dead Garden',
    description: 'Withered roses choke the overgrown paths. The moon casts twisted shadows through gnarled trees.',
    connections: ['entrance'],
    music: '/music/dreamy-flashback.mp3',
    background: 'https://i.imgur.com/R77iGFG.png',
    cardImage: 'https://i.imgur.com/R77iGFG.png'
  },
  
  study: {
    id: 'study',
    name: "Eleanor's Study",
    description: 'Personal journals lie scattered across an aged desk. Ink-stained letters reveal fragments of a melancholic past.',
    connections: ['library'],
    music:  '/music/atlantean-twilight.mp3',
    background: 'https://i.imgur.com/ljUWOqY.png',
    cardImage: 'https://i.imgur.com/837mjXI.png'
  },
  
  kitchen: {
    id: 'kitchen',
    name: 'Abandoned Kitchen',
    description: 'Rusted pots hang above a cold stove. Something dark stains the floor near the pantry.',
    connections: ['dining'],
    music: '/music/decay.mp3',
    background: 'https://i.imgur.com/ow5F0My.png',
    cardImage: 'https://i.imgur.com/QnLAcWw.png'
  }
};

/**
 * API Configuration
 */
export const API_CONFIG = {
  DEMO_SERVER:  'https://echoes-estate-backend.onrender.com'
};
