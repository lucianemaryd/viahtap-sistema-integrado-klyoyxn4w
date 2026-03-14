import { create } from 'zustand'

export interface Customer {
  id: string
  name: string
  document: string
  email: string
  municipalRegistration: string
  cep: string
  neighborhood: string
  phone: string
  address: string
  status: 'active' | 'inactive'
}

export interface ProductCondition {
  id: string
  name: string
  priceModifier: number
  modifierType: 'per_m2' | 'per_ml' | 'fixed' | 'percentage'
}

export interface ProductVariant {
  id: string
  name: string
  price: number
  unit: 'm2' | 'ml' | 'unit'
}

export interface Product {
  id: string
  name: string
  category: string
  basePrice: number
  unit: 'm2' | 'ml' | 'unit'
  ncm?: string
  ipi?: number
  warranty?: string
  cutFactor?: number
  conditions?: ProductCondition[]
  variants?: ProductVariant[]
}

export interface QuoteItem {
  id: string
  productId: string
  productName: string
  variantId?: string
  variantName?: string
  width: number
  length: number
  quantity: number
  unitPrice: number
  totalPrice: number
  conditions: string[]
}

export interface Quote {
  id: string
  customerId: string
  date: string
  validityDays: number
  items: QuoteItem[]
  subtotal: number
  discount: number
  total: number
  status: 'draft' | 'sent' | 'approved' | 'rejected'
}

