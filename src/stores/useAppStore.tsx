import React, { createContext, useContext, useState, ReactNode } from 'react'
import { INITIAL_COSTS, ProductPricing } from '@/lib/constants'

export type Client = {
  id: string
  name: string
  doc: string
  ie: string
  contactName: string
  phone: string
  address: string
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
  exactMeasure: boolean
  costPrice: number
  marginPercent: number
  salePrice: number
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
  addClient: (c: Client) => void
  updateClient: (c: Client) => void
  costs: Record<string, Record<string, ProductPricing>>
  updateCost: (category: string, item: string, price: number) => void
  quotes: Quote[]
  addQuote: (quote: Quote) => void
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
      contactName: 'João Silva',
      phone: '(19) 99999-1111',
      address: 'Rua Estevão Baião, 520, Vila Congonhas, SP',
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
          exactMeasure: false,
          costPrice: 125,
          marginPercent: 100,
          salePrice: 5490,
        },
      ],
    },
  ])

  const updateSettings = (s: Partial<CompanySettings>) => setSettings((p) => ({ ...p, ...s }))
  const addClient = (c: Client) => setClients((p) => [c, ...p])
  const updateClient = (c: Client) => setClients((p) => p.map((x) => (x.id === c.id ? c : x)))
  const updateCost = (c: string, i: string, p: number) => {
    setCosts((prev) => ({ ...prev, [c]: { ...prev[c], [i]: { ...prev[c][i], price: p } } }))
  }
  const addQuote = (q: Quote) => setQuotes((p) => [q, ...p])
  const updateQuoteStatus = (id: string, s: Quote['status']) =>
    setQuotes((p) => p.map((q) => (q.id === id ? { ...q, status: s } : q)))

  return React.createElement(
    AppContext.Provider,
    {
      value: {
        settings,
        updateSettings,
        clients,
        addClient,
        updateClient,
        costs,
        updateCost,
        quotes,
        addQuote,
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
