import React, { createContext, useContext, useState, ReactNode } from 'react'
import { INITIAL_COSTS, ProductPricing } from '@/lib/constants'

export type Client = {
  id: string
  name: string
  doc: string
  ie: string
  im?: string
  contactName: string
  phone: string
  email?: string
  address: string
  cep?: string
  bairro?: string
}

export type Supplier = {
  id: string
  name: string
  cnpj: string
  contactName: string
  phone: string
  email?: string
}

export type FinTransaction = {
  id: string
  desc: string
  value: number
  date: string
  status: 'Pendente' | 'Pago' | 'Recebido'
  type: 'INCOME' | 'EXPENSE'
}

export type CompanySettings = {
  name: string
  cnpj: string
  address: string
  phone: string
  defaultSeller: string
  logoUrl: string
}

export type QuoteItem = {
  id: string
  description: string
  material: string
  customization: string
  width: number
  height: number
  quantity: number
  bordaFlex: boolean
  bordaRebaixada?: boolean
  exactMeasure: boolean
  isMisc?: boolean
  unit?: string
  costPrice: number
  marginPercent: number
  salePrice: number
  ncm?: string
}

export type Quote = {
  id: string
  number: number
  date: string
  clientId: string
  seller: string
  observations: string
  photos: string[]
  layouts: string[]
  status: 'Rascunho' | 'Enviado' | 'Aprovado' | 'Rejeitado'
  items: QuoteItem[]
  deliveryTime: string
  validityDays: number
  paymentTerms: string
  total: number
  freight: number
}

type AppState = {
  settings: CompanySettings
  updateSettings: (s: Partial<CompanySettings>) => void
  clients: Client[]
  saveClient: (c: Client) => void
  suppliers: Supplier[]
  saveSupplier: (s: Supplier) => void
  transactions: FinTransaction[]
  addTransaction: (t: FinTransaction) => void
  costs: Record<string, Record<string, ProductPricing>>
  updateCost: (category: string, item: string, data: Partial<ProductPricing>) => void
  quotes: Quote[]
  saveQuote: (quote: Quote) => void
  updateQuoteStatus: (id: string, status: Quote['status']) => void
}

const AppContext = createContext<AppState | undefined>(undefined)

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<CompanySettings>({
    name: 'ViahTap Personalizados',
    cnpj: '30.344.595/0001-63',
    address: 'Rua Rubens Trefiglio, 54, 13088-037 - Campinas, SP',
    phone: '11 5199-7915',
    defaultSeller: 'Luciane Mary',
    logoUrl: 'https://img.usecurling.com/i?q=V&color=blue&shape=fill',
  })

  const [clients, setClients] = useState<Client[]>([
    {
      id: 'c1',
      name: 'Condominio Vide Campo Belo',
      doc: 'ISENTO',
      ie: 'ISENTO',
      im: '',
      contactName: 'João Silva',
      phone: '(19) 99999-1111',
      email: 'contato@videcampobelo.com.br',
      address: 'Rua Estevão Baião, 520',
      bairro: 'Vila Congonhas',
      cep: '04624-001',
    },
  ])

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: 's1',
      name: 'Fornecedor Kapazi Oficial',
      cnpj: '12.345.678/0001-99',
      contactName: 'Carlos Distribuição',
      phone: '(11) 3333-4444',
      email: 'vendas@kapazi.com.br',
    },
  ])

  const [transactions, setTransactions] = useState<FinTransaction[]>([
    {
      id: 't1',
      desc: 'Compra Vinil Lote 44',
      value: 1250.0,
      date: new Date().toISOString(),
      status: 'Pendente',
      type: 'EXPENSE',
    },
    {
      id: 't2',
      desc: 'Energia Elétrica',
      value: 450.0,
      date: new Date().toISOString(),
      status: 'Pago',
      type: 'EXPENSE',
    },
  ])

  const [costs, setCosts] = useState(INITIAL_COSTS)

  const [quotes, setQuotes] = useState<Quote[]>([
    {
      id: '1',
      number: 467,
      date: new Date().toISOString(),
      clientId: 'c1',
      seller: 'Luciane Mary',
      observations: 'Produção do layout após aprovação do orçamento.',
      photos: [],
      layouts: [],
      status: 'Aprovado',
      deliveryTime: '30 DIAS UTEIS',
      validityDays: 5,
      paymentTerms: '50% sinal no pedido\n50% na entrega',
      freight: 150,
      total: 5640,
      items: [
        {
          id: 'i1',
          description: 'Tapete VINIL GOLD Liso 100x100cm',
          material: 'VINIL_GOLD',
          customization: 'Liso',
          width: 100,
          height: 100,
          quantity: 3,
          bordaFlex: false,
          bordaRebaixada: false,
          exactMeasure: false,
          unit: 'UN',
          costPrice: 125,
          marginPercent: 100,
          salePrice: 5490,
          ncm: '3918.10.00',
        },
      ],
    },
  ])

  const updateSettings = (s: Partial<CompanySettings>) => setSettings((p) => ({ ...p, ...s }))

  const saveClient = (c: Client) => {
    setClients((p) => {
      const exists = p.find((x) => x.id === c.id)
      if (exists) return p.map((x) => (x.id === c.id ? c : x))
      return [c, ...p]
    })
  }

  const saveSupplier = (s: Supplier) => {
    setSuppliers((p) => {
      const exists = p.find((x) => x.id === s.id)
      if (exists) return p.map((x) => (x.id === s.id ? s : x))
      return [s, ...p]
    })
  }

  const addTransaction = (t: FinTransaction) => setTransactions((p) => [t, ...p])

  const updateCost = (c: string, i: string, data: Partial<ProductPricing>) => {
    setCosts((prev) => {
      const category = prev[c] || {}
      const item = category[i] || { type: 'fixed', price: 0 }
      return {
        ...prev,
        [c]: {
          ...category,
          [i]: { ...item, ...data },
        },
      }
    })
  }

  const saveQuote = (q: Quote) => {
    setQuotes((p) => {
      const exists = p.find((x) => x.id === q.id)
      if (exists) return p.map((x) => (x.id === q.id ? q : x))
      return [q, ...p]
    })
  }

  const updateQuoteStatus = (id: string, s: Quote['status']) =>
    setQuotes((p) => p.map((q) => (q.id === id ? { ...q, status: s } : q)))

  return React.createElement(
    AppContext.Provider,
    {
      value: {
        settings,
        updateSettings,
        clients,
        saveClient,
        suppliers,
        saveSupplier,
        transactions,
        addTransaction,
        costs,
        updateCost,
        quotes,
        saveQuote,
        updateQuoteStatus,
      },
    },
    children,
  )
}

export default function useAppStore() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppStore must be used within AppStoreProvider')
  return context
}
