import { useState, useMemo } from 'react'
import { useAppStore, QuoteItem } from '@/stores/useAppStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { formatCurrency } from '@/lib/formatters'

interface ProductFormProps {
  onAdd: (item: QuoteItem) => void
}

export default function ProductForm({ onAdd }: ProductFormProps) {
  const products = useAppStore((state) => state.products)
  const [selectedProductId, setSelectedProductId] = useState<string>('')
  const [selectedVariantId, setSelectedVariantId] = useState<string>('none')
  const [width, setWidth] = useState<number>(1)
  const [length, setLength] = useState<number>(1)
  const [quantity, setQuantity] = useState<number>(1)
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId),
    [products, selectedProductId],
  )
  const selectedVariant = useMemo(
    () => selectedProduct?.variants?.find((v) => v.id === selectedVariantId),
    [selectedProduct, selectedVariantId],
  )

  const currentUnit = selectedVariant?.unit || selectedProduct?.unit || 'unit'

  const calculatedPrice = useMemo(() => {
    if (!selectedProduct) return { unitPrice: 0, totalPrice: 0 }

    let basePrice = selectedVariant ? selectedVariant.price : selectedProduct.basePrice
    let multiplier = 1

    if (currentUnit === 'm2') {
      multiplier = width * length
    } else if (currentUnit === 'ml') {
      // Linear meter exact rule: Total = (Length * Linear Meter Price)
      multiplier = length
    }

    let modifierTotal = 0
    const activeConditions =
      selectedProduct.conditions?.filter((c) => selectedConditions.includes(c.id)) || []

    activeConditions.forEach((cond) => {
      if (cond.modifierType === 'per_m2') {
        modifierTotal += cond.priceModifier * (currentUnit === 'm2' ? width * length : 1)
      } else if (cond.modifierType === 'per_ml') {
        // If product is sold by area, a linear meter condition (like a border) applies to perimeter.
        // Otherwise, it strictly applies to the length.
        const mlMultiplier = currentUnit === 'm2' ? 2 * (width + length) : length
        modifierTotal += cond.priceModifier * mlMultiplier
      } else if (cond.modifierType === 'fixed') {
        modifierTotal += cond.priceModifier
      }
    })

    let unitPriceForOneItem = basePrice * multiplier + modifierTotal

    return {
      unitPrice: unitPriceForOneItem,
      totalPrice: unitPriceForOneItem * quantity,
    }
  }, [selectedProduct, selectedVariant, currentUnit, width, length, quantity, selectedConditions])

  const handleAdd = () => {
    if (!selectedProduct) return
    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      width,
      length,
      quantity,
      unitPrice: calculatedPrice.unitPrice,
      totalPrice: calculatedPrice.totalPrice,
      conditions: selectedConditions,
    })
    setSelectedProductId('')
    setSelectedVariantId('none')
    setWidth(1)
    setLength(1)
    setQuantity(1)
    setSelectedConditions([])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adicionar Produto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Produto</Label>
          <Select
            value={selectedProductId}
            onValueChange={(id) => {
              setSelectedProductId(id)
              setSelectedVariantId('none')
              setSelectedConditions([])
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um produto" />
            </SelectTrigger>
            <SelectContent>
              {products.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedProduct?.variants && selectedProduct.variants.length > 0 && (
          <div className="space-y-2">
            <Label>Variante/Tamanho</Label>
            <Select value={selectedVariantId} onValueChange={setSelectedVariantId}>
              <SelectTrigger>
                <SelectValue placeholder="Padrão" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Padrão</SelectItem>
                {selectedProduct.variants.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.name} ({formatCurrency(v.price)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {currentUnit !== 'unit' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Largura (m)</Label>
              <Input
                type="number"
                step="0.01"
                min="0.1"
                value={width}
                onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Comprimento (m)</Label>
              <Input
                type="number"
                step="0.01"
                min="0.1"
                value={length}
                onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>Quantidade</Label>
          <Input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          />
        </div>

        {selectedProduct?.conditions && selectedProduct.conditions.length > 0 && (
          <div className="space-y-2">
            <Label>Condições Extras</Label>
            <div className="grid gap-2">
              {selectedProduct.conditions.map((cond) => (
                <div key={cond.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={cond.id}
                    checked={selectedConditions.includes(cond.id)}
                    onCheckedChange={(checked) => {
                      if (checked) setSelectedConditions([...selectedConditions, cond.id])
                      else setSelectedConditions(selectedConditions.filter((id) => id !== cond.id))
                    }}
                  />
                  <Label htmlFor={cond.id}>
                    {cond.name} (+{formatCurrency(cond.priceModifier)}{' '}
                    {cond.modifierType === 'per_m2'
                      ? '/m2'
                      : cond.modifierType === 'per_ml'
                        ? '/ml'
                        : ''}
                    )
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 flex justify-between items-center border-t">
          <div>
            <p className="text-sm text-muted-foreground">
              Valor Unitário: {formatCurrency(calculatedPrice.unitPrice)}
            </p>
            <p className="text-lg font-bold">Total: {formatCurrency(calculatedPrice.totalPrice)}</p>
          </div>
          <Button onClick={handleAdd} disabled={!selectedProduct}>
            Adicionar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
