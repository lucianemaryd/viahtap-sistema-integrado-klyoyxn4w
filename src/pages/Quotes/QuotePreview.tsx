import { QuoteItem } from '@/stores/useAppStore'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/formatters'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface QuotePreviewProps {
  items: QuoteItem[]
  onUpdateItem: (id: string, updates: Partial<QuoteItem>) => void
  onRemoveItem: (id: string) => void
}

export default function QuotePreview({ items, onUpdateItem, onRemoveItem }: QuotePreviewProps) {
  const total = items.reduce((acc, item) => acc + item.totalPrice, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Itens do Orçamento</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Nenhum item adicionado.</p>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Medidas</TableHead>
                    <TableHead className="w-[100px]">Qtd</TableHead>
                    <TableHead className="w-[120px]">Valor Un.</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium">
                          <Input
                            value={item.productName}
                            onChange={(e) => onUpdateItem(item.id, { productName: e.target.value })}
                            className="h-8 border-transparent hover:border-input px-1"
                          />
                        </div>
                        {item.variantName && (
                          <div className="text-xs text-muted-foreground ml-1 mt-1">
                            {item.variantName}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {item.width}m x {item.length}m
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const newQtd = parseInt(e.target.value) || 1
                            onUpdateItem(item.id, {
                              quantity: newQtd,
                              totalPrice: item.unitPrice * newQtd,
                            })
                          }}
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => {
                            const newUnitPrice = parseFloat(e.target.value) || 0
                            onUpdateItem(item.id, {
                              unitPrice: newUnitPrice,
                              totalPrice: newUnitPrice * item.quantity,
                            })
                          }}
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.totalPrice)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemoveItem(item.id)}
                          className="h-8 w-8 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-end pt-4">
              <div className="text-2xl font-bold">Total Geral: {formatCurrency(total)}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
