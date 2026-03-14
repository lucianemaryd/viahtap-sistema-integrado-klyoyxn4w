import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { PlusCircle, Plus } from 'lucide-react'
import { formatCurrency } from '@/lib/formatters'
import useAppStore, { QuoteItem } from '@/stores/useAppStore'
import { ProductPricingType } from '@/lib/constants'
import { useToast } from '@/hooks/use-toast'

export default function ProductForm({ onAdd }: { onAdd: (item: QuoteItem) => void }) {
  const { costs, updateCost } = useAppStore()
  const { toast } = useToast()

  const [material, setMaterial] = useState<string>('VINIL_GOLD')
  const availableItems = Object.keys(costs[material] || {})
  const [customization, setCustomization] = useState<string>(availableItems[0] || '')

  useEffect(() => {
    const items = Object.keys(costs[material] || {})
    if (!items.includes(customization)) setCustomization(items[0] || '')
  }, [material, costs])

  const [width, setWidth] = useState(100)
  const [height, setHeight] = useState(100)
  const [qty, setQty] = useState(1)
  const [bordaType, setBordaType] = useState('Nenhuma')
  const [exactMeasure, setExactMeasure] = useState(false)
  const [margin, setMargin] = useState(100)

  const [newCatOpen, setNewCatOpen] = useState(false)
  const [newCatForm, setNewCatForm] = useState({
    category: '',
    name: '',
    type: 'm2' as ProductPricingType,
    price: 0,
    ncm: '',
  })

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
      ['m2', 'ml'].includes(selectedItemConfig.type)
    ) {
      const sorted = [...selectedItemConfig.fatorCorte].sort((a, b) => a - b)
      const fitW = sorted.find((f) => f >= width)
      const fitH = sorted.find((f) => f >= height)
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

    if (selectedItemConfig.type === 'm2') calculatedCost = basePrice * areaM2
    else if (selectedItemConfig.type === 'ml')
      calculatedCost = basePrice * (Math.max(effectiveW, effectiveH) / 100)

    if (material.startsWith('VINIL_')) {
      if (bordaType === 'Vulcanizada') calculatedCost += 20 * areaM2
      if (bordaType === 'Flex Aplicada') calculatedCost += 45 * areaM2
      if (bordaType === 'Rebaixada') calculatedCost += 10 * areaM2
    }

    if (exactMeasure) calculatedCost *= 1.1

    let finalCost = calculatedCost * qty
    let salePrice = finalCost * (1 + margin / 100)

    if (material === 'CLEANKAP') {
      const minSale = customization.includes('Borda Flex') ? 700 : 614
      if (salePrice / qty < minSale) salePrice = minSale * qty
    }

    return {
      currentCost: finalCost,
      salePrice,
      effectiveDims:
        effectiveW !== width || effectiveH !== height
          ? `(Fator: ${effectiveW}x${effectiveH}cm)`
          : '',
    }
  }, [
    selectedItemConfig,
    width,
    height,
    qty,
    bordaType,
    exactMeasure,
    margin,
    material,
    customization,
  ])

  const handleAddItem = () => {
    if (!selectedItemConfig) return
    const isDim = ['m2', 'ml'].includes(selectedItemConfig.type)
    const dimStr = isDim ? ` ${width}x${height}cm` : ''
    let addOns = []
    if (bordaType !== 'Nenhuma' && material.startsWith('VINIL_')) addOns.push(`Borda ${bordaType}`)
    if (exactMeasure) addOns.push('Medida Exata')
    const addOnStr = addOns.length > 0 ? ` c/ ${addOns.join(', ')}` : ''

    let unit = 'UN'
    if (selectedItemConfig.type === 'm2') unit = 'M²'
    if (selectedItemConfig.type === 'ml') unit = 'ML'
    if (selectedItemConfig.type === 'roll') unit = 'ROLO'

    onAdd({
      id: Math.random().toString(),
      description: `Tapete ${material.replace(/_/g, ' ')} ${customization}${dimStr}${addOnStr}`,
      material,
      customization,
      width,
      height,
      quantity: qty,
      exactMeasure,
      bordaType,
      unit,
      costPrice: calculatedValues.currentCost,
      marginPercent: margin,
      salePrice: calculatedValues.salePrice,
      ncm: selectedItemConfig.ncm,
    })
    toast({ title: 'Item adicionado ao orçamento.' })
  }

  const handleAddCatalogItem = () => {
    if (!newCatForm.category || !newCatForm.name || newCatForm.price <= 0)
      return toast({ variant: 'destructive', title: 'Preencha os campos.' })
    const catFmt = newCatForm.category.toUpperCase().replace(/\s/g, '_')
    updateCost(catFmt, newCatForm.name, {
      type: newCatForm.type,
      price: newCatForm.price,
      ncm: newCatForm.ncm,
    })
    setMaterial(catFmt)
    setTimeout(() => setCustomization(newCatForm.name), 100)
    setNewCatOpen(false)
    toast({ title: 'Novo produto salvo!' })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="font-semibold text-lg">3. Adicionar Produto da Tabela</h3>
        <Dialog open={newCatOpen} onOpenChange={setNewCatOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-1" /> Novo Rápido
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Produto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                value={newCatForm.category}
                onChange={(e) => setNewCatForm({ ...newCatForm, category: e.target.value })}
                placeholder="Categoria (Ex: PISO_MODULAR)"
              />
              <Input
                value={newCatForm.name}
                onChange={(e) => setNewCatForm({ ...newCatForm, name: e.target.value })}
                placeholder="Nome / Variação"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Preço Base (R$)"
                  value={newCatForm.price || ''}
                  onChange={(e) => setNewCatForm({ ...newCatForm, price: +e.target.value })}
                />
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
                    <SelectItem value="m2">M²</SelectItem>
                    <SelectItem value="ml">Metro Linear (ML)</SelectItem>
                    <SelectItem value="roll">Rolo</SelectItem>
                  </SelectContent>
                </Select>
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
          <Label>Variação / Tipo</Label>
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

        {['m2', 'ml'].includes(selectedItemConfig?.type || '') && (
          <>
            <div className="space-y-2">
              <Label>Largura (cm)</Label>
              <Input type="number" value={width} onChange={(e) => setWidth(+e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Altura/Comp (cm)</Label>
              <Input type="number" value={height} onChange={(e) => setHeight(+e.target.value)} />
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label>Qtd</Label>
          <Input type="number" value={qty} onChange={(e) => setQty(+e.target.value)} />
        </div>

        {material.startsWith('VINIL_') && (
          <div className="space-y-2 md:col-span-2">
            <Label>Tipo de Borda</Label>
            <Select value={bordaType} onValueChange={setBordaType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Nenhuma">Sem Borda</SelectItem>
                <SelectItem value="Vulcanizada">Vulcanizada (+ R$ 20/m²)</SelectItem>
                <SelectItem value="Flex Aplicada">Flex Aplicada (+ R$ 45/m²)</SelectItem>
                <SelectItem value="Rebaixada">Rebaixada (+ R$ 10/m²)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex items-center space-x-2 md:col-span-2 pb-2">
          <Switch id="exact" checked={exactMeasure} onCheckedChange={setExactMeasure} />
          <Label htmlFor="exact">Medida Exata (+10%)</Label>
        </div>
      </div>

      <div className="mt-4 p-4 bg-muted rounded-lg grid md:grid-cols-4 gap-4 items-center border">
        <div>
          <p className="text-xs text-muted-foreground uppercase font-bold">Custo Base</p>
          <p className="text-xl font-bold">{formatCurrency(calculatedValues.currentCost)}</p>
          {calculatedValues.effectiveDims && (
            <p className="text-[10px] text-primary font-medium">{calculatedValues.effectiveDims}</p>
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
          <p className="text-xs text-muted-foreground uppercase font-bold">Preço Venda</p>
          <p className="text-xl font-bold text-primary">
            {formatCurrency(calculatedValues.salePrice)}
          </p>
        </div>
        <Button onClick={handleAddItem} className="w-full h-full" size="lg">
          <PlusCircle className="w-4 h-4 mr-2" /> Adicionar
        </Button>
      </div>
    </div>
  )
}
