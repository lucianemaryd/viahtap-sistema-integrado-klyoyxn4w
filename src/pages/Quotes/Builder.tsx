import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { formatCurrency } from '@/lib/formatters'
import useAppStore, { Quote, QuoteItem } from '@/stores/useAppStore'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Save, Printer, ImagePlus, FileUp, Trash2 } from 'lucide-react'
import QuotePreview from './QuotePreview'
import ProductForm from './ProductForm'

export default function QuoteBuilder() {
  const navigate = useNavigate()
  const location = useLocation()
  const { saveQuote, quotes, clients, settings } = useAppStore()
  const { toast } = useToast()

  const editingQuoteId = location.state?.quoteId
  const initialViewPdf = location.state?.viewPdf
  const existingQuote = editingQuoteId ? quotes.find((q) => q.id === editingQuoteId) : null

  const defaultNumber = quotes.length > 0 ? Math.max(...quotes.map((q) => q.number)) + 1 : 467

  const [quoteId] = useState(existingQuote?.id || Math.random().toString())
  const [quoteNumber] = useState(existingQuote?.number || defaultNumber)
  const [status] = useState(existingQuote?.status || 'Rascunho')
  const [clientId, setClientId] = useState<string>(existingQuote?.clientId || '')
  const [seller, setSeller] = useState(existingQuote?.seller || settings.defaultSeller)
  const [observations, setObservations] = useState(
    existingQuote?.observations ||
      'Obs.: A produção do layout será realizada após a aprovação do orçamento.',
  )
  const [photos, setPhotos] = useState<string[]>(existingQuote?.photos || [])
  const [layouts, setLayouts] = useState<string[]>(existingQuote?.layouts || [])
  const [conditions, setConditions] = useState({
    delivery: existingQuote?.deliveryTime || '30 DIAS UTEIS',
    validity: existingQuote?.validityDays || 5,
    payment: existingQuote?.paymentTerms || '50% sinal no pedido\n50% na entrega',
    freight: existingQuote?.freight || 150,
  })
  const [items, setItems] = useState<QuoteItem[]>(existingQuote?.items || [])

  const handleSave = () => {
    if (!clientId || items.length === 0)
      return toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Selecione um cliente e adicione itens.',
      })
    const quoteToSave: Quote = {
      id: quoteId,
      number: quoteNumber,
      date: existingQuote?.date || new Date().toISOString(),
      clientId,
      seller,
      observations,
      photos,
      layouts,
      status,
      items,
      deliveryTime: conditions.delivery,
      validityDays: conditions.validity,
      paymentTerms: conditions.payment,
      freight: conditions.freight,
      total: items.reduce((acc, i) => acc + i.salePrice, 0) + conditions.freight,
    }
    saveQuote(quoteToSave)
    toast({ title: 'Orçamento salvo com sucesso!' })
    navigate('/quotes')
  }

  const draftQuote: Quote = {
    id: quoteId,
    number: quoteNumber,
    date: existingQuote?.date || new Date().toISOString(),
    clientId,
    seller,
    observations,
    photos,
    layouts,
    status,
    items,
    deliveryTime: conditions.delivery,
    validityDays: conditions.validity,
    paymentTerms: conditions.payment,
    freight: conditions.freight,
    total: items.reduce((acc, i) => acc + i.salePrice, 0) + conditions.freight,
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between no-print">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">
            {existingQuote ? `Editar Orçamento #${quoteNumber}` : `Novo Orçamento #${quoteNumber}`}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> Imprimir
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> Salvar
          </Button>
        </div>
      </div>

      <Tabs defaultValue={initialViewPdf ? 'preview' : 'editor'} className="w-full">
        <TabsList className="no-print mb-4">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">Pré-visualização & PDF</TabsTrigger>
        </TabsList>
        <TabsContent value="editor" className="space-y-6 no-print">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">1. Dados Básicos</h3>
                <div className="space-y-2">
                  <Label>Cliente</Label>
                  <Select value={clientId} onValueChange={setClientId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Vendedor</Label>
                  <Input value={seller} onChange={(e) => setSeller(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Observações</Label>
                  <Textarea
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    className="h-20"
                  />
                </div>
                <div className="flex gap-4 pt-2">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setPhotos([...photos, 'https://img.usecurling.com/p/400/300?q=door%20mat'])
                    }
                    className="w-full text-xs"
                  >
                    <ImagePlus className="w-4 h-4 mr-2" /> Foto
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setLayouts([
                        ...layouts,
                        'https://img.usecurling.com/p/400/300?q=blueprint%20design',
                      ])
                    }
                    className="w-full text-xs"
                  >
                    <FileUp className="w-4 h-4 mr-2" /> Layout
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">2. Condições Comerciais</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Prazo de Entrega</Label>
                    <Input
                      value={conditions.delivery}
                      onChange={(e) => setConditions({ ...conditions, delivery: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Validade (Dias)</Label>
                    <Input
                      type="number"
                      value={conditions.validity}
                      onChange={(e) => setConditions({ ...conditions, validity: +e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Frete (R$)</Label>
                  <Input
                    type="number"
                    value={conditions.freight}
                    onChange={(e) => setConditions({ ...conditions, freight: +e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pagamento</Label>
                  <Textarea
                    value={conditions.payment}
                    onChange={(e) => setConditions({ ...conditions, payment: e.target.value })}
                    className="h-20"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6">
              <ProductForm onAdd={(i) => setItems([...items, i])} />
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-4 border-b pb-2">Itens do Orçamento</h3>
              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center border rounded border-dashed">
                  Nenhum item adicionado.
                </p>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-muted/50 p-3 rounded border text-sm"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Qtd: {item.quantity} {item.unit} | Custo: {formatCurrency(item.costPrice)}{' '}
                          | Margem: {item.marginPercent}%
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-primary">
                          {formatCurrency(item.salePrice)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setItems(items.filter((i) => i.id !== item.id))}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="preview" className="print:m-0 print:p-0">
          <QuotePreview quote={draftQuote} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
