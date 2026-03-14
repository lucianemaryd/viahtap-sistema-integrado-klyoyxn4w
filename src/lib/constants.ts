export const COSTS = {
  VINIL_GOLD: {
    Liso: 125,
    'Pintado 01': 219,
    'Pintado 02': 259,
    'Pintado 03': 299,
    'Vulcanizado 01': 350,
    'Vulcanizado 02': 449,
    'Vulcanizado 03': 489,
  },
  VINIL_ALTO_TRAFEGO: {
    Liso: 174,
    'Pintado 01': 293,
    'Pintado 02': 348,
    'Pintado 03': 398,
    'Vulcanizado 01': 540,
    'Vulcanizado 02': 599,
    'Vulcanizado 03': 0, // N/A
  },
  CLEANKAP: {
    Personalizado: 341,
    'Borda Flex 3cm': 389,
  },
  BORDA_FLEX: {
    Vulcanizada: 20,
    Aplicada: 45,
    Rebaixada: 10,
  },
} as const

export type MaterialType = 'VINIL_GOLD' | 'VINIL_ALTO_TRAFEGO' | 'CLEANKAP'
export type CustomizationType = keyof typeof COSTS.VINIL_GOLD | keyof typeof COSTS.CLEANKAP
export type BorderType = 'Nenhuma' | keyof typeof COSTS.BORDA_FLEX
