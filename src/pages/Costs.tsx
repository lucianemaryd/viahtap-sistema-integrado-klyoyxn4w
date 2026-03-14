import { useState } from 'react'
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
import { Button } from '@/components/ui/button'
import useAppStore from '@/stores/useAppStore'
import { Badge } from '@/components/ui/badge'
import { Edit2, Check, Trash2 } from 'lucide-react'

function CostRow({ category, itemName, itemData, updateCost, renameCost, deleteCost }: any) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(itemName)

  const handleSaveName = () => {
    if (name && name !== itemName) renameCost(category, itemName, name)
    setIsEditing(false)
  }

  return (
    <TableRow>
      <TableCell className="font-medium text-sm">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input value={name} onChange={(e) => setName(e.target.value)} className="h-8 w-full" />
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 shrink-0"
              onClick={handleSaveName}
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="truncate">{itemName}</span>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 shrink-0 text-muted-foreground"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </TableCell>
      <TableCell>
        <Badge variant="secondary" className="text-[10px]">
          {itemData.type.toUpperCase()}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <Input
          type="number"
          value={itemData.price}
          onChange={(e) =>
            updateCost(category, isEditing ? name : itemName, { price: Number(e.target.value) })
          }
          className="h-8 text-right font-mono w-24 ml-auto"
        />
      </TableCell>
      <TableCell className="text-right w-[50px]">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-destructive"
          onClick={() => deleteCost(category, itemName)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default function Costs() {
  const { costs, updateCost, renameCost, deleteCost } = useAppStore()

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Custos</h1>
        <p className="text-muted-foreground">
          Edite nomes e valores base de todos os produtos do portfólio.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(costs).map(([category, items]) => (
          <Card key={category}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                {category.replace(/_/g, ' ')}
                <Badge variant="outline">{Object.keys(items).length} itens</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto / Variação</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="w-[120px] text-right">Base (R$)</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(items).map(([itemName, itemData]) => (
                    <CostRow
                      key={itemName}
                      category={category}
                      itemName={itemName}
                      itemData={itemData}
                      updateCost={updateCost}
                      renameCost={renameCost}
                      deleteCost={deleteCost}
                    />
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
