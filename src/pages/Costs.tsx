import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import useAppStore from '@/stores/useAppStore'
import { formatCurrency } from '@/lib/formatters'
import { Badge } from '@/components/ui/badge'

export default function Costs() {
  const { costs, updateCost } = useAppStore()

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Custos</h1>
        <p className="text-muted-foreground">
          Edite os valores base de todos os produtos do portfólio.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(costs).map(([category, items]) => (
          <Card key={category}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                {category.replace('_', ' ')}
                <Badge variant="outline">{Object.keys(items).length} itens</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto / Variação</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="w-[120px] text-right">Preço Base (R$)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(items).map(([itemName, itemData]) => (
                    <TableRow key={itemName}>
                      <TableCell className="font-medium text-sm">{itemName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px]">
                          {itemData.type.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          value={itemData.price}
                          onChange={(e) => updateCost(category, itemName, Number(e.target.value))}
                          className="h-8 text-right font-mono"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
