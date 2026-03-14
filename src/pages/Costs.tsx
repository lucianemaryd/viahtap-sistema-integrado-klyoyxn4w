import { useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Edit2, Check, Trash2, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

function CostRow({ category, itemName, itemData, updateCost, renameCost, deleteCost }: any) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: itemName,
    price: itemData.price,
    ncm: itemData.ncm || '',
    ipi: itemData.ipi || 0,
  })
  const [deleteOpen, setDeleteOpen] = useState(false)

  const handleSave = () => {
    if (editData.name && editData.name !== itemName) renameCost(category, itemName, editData.name)
    const finalName = editData.name || itemName
    updateCost(category, finalName, {
      price: Number(editData.price),
      ncm: editData.ncm,
      ipi: Number(editData.ipi),
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData({
      name: itemName,
      price: itemData.price,
      ncm: itemData.ncm || '',
      ipi: itemData.ipi || 0,
    })
    setIsEditing(false)
  }

  return (
    <TableRow>
      <TableCell className="font-medium text-sm">
        {isEditing ? (
          <Input
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="h-8 min-w-[140px]"
            placeholder="Nome"
          />
        ) : (
          <span className="truncate">{itemName}</span>
        )}
      </TableCell>
      <TableCell>
        <Badge variant="secondary" className="text-[10px]">
          {itemData.type.toUpperCase()}
        </Badge>
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            value={editData.ncm}
            onChange={(e) => setEditData({ ...editData, ncm: e.target.value })}
            className="h-8 w-20"
            placeholder="NCM"
          />
        ) : (
          <span className="text-xs text-muted-foreground">{itemData.ncm || '-'}</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        {isEditing ? (
          <Input
            type="number"
            value={editData.ipi}
            onChange={(e) => setEditData({ ...editData, ipi: +e.target.value })}
            className="h-8 w-16 ml-auto text-right"
            placeholder="IPI%"
          />
        ) : (
          <span className="text-xs text-muted-foreground">
            {itemData.ipi ? `${itemData.ipi}%` : '-'}
          </span>
        )}
      </TableCell>
      <TableCell className="text-right">
        {isEditing ? (
          <Input
            type="number"
            value={editData.price}
            onChange={(e) => setEditData({ ...editData, price: +e.target.value })}
            className="h-8 text-right font-mono w-24 ml-auto"
          />
        ) : (
          <span className="font-mono text-sm">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
              itemData.price,
            )}
          </span>
        )}
      </TableCell>
      <TableCell className="text-right w-[90px]">
        {isEditing ? (
          <div className="flex justify-end gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-green-600"
              onClick={handleSave}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-destructive"
              onClick={handleCancel}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex justify-end gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Excluir Produto?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Tem certeza que deseja excluir <strong>{itemName}</strong>?
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  deleteCost(category, itemName)
                  setDeleteOpen(false)
                }}
              >
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
          Edite nomes, NCM, IPI e valores base de todos os produtos do portfólio.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {Object.entries(costs).map(([category, items]) => (
          <Card key={category} className="overflow-hidden">
            <CardHeader className="pb-2 bg-muted/30">
              <CardTitle className="text-lg flex items-center justify-between">
                {category.replace(/_/g, ' ')}
                <Badge variant="outline">{Object.keys(items).length} itens</Badge>
              </CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto / Variação</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>NCM</TableHead>
                    <TableHead className="text-right">IPI (%)</TableHead>
                    <TableHead className="w-[110px] text-right">Base (R$)</TableHead>
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
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
