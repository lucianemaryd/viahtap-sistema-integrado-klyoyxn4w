import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Truck, Plus, Phone, Search, Edit2 } from 'lucide-react'
import useAppStore, { Supplier } from '@/stores/useAppStore'
import { useToast } from '@/hooks/use-toast'

const emptyForm: Supplier = {
  id: '',
  name: '',
  cnpj: '',
  contactName: '',
  phone: '',
  email: '',
}

export default function Suppliers() {
  const { suppliers, saveSupplier } = useAppStore()
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Supplier>(emptyForm)

  const filtered = suppliers.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))

  const handleOpenNew = () => {
    setForm({ ...emptyForm, id: Math.random().toString() })
    setOpen(true)
  }

  const handleOpenEdit = (supplier: Supplier) => {
    setForm(supplier)
    setOpen(true)
  }

  const handleSave = () => {
    if (!form.name || !form.cnpj)
      return toast({
        variant: 'destructive',
        title: 'Preencha os campos obrigatórios (Nome, CNPJ)',
      })
    saveSupplier(form)
    setOpen(false)
    toast({ title: 'Fornecedor salvo com sucesso!' })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fornecedores</h1>
          <p className="text-muted-foreground">
            Gerencie seus parceiros de negócio e distribuição.
          </p>
        </div>
        <Button onClick={handleOpenNew}>
          <Plus className="w-4 h-4 mr-2" /> Novo Fornecedor
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{form.name ? 'Editar Fornecedor' : 'Cadastrar Fornecedor'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Nome / Razão Social *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>CNPJ *</Label>
              <Input
                value={form.cnpj}
                onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome do Contato</Label>
                <Input
                  value={form.contactName}
                  onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Telefone / WhatsApp</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <Button onClick={handleSave} className="w-full mt-4">
              Salvar Fornecedor
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader className="py-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar fornecedor..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fornecedor</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Truck className="w-4 h-4 text-muted-foreground" /> {supplier.name}
                  </TableCell>
                  <TableCell>{supplier.cnpj}</TableCell>
                  <TableCell>{supplier.contactName}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      <Phone className="w-3 h-3" /> {supplier.phone}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(supplier)}>
                      <Edit2 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Nenhum fornecedor encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
