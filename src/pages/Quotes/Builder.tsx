import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { formatCurrency } from '@/lib/formatters'
import useAppStore, { Quote, QuoteItem } from '@/stores/useAppStore'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Save, Printer, ImagePlus, FileUp } from 'lucide-react'
import QuotePreview from './QuotePreview'

export default function QuoteBuilder() {
  const navigate = useNavigate()
  const { addQuote, quotes, clients, settings, costs } = useAppStore()
  const { toast } = useToast()

  const defaultNumber = quotes.length > 0 ? Math.max(...quotes.map((q) => q.number)) + 1 : 467

  const [clientId, setClientId] = useState<string>('')
  const [seller, setSeller] = useState(settings.defaultSeller)
  const [observations, setObservations] = useState(
    'Obs.: A produção do layout será realizada após a aprovação do orçamento.',
  )
  const [photos, setPhotos] = useState<string[]>([])
  const [layouts, setLayouts] = useState<string[]>([])

  const [conditions, setConditions] = useState({
    delivery: '30 DIAS UTEIS',
    validity: 5,
    payment: '50% sinal no pedido\n50% na entrega',
    freight: 150,
  })

  // Product Form
  const [material, setMaterial] = useState<string>('VINIL_GOLD')
  const availableItems = Object.keys(costs[material] || {})
  const [customization, setCustomization] = useState<string>(availableItems[0] || '')

  useEffect(() => {
    const items = Object.keys(costs[material] || {})
    setCustomization(items[0] || '')
  }, [material, costs])

  const [width, setWidth] = useState(100)
  const [height, setHeight] = useState(100)
  const [qty, setQty] = useState(1)
  const [bordaFlex, setBordaFlex] = useState(false)
  const [exactMeasure, setExactMeasure] = useState(false)
  const [margin, setMargin] = useState(100)

  const [items, setItems] = useState<QuoteItem[]>([])

  const selectedItemConfig = costs[material]?.[customization]

  const currentCost = useMemo(() => {
    if (!selectedItemConfig) return 0
    let basePrice = selectedItemConfig.price
    const area = (width * height) / 10000

    let calculatedCost = basePrice
    if (selectedItemConfig.type === 'm2') {
      calculatedCost = basePrice * area
    }

    if (bordaFlex) {
      calculatedCost += 45 * area // R$ 45/m2
    }

    if (exactMeasure) calculatedCost *= 1.1 // +10%
    return calculatedCost * qty
  }, [selectedItemConfig, width, height, qty, bordaFlex, exactMeasure])

  const salePrice = currentCost * (1 + margin / 100)

  const handleAddItem = () => {
    if (!selectedItemConfig) return
    const dimensions = selectedItemConfig.type === 'm2' ? ` ${width}x${height}cm` : ''
    const newItem: QuoteItem = {
      id: Math.random().toString(),
      description: `Tapete ${material.replace('_', ' ')} ${customization}${dimensions}${bordaFlex ? ' c/ Borda Flex' : ''}`,
      material,
      customization,
      width,
      height,
      quantity: qty,
      bordaFlex,
      exactMeasure,
      costPrice: currentCost,
      marginPercent: margin,
      salePrice,
    }
    setItems([...items, newItem])
    toast({ title: 'Item adicionado ao orçamento.' })
  }

  const handleAddAttachment = (type: 'photo' | 'layout') => {
    const url =
      type === 'photo'
        ? 'https://img.usecurling.com/p/400/300?q=door%20mat'
        : 'https://img.usecurling.com/p/400/300?q=blueprint%20design'
    if (type === 'photo') setPhotos([...photos, url])
    else setLayouts([...layouts, url])
    toast({ title: 'Anexo adicionado (Simulado)' })
  }

  const handleSave = () => {
    if (!clientId || items.length === 0) {
      return toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Selecione um cliente e adicione itens.',
      })
    }
    const newQuote: Quote = {
      id: Math.random().toString(),
      number: defaultNumber,
      date: new Date().toISOString(),
      clientId,
      seller,
      observations,
      photos,
      layouts,
      status: 'Rascunho',
      items,
      deliveryTime: conditions.delivery,
      validityDays: conditions.validity,
      paymentTerms: conditions.payment,
      freight: conditions.freight,
      total: items.reduce((acc, i) => acc + i.salePrice, 0) + conditions.freight,
    }
    addQuote(newQuote)
    toast({ title: 'Orçamento salvo com sucesso!' })
    navigate('/quotes')
  }

  const draftQuote: Quote = {
    id: 'draft',
    number: defaultNumber,
    date: new Date().toISOString(),
    clientId,
    seller,
    observations,
    photos,
    layouts,
    status: 'Rascunho',
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
          <h1 className="text-2xl font-bold">Novo Orçamento #{defaultNumber}</h1>
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

      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="no-print mb-4">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">Pré-visualização</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-6 no-print">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">1. Dados Básicos</h3>
                <div className="space-y-2">
                  <Label>Cliente (CRM)</Label>
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
                  <Label>Vendedor(a)</Label>
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
                <div className="flex gap-4 pt-2 border-t">
                  <Button
                    variant="secondary"
                    onClick={() => handleAddAttachment('photo')}
                    className="w-full text-xs"
                  >
                    <ImagePlus className="w-4 h-4 mr-2" /> Anexar Foto Local
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleAddAttachment('layout')}
                    className="w-full text-xs"
                  >
                    <FileUp className="w-4 h-4 mr-2" /> Anexar Layout
                  </Button>
                </div>
                {(photos.length > 0 || layouts.length > 0) && (
                  <div className="text-xs text-muted-foreground">
                    {photos.length} fotos, {layouts.length} layouts anexados.
                  </div>
                )}
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
                  <Label>Condições de Pagamento</Label>
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
              <h3 className="font-semibold text-lg mb-4 border-b pb-2">3. Adicionar Produto</h3>
              <div className="grid md:grid-cols-5 gap-4 items-end">
                <div className="space-y-2 md:col-span-2">
                  <Label>Linha / Material</Label>
                  <Select value={material} onValueChange={setMaterial}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(costs).map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-3">
                  <Label>Variação / Tipo ({selectedItemConfig?.type})</Label>
                  <Select value={customization} onValueChange={setCustomization}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableItems.map((k) => (
                        <SelectItem key={k} value={k}>
                          {k} - R$ {costs[material][k].price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedItemConfig?.type === 'm2' && (
                  <>
                    <div className="space-y-2">
                      <Label>Largura (cm)</Label>
                      <Input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(+e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Altura (cm)</Label>
                      <Input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(+e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label>Quantidade</Label>
                  <Input type="number" value={qty} onChange={(e) => setQty(+e.target.value)} />
                </div>

                <div className="flex flex-col gap-2 h-14 justify-end md:col-span-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="borda" checked={bordaFlex} onCheckedChange={setBordaFlex} />
                    <Label htmlFor="borda">Borda Flex (+ R$ 45/m²)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="exact" checked={exactMeasure} onCheckedChange={setExactMeasure} />
                    <Label htmlFor="exact">Medida Exata (+10%)</Label>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg grid md:grid-cols-4 gap-4 items-center border">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                    Custo Base
                  </p>
                  <p className="text-xl font-bold">{formatCurrency(currentCost)}</p>
                </div>
                <div className="space-y-2">
                  <Label>Margem Lucro (%)</Label>
                  <Input
                    type="number"
                    value={margin}
                    onChange={(e) => setMargin(+e.target.value)}
                    className="bg-background"
                  />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                    Preço Final
                  </p>
                  <p className="text-xl font-bold text-primary">{formatCurrency(salePrice)}</p>
                </div>
                <Button onClick={handleAddItem} className="w-full h-full" size="lg">
                  Adicionar à Lista
                </Button>
              </div>
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
