import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import useAppStore from '@/stores/useAppStore'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { Badge } from '@/components/ui/badge'
import { ArrowDownRight, ArrowUpRight, DollarSign, Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Financial() {
  const store = useAppStore() as any
  const quotes = store?.quotes || []
  const clients = store?.clients || store?.customers || []
  const transactions = store?.transactions || []
  const addTransaction = store?.addTransaction || (() => {})

  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ desc: '', value: 0, type: 'EXPENSE' as 'INCOME' | 'EXPENSE' })

  const approvedQuotes = quotes.filter(
    (q: any) => q.status === 'Aprovado' || q.status === 'approved',
  )
  const quotesReceivables = approvedQuotes.reduce((acc: number, q: any) => acc + (q.total || 0), 0)

  const manualReceivables = (transactions || [])
    .filter((t: any) => t.type === 'INCOME')
    .reduce((acc: number, t: any) => acc + (t.value || 0), 0)
  const totalReceivables = quotesReceivables + manualReceivables

  const payablesList = (transactions || []).filter((t: any) => t.type === 'EXPENSE')
  const totalPayables = payablesList.reduce((acc: number, p: any) => acc + (p.value || 0), 0)

  const handleAddManual = () => {
    if (!form.desc || form.value <= 0)
      return toast({ variant: 'destructive', title: 'Preencha descrição e valor.' })
    addTransaction({
      id: Math.random().toString(),
      desc: form.desc,
      value: form.value,
      type: form.type,
      date: new Date().toISOString(),
      status: 'Pendente',
    })
    setOpen(false)
    setForm({ desc: '', value: 0, type: 'EXPENSE' })
    toast({ title: 'Lançamento registrado com sucesso.' })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financeiro & Fluxo</h1>
          <p className="text-muted-foreground">
            Visão consolidada de contas a pagar, receber e lançamentos avulsos.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Lançamento Manual
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Lançamento Avulso</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Tipo de Lançamento</Label>
                <Select
                  value={form.type}
                  onValueChange={(v: 'INCOME' | 'EXPENSE') => setForm({ ...form, type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXPENSE">
                      Despesa (Impostos, Fretes, Brindes, etc)
                    </SelectItem>
                    <SelectItem value="INCOME">Receita (Venda Avulsa, Reembolsos)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Input
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Valor (R$)</Label>
                <Input
                  type="number"
                  value={form.value || ''}
                  onChange={(e) => setForm({ ...form, value: +e.target.value })}
                />
              </div>
              <Button onClick={handleAddManual} className="w-full">
                Registrar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Contas a Receber</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalReceivables)}
            </div>
            <p className="text-xs text-muted-foreground">Vendas Aprovadas + Avulsos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Contas a Pagar</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalPayables)}</div>
            <p className="text-xs text-muted-foreground">Fornecedores e Custos Avulsos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Saldo Projetado</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalReceivables - totalPayables)}
            </div>
            <p className="text-xs text-muted-foreground">Fluxo de Caixa Líquido</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="receber">
        <TabsList>
          <TabsTrigger value="receber">Contas a Receber</TabsTrigger>
          <TabsTrigger value="pagar">Contas a Pagar</TabsTrigger>
        </TabsList>
        <TabsContent value="receber" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Lançamentos de Receita</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Origem / Descrição</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvedQuotes.map((q: any) => {
                    const client = clients.find((c: any) => c.id === (q.clientId || q.customerId))
                    return (
                      <TableRow key={q.id}>
                        <TableCell>
                          <Badge>Venda #{q.number || q.id.substring(0, 6)}</Badge>
                        </TableCell>
                        <TableCell>{client?.name || 'Desconhecido'}</TableCell>
                        <TableCell>{formatDate(q.date)}</TableCell>
                        <TableCell className="text-right font-medium text-green-600">
                          {formatCurrency(q.total || 0)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {(transactions || [])
                    .filter((t: any) => t.type === 'INCOME')
                    .map((t: any) => (
                      <TableRow key={t.id}>
                        <TableCell>
                          <Badge variant="outline">Manual</Badge> {t.desc}
                        </TableCell>
                        <TableCell className="text-muted-foreground">-</TableCell>
                        <TableCell>{formatDate(t.date)}</TableCell>
                        <TableCell className="text-right font-medium text-green-600">
                          {formatCurrency(t.value || 0)}
                        </TableCell>
                      </TableRow>
                    ))}
                  {approvedQuotes.length === 0 &&
                    (transactions || []).filter((t: any) => t.type === 'INCOME').length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                          Nenhuma conta a receber encontrada.
                        </TableCell>
                      </TableRow>
                    )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pagar" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Despesas e Custos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Data Registro</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payablesList.map((p: any) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.desc}</TableCell>
                      <TableCell>{formatDate(p.date)}</TableCell>
                      <TableCell>
                        <Badge variant={p.status === 'Pago' ? 'default' : 'secondary'}>
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium text-red-600">
                        {formatCurrency(p.value || 0)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {payablesList.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                        Nenhuma conta a pagar encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
