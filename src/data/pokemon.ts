export interface Pokemon {
  id: number;
  name: string;
}

// Verified 5-letter Pokemon from all generations
export const POKEMON_LIST: Pokemon[] = [
  // Generation 1 (Kanto)
  { id: 23, name: 'EKANS' },
  { id: 24, name: 'ARBOK' },
  { id: 41, name: 'ZUBAT' },
  { id: 44, name: 'GLOOM' },
  { id: 46, name: 'PARAS' },
  { id: 76, name: 'GOLEM' },
  { id: 84, name: 'DODUO' },
  { id: 97, name: 'HYPNO' },
  { id: 132, name: 'DITTO' },
  { id: 133, name: 'EEVEE' },

  // Generation 2 (Johto)
  { id: 201, name: 'UNOWN' },
  { id: 240, name: 'MAGBY' },
  { id: 244, name: 'ENTEI' },
  { id: 249, name: 'LUGIA' },

  // Generation 3 (Hoenn)
  { id: 270, name: 'LOTAD' },
  { id: 280, name: 'RALTS' },
  { id: 312, name: 'MINUN' },
  { id: 322, name: 'NUMEL' },
  { id: 359, name: 'ABSOL' },
  { id: 371, name: 'BAGON' },

  // Generation 4 (Sinnoh)
  { id: 406, name: 'BUDEW' },
  { id: 443, name: 'GIBLE' },
  { id: 447, name: 'RIOLU' },
  { id: 479, name: 'ROTOM' },
  { id: 482, name: 'AZELF' },

  // Generation 5 (Unova)
  { id: 495, name: 'SNIVY' },
  { id: 498, name: 'TEPIG' },
  { id: 570, name: 'ZORUA' },
  { id: 633, name: 'DEINO' },

  // Generation 6 (Kalos)
  { id: 704, name: 'GOOMY' },

  // Generation 8 (Galar)
  { id: 848, name: 'TOXEL' },
  { id: 891, name: 'KUBFU' },

  // Generation 9 (Paldea)
  { id: 921, name: 'PAWMI' },
];

// Get sprite URL from PokeAPI
export const getArtwork = (id: number): string =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export const getSprite = (id: number): string =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
