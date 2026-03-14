import { useState } from 'react'
import { QuoteItem, useAppStore } from '@/stores/useAppStore'
import ProductForm from './ProductForm'
import QuotePreview from './QuotePreview'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'

export default function Builder() {
  const { customers, addQuote } = useAppStore()
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('')
  const [items, setItems] = useState<QuoteItem[]>([])
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleAddItem = (item: QuoteItem) => {
    setItems([...items, item])
  }

  const handleUpdateItem = (id: string, updates: Partial<QuoteItem>) => {
    setItems(items.map((item) => (item.id === id ? { ...item, ...updates } : item)))
  }

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const handleSaveQuote = () => {
    if (!selectedCustomerId) {
      toast({ title: 'Erro', description: 'Selecione um cliente', variant: 'destructive' })
      return
    }
    if (items.length === 0) {
      toast({ title: 'Erro', description: 'Adicione pelo menos um item', variant: 'destructive' })
      return
    }

    const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0)

    addQuote({
      customerId: selectedCustomerId,
      date: new Date().toISOString(),
      validityDays: 15,
      items,
      subtotal,
      discount: 0,
      total: subtotal,
      status: 'draft',
    })

    toast({ title: 'Sucesso', description: 'Orçamento salvo com sucesso' })
    navigate('/')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Criar Orçamento</h1>
        <Button onClick={handleSaveQuote} size="lg">
          Salvar Orçamento
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Selecione o Cliente</Label>
                <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha..." />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <ProductForm onAdd={handleAddItem} />
        </div>

        <div className="lg:col-span-2">
          <QuotePreview
            items={items}
            onUpdateItem={handleUpdateItem}
            onRemoveItem={handleRemoveItem}
          />
        </div>
      </div>
    </div>
  )
}