interface AppState {
  customers: Customer[]
  products: Product[]
  quotes: Quote[]
  addCustomer: (customer: Omit<Customer, 'id'>) => void
  updateCustomer: (id: string, customer: Partial<Customer>) => void
  deleteCustomer: (id: string) => void
  addProduct: (product: Omit<Product, 'id'>) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  addQuote: (quote: Omit<Quote, 'id'>) => void
  updateQuote: (id: string, quote: Partial<Quote>) => void
  deleteQuote: (id: string) => void
}

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Conectado',
    category: 'Tapetes',
    basePrice: 923.0,
    unit: 'm2',
    ncm: '5705.00.00',
    ipi: 6.5,
    warranty: '2 anos',
    cutFactor: 50,
  },
  {
    id: '2',
    name: 'Protepiso',
    category: 'Tapetes',
    basePrice: 89.6,
    unit: 'unit',
    ncm: '3918.10.00',
    ipi: 0,
    warranty: '1 ano',
    variants: [{ id: 'v1', name: '85cm x 1.20m', price: 89.6, unit: 'unit' }],
  },
  {
    id: '3',
    name: 'Rubberkap',
    category: 'Pisos',
    basePrice: 94.49,
    unit: 'm2',
    ncm: '4002.11.10',
    ipi: 0,
    warranty: '1 ano',
    variants: [
      { id: 'v2', name: 'Rolo 1m x 10m', price: 94.49, unit: 'm2' },
      { id: 'v3', name: 'Personalizado UV', price: 216.99, unit: 'm2' },
      { id: 'v4', name: 'Personalizado Elevador', price: 174.99, unit: 'm2' },
    ],
  },
  {
    id: '4',
    name: 'Acquakap',
    category: 'Pisos',
    basePrice: 49.9,
    unit: 'unit',
    ncm: '3918.10.00',
    ipi: 0,
    warranty: '1 ano',
    variants: [{ id: 'v5', name: 'Kit 6 Peças 30x30cm', price: 49.9, unit: 'unit' }],
  },
  {
    id: '5',
    name: 'H-Kap',
    category: 'Pisos',
    basePrice: 81.9,
    unit: 'ml',
    ncm: '3918.10.00',
    ipi: 0,
    warranty: '1 ano',
    conditions: [
      { id: 'c1', name: 'Borda Rebaixada', priceModifier: 10, modifierType: 'per_ml' },
      { id: 'c2', name: 'Borda Flex', priceModifier: 45, modifierType: 'per_ml' },
    ],
  },
  {
    id: '6',
    name: 'S-Kap',
    category: 'Pisos',
    basePrice: 82.9,
    unit: 'ml',
    ncm: '3918.10.00',
    ipi: 0,
    warranty: '3 meses',
    conditions: [
      { id: 'c3', name: 'Borda Rebaixada', priceModifier: 10, modifierType: 'per_ml' },
      { id: 'c4', name: 'Borda Flex', priceModifier: 45, modifierType: 'per_ml' },
    ],
  },
  {
    id: '7',
    name: 'W-Kap',
    category: 'Pisos',
    basePrice: 85.0,
    unit: 'ml',
    ncm: '3918.10.00',
    ipi: 0,
    warranty: '3 meses',
    conditions: [
      { id: 'c5', name: 'Borda Rebaixada', priceModifier: 10, modifierType: 'per_ml' },
      { id: 'c6', name: 'Borda Flex', priceModifier: 45, modifierType: 'per_ml' },
    ],
  },
  {
    id: '8',
    name: 'Waterkap',
    category: 'Tapetes',
    basePrice: 153.9,
    unit: 'm2',
    ncm: '5702.92.00',
    ipi: 6.5,
    warranty: '3 meses',
    variants: [
      { id: 'v6', name: '60cm x 90cm', price: 69.9, unit: 'unit' },
      { id: 'v7', name: '90cm x 1.5m', price: 226.9, unit: 'unit' },
      { id: 'v8', name: '40cm x 60cm', price: 19.9, unit: 'unit' },
      { id: 'v9', name: '45cm x 75cm', price: 27.9, unit: 'unit' },
      { id: 'v10', name: 'Rolo 1.20m x 18m', price: 153.9, unit: 'm2' },
      { id: 'v11', name: 'Rolo Promo 1.20m x 18m', price: 95.9, unit: 'm2' },
    ],
    conditions: [{ id: 'c7', name: 'Borda Flex', priceModifier: 45, modifierType: 'per_m2' }],
  },
  {
    id: '9',
    name: 'Waterkap Elite',
    category: 'Tapetes',
    basePrice: 149.9,
    unit: 'm2',
    ncm: '5702.50.20',
    ipi: 6.5,
    warranty: '1 ano',
    conditions: [{ id: 'c8', name: 'Borda Flex', priceModifier: 45, modifierType: 'per_m2' }],
  },
  {
    id: '10',
    name: 'Firekap',
    category: 'Tapetes',
    basePrice: 99.99,
    unit: 'unit',
    ncm: '3918.10.00',
    ipi: 0,
    warranty: '3 meses',
    variants: [{ id: 'v12', name: '1m x 1m', price: 99.99, unit: 'unit' }],
  },
  {
    id: '11',
    name: 'Duo Ópera',
    category: 'Tapetes',
    basePrice: 250.0,
    unit: 'm2',
    ncm: '5702.32.00',
    ipi: 0,
    warranty: '1 ano',
  },
  {
    id: '12',
    name: 'Vinil Alto Tráfego',
    category: 'Tapetes',
    basePrice: 180.0,
    unit: 'm2',
    ncm: '3918.10.00',
    ipi: 0,
    warranty: '1 ano',
    conditions: [{ id: 'c9', name: 'Vulcanizado 03', priceModifier: 30, modifierType: 'per_m2' }],
  },
]

export const useAppStore = create<AppState>((set) => ({
  customers: [],
  products: initialProducts,
  quotes: [],
  addCustomer: (customer) =>
    set((state) => ({
      customers: [...state.customers, { ...customer, id: Math.random().toString(36).substr(2, 9) }],
    })),
  updateCustomer: (id, customer) =>
    set((state) => ({
      customers: state.customers.map((c) => (c.id === id ? { ...c, ...customer } : c)),
    })),
  deleteCustomer: (id) =>
    set((state) => ({
      customers: state.customers.filter((c) => c.id !== id),
    })),
  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, { ...product, id: Math.random().toString(36).substr(2, 9) }],
    })),
  updateProduct: (id, product) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...product } : p)),
    })),
  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),
  addQuote: (quote) =>
    set((state) => ({
      quotes: [...state.quotes, { ...quote, id: Math.random().toString(36).substr(2, 9) }],
    })),
  updateQuote: (id, quote) =>
    set((state) => ({
      quotes: state.quotes.map((q) => (q.id === id ? { ...q, ...quote } : q)),
    })),
  deleteQuote: (id) =>
    set((state) => ({
      quotes: state.quotes.filter((q) => q.id !== id),
    })),
}))
