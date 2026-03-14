import { useState } from 'react'
import { useAppStore, Product } from '@/stores/useAppStore'
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
import { formatCurrency } from '@/lib/formatters'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Edit, Trash2, Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Costs() {
  const { products, addProduct, updateProduct, deleteProduct } = useAppStore()
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const productData = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      basePrice: parseFloat(formData.get('basePrice') as string),
      unit: formData.get('unit') as 'm2' | 'ml' | 'unit',
      ncm: formData.get('ncm') as string,
      ipi: parseFloat(formData.get('ipi') as string) || 0,
      warranty: formData.get('warranty') as string,
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, productData)
      toast({ title: 'Produto atualizado' })
    } else {
      addProduct(productData)
      toast({ title: 'Produto adicionado' })
    }
    setIsDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Tabela de Custos</h1>
        <Button
          onClick={() => {
            setEditingProduct(null)
            setIsDialogOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Adicionar Produto
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>NCM</TableHead>
              <TableHead>IPI</TableHead>
              <TableHead>Garantia</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead className="text-right">Preço Base</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.ncm || '-'}</TableCell>
                <TableCell>{product.ipi !== undefined ? `${product.ipi}%` : '-'}</TableCell>
                <TableCell>{product.warranty || '-'}</TableCell>
                <TableCell className="uppercase">{product.unit}</TableCell>
                <TableCell className="text-right">{formatCurrency(product.basePrice)}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingProduct(product)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteProduct(product.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" name="name" defaultValue={editingProduct?.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  name="category"
                  defaultValue={editingProduct?.category}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="basePrice">Preço Base (R$)</Label>
                <Input
                  id="basePrice"
                  name="basePrice"
                  type="number"
                  step="0.01"
                  defaultValue={editingProduct?.basePrice}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unidade (m2, ml, unit)</Label>
                <Input id="unit" name="unit" defaultValue={editingProduct?.unit} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ncm">NCM</Label>
                <Input id="ncm" name="ncm" defaultValue={editingProduct?.ncm} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ipi">IPI (%)</Label>
                <Input
                  id="ipi"
                  name="ipi"
                  type="number"
                  step="0.1"
                  defaultValue={editingProduct?.ipi}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="warranty">Garantia</Label>
                <Input id="warranty" name="warranty" defaultValue={editingProduct?.warranty} />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
