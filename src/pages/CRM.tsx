import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Users, Plus, Phone, Search } from 'lucide-react'
import useAppStore, { Client } from '@/stores/useAppStore'
import { useToast } from '@/hooks/use-toast'

export default function CRM() {
  const { clients, addClient } = useAppStore()
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    doc: '',
    ie: '',
    contactName: '',
    phone: '',
    address: '',
  })

  const filtered = clients.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))

  const handleSave = () => {
    if (!form.name || !form.doc)
      return toast({ variant: 'destructive', title: 'Preencha os campos obrigatórios' })
    addClient({ id: Math.random().toString(), ...form })
    setOpen(false)
    setForm({ name: '', doc: '', ie: '', contactName: '', phone: '', address: '' })
    toast({ title: 'Cliente adicionado com sucesso!' })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CRM & Leads</h1>
          <p className="text-muted-foreground">Gerencie seus clientes e condomínios.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Cliente</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Nome / Razão Social *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CPF / CNPJ *</Label>
                  <Input
                    value={form.doc}
                    onChange={(e) => setForm({ ...form, doc: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Inscrição Estadual (IE)</Label>
                  <Input
                    value={form.ie}
                    onChange={(e) => setForm({ ...form, ie: e.target.value })}
                  />
                </div>
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
                <Label>Endereço Completo</Label>
                <Input
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>
              <Button onClick={handleSave} className="w-full">
                Salvar Cliente
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="py-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cliente..."
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
                <TableHead>Cliente</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Endereço</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" /> {client.name}
                  </TableCell>
                  <TableCell>{client.doc}</TableCell>
                  <TableCell>{client.contactName}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      <Phone className="w-3 h-3" /> {client.phone}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground truncate max-w-[200px]">
                    {client.address}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Nenhum cliente encontrado.
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
