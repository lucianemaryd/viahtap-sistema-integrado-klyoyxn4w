export type ProductPricingType = 'fixed' | 'm2' | 'roll' | 'ml'

export type ProductPricing = {
  type: ProductPricingType
  price: number
  priceM2?: number
  fatorCorte?: number[]
  ncm?: string
}

export const INITIAL_COSTS: Record<string, Record<string, ProductPricing>> = {
  VINIL_GOLD: {
    Liso: { type: 'm2', price: 125, ncm: '3918.10.00' },
    'Pintado 01': { type: 'm2', price: 219, ncm: '3918.10.00' },
    'Pintado 02': { type: 'm2', price: 259, ncm: '3918.10.00' },
    'Pintado 03': { type: 'm2', price: 299, ncm: '3918.10.00' },
    'Vulcanizado 01': { type: 'm2', price: 350, ncm: '3918.10.00' },
    'Vulcanizado 02': { type: 'm2', price: 449, ncm: '3918.10.00' },
  },
  VINIL_ALTO_TRAFEGO: {
    'Personalizado M2': { type: 'm2', price: 289.0, ncm: '3918.10.00', fatorCorte: [120] },
    'Rolo 1,20m x 15m': { type: 'roll', price: 2199.0, ncm: '3918.10.00' },
  },
  LAMINADO_MOEDA: {
    'Rolo 1,30m X 15m - Cinza': { type: 'ml', price: 80.9, ncm: '3918.10.00' },
    'Rolo 1,30m X 15m - Preto': { type: 'ml', price: 72.9, ncm: '3918.10.00' },
    'Rolo 2m X 10m - Preto': { type: 'ml', price: 111.9, ncm: '3918.10.00' },
  },
  LAMINADO_LISO: {
    'Rolo 1,30m X 15m 2mm - Preto': { type: 'ml', price: 72.9, ncm: '3918.10.00' },
    'Rolo 1m X 10m 3,5mm - Preto': { type: 'ml', price: 99.9, ncm: '3918.10.00' },
    'Rolo 1m X 10m 5mm - Preto': { type: 'ml', price: 146.9, ncm: '3918.10.00' },
  },
  LAMINADO_BUS: {
    'Rolo 1,30m X 15m - Cinza': { type: 'ml', price: 80.9, ncm: '3918.10.00' },
    'Rolo 1,30m X 15m - Preto': { type: 'ml', price: 72.9, ncm: '3918.10.00' },
    'Rolo 2m X 10m - Preto': { type: 'ml', price: 111.9, ncm: '3918.10.00' },
  },
  TERRA: {
    'Rolo 1,30m X 10m': { type: 'fixed', price: 1099.0, ncm: '3918.10.00' },
    'Metro Linear': { type: 'ml', price: 109.9, ncm: '3918.10.00' },
  },
  FITA_DEMARCACAO: {
    '50mm X 30m - Cores': { type: 'fixed', price: 22.9, ncm: '3919.10.20' },
    '50mm X 30m - Zebrada': { type: 'fixed', price: 24.9, ncm: '3919.10.20' },
  },
  FITA_ANTIDERRAPANTE: {
    '50mm X 5m - Preta': { type: 'fixed', price: 18.9, ncm: '6805.30.90' },
    '50mm X 20m - Preta': { type: 'fixed', price: 61.9, ncm: '6805.30.90' },
    '50mm X 20m - Cinza/Transp.': { type: 'fixed', price: 68.9, ncm: '6805.30.90' },
  },
  PISO_TATIL: {
    'Alerta/Direcional 25x25cm': { type: 'fixed', price: 6.62, ncm: '3918.10.00' },
  },
  LIFTKAP: {
    'De 4 a 8 passageiros': { type: 'fixed', price: 1569.0, ncm: '5603.13.30' },
    'De 9 a 12 passageiros': { type: 'fixed', price: 2125.0, ncm: '5603.13.30' },
    'De 13 a 16 passageiros': { type: 'fixed', price: 2679.0, ncm: '5603.13.30' },
    'De 17 a 20 passageiros': { type: 'fixed', price: 3209.0, ncm: '5603.13.30' },
    'De 21 a 24 passageiros': { type: 'fixed', price: 3699.0, ncm: '5603.13.30' },
    'De 25 a 27 passageiros': { type: 'fixed', price: 3999.0, ncm: '5603.13.30' },
    'Kit Pitons - 10pcs': { type: 'fixed', price: 62.5, ncm: '5603.13.30' },
  },
  WIND_BANNER: {
    'Inteiro 70cm X 2,40m': { type: 'fixed', price: 170.0, ncm: '6397.90.90' },
    'Inteiro 70cm X 2,80m': { type: 'fixed', price: 214.9, ncm: '6397.90.90' },
    'Haste 3m': { type: 'fixed', price: 54.0, ncm: '7304.11.00' },
    'Haste 3,5m': { type: 'fixed', price: 56.77, ncm: '7304.11.00' },
    Base: { type: 'fixed', price: 55.77, ncm: '3925.90.90' },
    'Flag 2m': { type: 'fixed', price: 111.6, ncm: '5603.12.30' },
    'Flag 2,5m': { type: 'fixed', price: 120.67, ncm: '5603.12.30' },
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
  ANTIFADIGA: {
    '60cm x 90cm': { type: 'fixed', price: 233.9 },
    '80cm x 1.20m': { type: 'fixed', price: 374.9 },
    'Personalizado M2': { type: 'm2', price: 390.0, fatorCorte: [60, 80, 120] },
  },
  DUO: {
    '1.90m x 6m (M2)': { type: 'm2', price: 165.0, fatorCorte: [60, 80, 100, 120, 160, 200] },
    '1.90m x 6m (C/ Borda Flex)': {
      type: 'm2',
      price: 210.0,
      fatorCorte: [60, 80, 100, 120, 160, 200],
    },
    'Rolo 1.90m x 6m': { type: 'roll', price: 1881.0 },
  },
}
