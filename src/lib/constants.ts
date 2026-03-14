export type ProductPricingType = 'fixed' | 'm2' | 'roll'

export type ProductPricing = {
  type: ProductPricingType
  price: number
  priceM2?: number
}

export const INITIAL_COSTS: Record<string, Record<string, ProductPricing>> = {
  VINIL_GOLD: {
    Liso: { type: 'm2', price: 125 },
    'Pintado 01': { type: 'm2', price: 219 },
    'Pintado 02': { type: 'm2', price: 259 },
    'Pintado 03': { type: 'm2', price: 299 },
    'Vulcanizado 01': { type: 'm2', price: 350 },
    'Vulcanizado 02': { type: 'm2', price: 449 },
  },
  CLEANKAP: {
    Personalizado: { type: 'm2', price: 341 },
    'Borda Flex 3cm': { type: 'm2', price: 389 },
  },
  WATERKAP: {
    'Acabado 60cm x 90cm': { type: 'fixed', price: 69.9 },
    'Acabado 90cm x 1,5m': { type: 'fixed', price: 226.9 },
    'Rolo 1,20m x 18m': { type: 'roll', price: 3324.24, priceM2: 153.9 },
    'Sob Medida M2': { type: 'm2', price: 153.9 },
  },
  FIREKAP: {
    '1m x 1m': { type: 'fixed', price: 99.99 },
  },
  FIBRA_COCO: {
    'Liso M2': { type: 'm2', price: 179.0 },
    'Personalizado M2': { type: 'm2', price: 229.0 },
  },
  SUPERIOR: {
    'Peça 30cm x 30cm': { type: 'fixed', price: 40.2 },
    Ponteira: { type: 'fixed', price: 3.0 },
    Rampa: { type: 'fixed', price: 3.9 },
  },
  ITALY_ELEGANCE: {
    'Personalizado M2': { type: 'm2', price: 399.0 },
  },
  CONECTADO: {
    'Personalizada M2': { type: 'm2', price: 923.0 },
  },
  PROTEPISO: {
    '85cm x 1,20m': { type: 'fixed', price: 89.6 },
  },
  RUBBERKAP: {
    'Rolo 1m x 10m': { type: 'roll', price: 944.9, priceM2: 94.49 },
    'Personalizado UV M2': { type: 'm2', price: 216.99 },
    'Elevador M2': { type: 'm2', price: 174.99 },
  },
}
