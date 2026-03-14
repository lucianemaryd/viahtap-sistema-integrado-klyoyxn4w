import { useState, useMemo, useEffect } from 'react'
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
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { formatCurrency } from '@/lib/formatters'
import useAppStore, { Quote, QuoteItem } from '@/stores/useAppStore'
import { ProductPricingType } from '@/lib/constants'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Save, Printer, ImagePlus, FileUp, PlusCircle, Trash2, Plus } from 'lucide-react'
import QuotePreview from './QuotePreview'

export default function QuoteBuilder() {
  const navigate = useNavigate()
  const location = useLocation()
  const { saveQuote, quotes, clients, settings, costs, updateCost } = useAppStore()
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

  // Product Form
  const [material, setMaterial] = useState<string>('VINIL_GOLD')
  const availableItems = Object.keys(costs[material] || {})
  const [customization, setCustomization] = useState<string>(availableItems[0] || '')

  useEffect(() => {
    const items = Object.keys(costs[material] || {})
    if (!items.includes(customization)) {
      setCustomization(items[0] || '')
    }
  }, [material, costs])

  const [width, setWidth] = useState(100)
  const [height, setHeight] = useState(100)
  const [qty, setQty] = useState(1)
  const [bordaFlex, setBordaFlex] = useState(false)
  const [bordaRebaixada, setBordaRebaixada] = useState(false)
  const [exactMeasure, setExactMeasure] = useState(false)
  const [margin, setMargin] = useState(100)

  // Quick Add Catalog Item Form
  const [newCatOpen, setNewCatOpen] = useState(false)
  const [newCatForm, setNewCatForm] = useState({
    category: '',
    name: '',
    type: 'm2' as ProductPricingType,
    price: 0,
    ncm: '',
  })

  const [items, setItems] = useState<QuoteItem[]>(existingQuote?.items || [])

  const selectedItemConfig = costs[material]?.[customization]

  const calculatedValues = useMemo(() => {
    if (!selectedItemConfig) return { currentCost: 0, salePrice: 0, effectiveDims: '' }
    let basePrice = selectedItemConfig.price
    let calculatedCost = basePrice
    let effectiveW = width
    let effectiveH = height

    if (
      selectedItemConfig.fatorCorte &&
      !exactMeasure &&
      (selectedItemConfig.type === 'm2' || selectedItemConfig.type === 'ml')
    ) {
      const sortedFatores = [...selectedItemConfig.fatorCorte].sort((a, b) => a - b)
      const fitW = sortedFatores.find((f) => f >= width)
      const fitH = sortedFatores.find((f) => f >= height)

      if (fitW && fitH) {
        if (fitW - width <= fitH - height) {
          effectiveW = fitW
          effectiveH = height
        } else {
          effectiveW = width
          effectiveH = fitH
        }
      } else if (fitW) {
        effectiveW = fitW
        effectiveH = height
      } else if (fitH) {
        effectiveW = width
        effectiveH = fitH
      }
    }

    const areaM2 = (effectiveW * effectiveH) / 10000
    const perimeterML = ((width + height) * 2) / 100

    if (selectedItemConfig.type === 'm2') {
      calculatedCost = basePrice * areaM2
    } else if (selectedItemConfig.type === 'ml') {
      calculatedCost = basePrice * (Math.max(width, height) / 100)
    }

    if (bordaFlex) calculatedCost += 45 * perimeterML
    if (bordaRebaixada) calculatedCost += 10 * perimeterML

    if (exactMeasure) calculatedCost *= 1.1

    const finalCost = calculatedCost * qty
    return {
      currentCost: finalCost,
      salePrice: finalCost * (1 + margin / 100),
      effectiveDims:
        effectiveW !== width || effectiveH !== height
          ? `(Fator de Corte aplicado: ${effectiveW}x${effectiveH}cm)`
          : '',
    }
  }, [selectedItemConfig, width, height, qty, bordaFlex, bordaRebaixada, exactMeasure, margin])

  const handleAddItem = () => {
    if (!selectedItemConfig) return
    const isDimensioned = ['m2', 'ml'].includes(selectedItemConfig.type)
    const dimensions = isDimensioned ? ` ${width}x${height}cm` : ''
    let addOns = []
    if (bordaFlex) addOns.push('Borda Flex')
    if (bordaRebaixada) addOns.push('Borda Rebaixada')
    if (exactMeasure) addOns.push('Medida Exata')
    const addOnStr = addOns.length > 0 ? ` c/ ${addOns.join(', ')}` : ''

    let unit = 'UN'
    if (selectedItemConfig.type === 'm2') unit = 'M²'
    if (selectedItemConfig.type === 'ml') unit = 'ML'
    if (selectedItemConfig.type === 'roll') unit = 'ROLO'

    const newItem: QuoteItem = {
      id: Math.random().toString(),
      description: `Tapete ${material.replace(/_/g, ' ')} ${customization}${dimensions}${addOnStr}`,
      material,
      customization,
      width,
      height,
      quantity: qty,
      bordaFlex,
      bordaRebaixada,
      exactMeasure,
      unit,
      costPrice: calculatedValues.currentCost,
      marginPercent: margin,
      salePrice: calculatedValues.salePrice,
      ncm: selectedItemConfig.ncm,
    }
    setItems([...items, newItem])
    toast({ title: 'Item adicionado ao orçamento.' })
  }

  const handleAddCatalogItem = () => {
    if (!newCatForm.category || !newCatForm.name || newCatForm.price <= 0) {
      return toast({ variant: 'destructive', title: 'Preencha categoria, nome e preço.' })
    }
    const catFormatted = newCatForm.category.toUpperCase().replace(/\s/g, '_')
    updateCost(catFormatted, newCatForm.name, {
      type: newCatForm.type,
      price: newCatForm.price,
      ncm: newCatForm.ncm,
    })
    setMaterial(catFormatted)
    setTimeout(() => setCustomization(newCatForm.name), 100)
    setNewCatOpen(false)
    toast({ title: 'Novo produto salvo no catálogo!' })
  }

  const handleSave = () => {
    if (!clientId || items.length === 0) {
      return toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Selecione um cliente e adicione itens.',
      })
    }
    const quoteToSave: Quote = {
      id: quoteId,
      number: quoteNumber,
      date: existingQuote?.date || new Date().toISOString(),
      clientId,
      seller,
      observations,
      photos,
      layouts,
      status: status,
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
    status: status,
    items,
    deliveryTime: conditions.delivery,
    validityDays: conditions.validity,
    paymentTerms: conditions.payment,
    freight: conditions.freight,
    total: items.reduce((acc, i) => acc + i.salePrice, 0) + conditions.freight,
  }

  const isDimensioned = ['m2', 'ml'].includes(selectedItemConfig?.type || '')

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
                  <Label>Vendedor(a) / Assinatura</Label>
                  <Input value={seller} onChange={(e) => setSeller(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Observações e Pagamento</Label>
                  <Textarea
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    className="h-20"
                  />
                </div>
                <div className="flex gap-4 pt-2 border-t">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setPhotos([...photos, 'https://img.usecurling.com/p/400/300?q=door%20mat'])
                    }
                    className="w-full text-xs"
                  >
                    <ImagePlus className="w-4 h-4 mr-2" /> Anexar Foto
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
                    <FileUp className="w-4 h-4 mr-2" /> Anexar Layout
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
                  <Label>Frete Estimado (R$)</Label>
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
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="font-semibold text-lg">3. Adicionar Produto da Tabela</h3>
                <Dialog open={newCatOpen} onOpenChange={setNewCatOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-1" /> Adicionar Produto Rápido
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cadastrar Novo Produto na Tabela</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>Categoria (Ex: VINIL_ALTO_TRAFEGO ou SERVICO_AVULSO)</Label>
                        <Input
                          value={newCatForm.category}
                          onChange={(e) =>
                            setNewCatForm({ ...newCatForm, category: e.target.value })
                          }
                          placeholder="Piso Modular..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Nome / Variação</Label>
                        <Input
                          value={newCatForm.name}
                          onChange={(e) => setNewCatForm({ ...newCatForm, name: e.target.value })}
                          placeholder="Instalação Especial..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Preço Base (R$)</Label>
                          <Input
                            type="number"
                            value={newCatForm.price || ''}
                            onChange={(e) =>
                              setNewCatForm({ ...newCatForm, price: +e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Tipo de Cálculo</Label>
                          <Select
                            value={newCatForm.type}
                            onValueChange={(v: ProductPricingType) =>
                              setNewCatForm({ ...newCatForm, type: v })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fixed">Fixo / Unidade</SelectItem>
                              <SelectItem value="m2">Metro Quadrado (M²)</SelectItem>
                              <SelectItem value="ml">Metro Linear (ML)</SelectItem>
                              <SelectItem value="roll">Rolo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>NCM (Opcional)</Label>
                        <Input
                          value={newCatForm.ncm}
                          onChange={(e) => setNewCatForm({ ...newCatForm, ncm: e.target.value })}
                          placeholder="0000.00.00"
                        />
                      </div>
                      <Button onClick={handleAddCatalogItem} className="w-full">
                        Salvar no Catálogo
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

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
                          {cat.replace(/_/g, ' ')}
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

                {isDimensioned && (
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

                <div className="flex flex-col gap-2 justify-end md:col-span-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="borda" checked={bordaFlex} onCheckedChange={setBordaFlex} />
                    <Label htmlFor="borda">Borda Flex (+ R$ 45/ML)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="bordaReb"
                      checked={bordaRebaixada}
                      onCheckedChange={setBordaRebaixada}
                    />
                    <Label htmlFor="bordaReb">Borda Rebaixada (+ R$ 10/ML)</Label>
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
                  <p className="text-xl font-bold">
                    {formatCurrency(calculatedValues.currentCost)}
                  </p>
                  {calculatedValues.effectiveDims && (
                    <p className="text-[10px] text-primary font-medium mt-1">
                      {calculatedValues.effectiveDims}
                    </p>
                  )}
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
                  <p className="text-xl font-bold text-primary">
                    {formatCurrency(calculatedValues.salePrice)}
                  </p>
                </div>
                <Button onClick={handleAddItem} className="w-full h-full" size="lg">
                  <PlusCircle className="w-4 h-4 mr-2" /> Adicionar à Lista
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-4 border-b pb-2">Itens do Orçamento</h3>
              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center border rounded border-dashed">
                  Nenhum item adicionado ao orçamento.
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
                          | Margem: {item.marginPercent}% | NCM: {item.ncm || 'N/A'}
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
                          className="text-destructive h-8 w-8"
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
