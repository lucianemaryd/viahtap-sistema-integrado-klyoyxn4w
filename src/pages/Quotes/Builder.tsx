import { useState, useMemo } from 'react'
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
import { COSTS, MaterialType, CustomizationType, BorderType } from '@/lib/constants'
import { formatCurrency } from '@/lib/formatters'
import useAppStore, { Quote, QuoteItem } from '@/stores/useAppStore'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Save, Printer } from 'lucide-react'
import QuotePreview from './QuotePreview'

export default function QuoteBuilder() {
  const navigate = useNavigate()
  const { addQuote, quotes } = useAppStore()
  const { toast } = useToast()

  const [client, setClient] = useState({ name: '', doc: '', address: '' })
  const [conditions, setConditions] = useState({
    delivery: '30 DIAS UTEIS',
    validity: 5,
    payment: '50% sinal no pedido\n50% na entrega',
    freight: 150,
  })

  const [material, setMaterial] = useState<MaterialType>('VINIL_GOLD')
  const [customization, setCustomization] = useState<string>('Liso')
  const [width, setWidth] = useState(100)
  const [height, setHeight] = useState(100)
  const [qty, setQty] = useState(1)
  const [borderType, setBorderType] = useState<BorderType>('Nenhuma')
  const [exactMeasure, setExactMeasure] = useState(false)
  const [margin, setMargin] = useState(100)

  const [items, setItems] = useState<QuoteItem[]>([])

  const currentCost = useMemo(() => {
    let basePrice = 0
    const area = (width * height) / 10000

    if (material === 'VINIL_GOLD') {
      basePrice = COSTS.VINIL_GOLD[customization as keyof typeof COSTS.VINIL_GOLD] || 0
    } else if (material === 'VINIL_ALTO_TRAFEGO') {
      basePrice =
        COSTS.VINIL_ALTO_TRAFEGO[customization as keyof typeof COSTS.VINIL_ALTO_TRAFEGO] || 0
    } else if (material === 'CLEANKAP') {
      basePrice = COSTS.CLEANKAP[customization as keyof typeof COSTS.CLEANKAP] || 0
    }

    let borderCost = 0
    if (borderType !== 'Nenhuma') {
      borderCost = COSTS.BORDA_FLEX[borderType as keyof typeof COSTS.BORDA_FLEX] * area
    }

    let totalCost = basePrice * area + borderCost
    if (exactMeasure) totalCost *= 1.1 // +10%

    return totalCost * qty
  }, [material, customization, width, height, qty, borderType, exactMeasure])

  const salePrice = currentCost * (1 + margin / 100)

  const handleAddItem = () => {
    const newItem: QuoteItem = {
      id: Math.random().toString(),
      description: `Tapete ${material.replace('_', ' ')} ${customization} ${width}x${height}cm`,
      material,
      customization,
      width,
      height,
      quantity: qty,
      borderType,
      exactMeasure,
      costPrice: currentCost,
      marginPercent: margin,
      salePrice,
    }
    setItems([...items, newItem])
    toast({ title: 'Item adicionado ao orçamento.' })
  }

  const handleSave = () => {
    if (!client.name || items.length === 0) {
      return toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Preencha cliente e adicione itens.',
      })
    }
    const newQuote: Quote = {
      id: Math.random().toString(),
      number: 1000 + quotes.length + 1,
      date: new Date().toISOString(),
      clientName: client.name,
      clientDoc: client.doc,
      clientAddress: client.address,
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

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between no-print">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Novo Orçamento</h1>
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
                <h3 className="font-semibold text-lg">1. Dados do Cliente</h3>
                <div className="space-y-2">
                  <Label>Nome / Condomínio</Label>
                  <Input
                    value={client.name}
                    onChange={(e) => setClient({ ...client, name: e.target.value })}
                    placeholder="Ex: Condominio Vide Campo Belo"
                  />
                </div>
                <div className="space-y-2">
                  <Label>CPF / CNPJ / IE</Label>
                  <Input
                    value={client.doc}
                    onChange={(e) => setClient({ ...client, doc: e.target.value })}
                    placeholder="Ex: ISENTO ou 00.000.000/0001-00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Endereço Completo</Label>
                  <Input
                    value={client.address}
                    onChange={(e) => setClient({ ...client, address: e.target.value })}
                    placeholder="Rua, Número, Bairro, Cidade - UF"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-semibold text-lg">2. Condições Comerciais</h3>
                <div className="space-y-2">
                  <Label>Prazo de Entrega</Label>
                  <Input
                    value={conditions.delivery}
                    onChange={(e) => setConditions({ ...conditions, delivery: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Validade (Dias)</Label>
                    <Input
                      type="number"
                      value={conditions.validity}
                      onChange={(e) => setConditions({ ...conditions, validity: +e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Frete (R$)</Label>
                    <Input
                      type="number"
                      value={conditions.freight}
                      onChange={(e) => setConditions({ ...conditions, freight: +e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Condições de Pagamento</Label>
                  <Input
                    value={conditions.payment}
                    onChange={(e) => setConditions({ ...conditions, payment: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-4">
                3. Adicionar Produto (Motor de Cálculo)
              </h3>
              <div className="grid md:grid-cols-4 gap-4 items-end">
                <div className="space-y-2">
                  <Label>Material</Label>
                  <Select value={material} onValueChange={(v: MaterialType) => setMaterial(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VINIL_GOLD">Vinil Gold</SelectItem>
                      <SelectItem value="VINIL_ALTO_TRAFEGO">Vinil Alto Tráfego</SelectItem>
                      <SelectItem value="CLEANKAP">Cleankap</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Personalização</Label>
                  <Select value={customization} onValueChange={setCustomization}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(material === 'CLEANKAP' ? COSTS.CLEANKAP : COSTS.VINIL_GOLD).map(
                        (k) => (
                          <SelectItem key={k} value={k}>
                            {k}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Largura (cm)</Label>
                  <Input type="number" value={width} onChange={(e) => setWidth(+e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Altura (cm)</Label>
                  <Input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(+e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Borda</Label>
                  <Select value={borderType} onValueChange={(v: BorderType) => setBorderType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nenhuma">Nenhuma</SelectItem>
                      <SelectItem value="Vulcanizada">Vulcanizada</SelectItem>
                      <SelectItem value="Aplicada">Aplicada</SelectItem>
                      <SelectItem value="Rebaixada">Rebaixada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quantidade</Label>
                  <Input type="number" value={qty} onChange={(e) => setQty(+e.target.value)} />
                </div>
                <div className="flex items-center space-x-2 h-10">
                  <Switch id="exact" checked={exactMeasure} onCheckedChange={setExactMeasure} />
                  <Label htmlFor="exact">Medida Exata (+10%)</Label>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg grid md:grid-cols-4 gap-4 items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Custo Calculado</p>
                  <p className="text-xl font-bold">{formatCurrency(currentCost)}</p>
                </div>
                <div className="space-y-2">
                  <Label>Margem (%)</Label>
                  <Input
                    type="number"
                    value={margin}
                    onChange={(e) => setMargin(+e.target.value)}
                  />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Preço de Venda</p>
                  <p className="text-xl font-bold text-primary">{formatCurrency(salePrice)}</p>
                </div>
                <Button onClick={handleAddItem} className="w-full">
                  Adicionar Item
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="print:m-0 print:p-0">
          <QuotePreview
            quote={{
              id: 'draft',
              number: 1000 + quotes.length + 1,
              date: new Date().toISOString(),
              clientName: client.name || 'NOME DO CLIENTE',
              clientDoc: client.doc || 'CPF/CNPJ',
              clientAddress: client.address || 'ENDEREÇO',
              status: 'Rascunho',
              items,
              deliveryTime: conditions.delivery,
              validityDays: conditions.validity,
              paymentTerms: conditions.payment,
              freight: conditions.freight,
              total: items.reduce((acc, i) => acc + i.salePrice, 0) + conditions.freight,
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
