import React, { createContext, useContext, useState, ReactNode } from 'react'

export type QuoteItem = {
  id: string
  description: string
  material: string
  customization: string
  width: number // in cm
  height: number // in cm
  quantity: number
  borderType: string
  exactMeasure: boolean
  costPrice: number
  marginPercent: number
  salePrice: number
}

export type Quote = {
  id: string
  number: number
  date: string
  clientName: string
  clientDoc: string
  clientAddress: string
  status: 'Rascunho' | 'Enviado' | 'Aprovado' | 'Rejeitado'
  items: QuoteItem[]
  deliveryTime: string
  validityDays: number
  paymentTerms: string
  total: number
  freight: number
}

type AppState = {
  quotes: Quote[]
  addQuote: (quote: Quote) => void
  updateQuoteStatus: (id: string, status: Quote['status']) => void
}

const AppContext = createContext<AppState | undefined>(undefined)

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [quotes, setQuotes] = useState<Quote[]>([
    {
      id: '1',
      number: 1093,
      date: new Date().toISOString(),
      clientName: 'CONDOMINIO VIDE CAMPO BELO',
      clientDoc: 'ISENTO',
      clientAddress: 'Rua Estevão Baião, 520, Vila Congonhas, SP',
      status: 'Aprovado',
      deliveryTime: '30 DIAS UTEIS',
      validityDays: 5,
      paymentTerms: '50% sinal no pedido\n50% na entrega',
      freight: 150,
      total: 16620,
      items: [
        {
          id: 'i1',
          description: 'CAPA PARA ELEVADORES',
          material: 'VINIL_GOLD',
          customization: 'Liso',
          width: 100,
          height: 100,
          quantity: 3,
          borderType: 'Nenhuma',
          exactMeasure: false,
          costPrice: 2000,
          marginPercent: 174.5,
          salePrice: 5490,
        },
      ],
    },
  ])

  const addQuote = (quote: Quote) => {
    setQuotes((prev) => [quote, ...prev])
  }

  const updateQuoteStatus = (id: string, status: Quote['status']) => {
    setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)))
  }

  return React.createElement(
    AppContext.Provider,
    { value: { quotes, addQuote, updateQuoteStatus } },
    children,
  )
}

export default function useAppStore() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppStore must be used within AppStoreProvider')
  }
  return context
}
