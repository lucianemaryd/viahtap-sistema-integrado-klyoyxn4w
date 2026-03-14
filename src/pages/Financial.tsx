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
import useAppStore from '@/stores/useAppStore'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { Badge } from '@/components/ui/badge'
import { ArrowDownRight, ArrowUpRight, DollarSign } from 'lucide-react'

export default function Financial() {
  const { quotes, clients } = useAppStore()

  const approvedQuotes = quotes.filter((q) => q.status === 'Aprovado')
  const totalReceivables = approvedQuotes.reduce((acc, q) => acc + q.total, 0)

  // Mock payables for cash flow demonstration
  const payables = [
    {
      id: '1',
      desc: 'Fornecedor Kapazi (Vinil)',
      value: 1250.0,
      date: new Date().toISOString(),
      status: 'Pendente',
    },
    {
      id: '2',
      desc: 'Energia Elétrica',
      value: 450.0,
      date: new Date().toISOString(),
      status: 'Pago',
    },
  ]
  const totalPayables = payables.reduce((acc, p) => acc + p.value, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financeiro & Fluxo</h1>
        <p className="text-muted-foreground">
          Visão consolidada das contas a receber (vendas) e pagar.
        </p>
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
            <p className="text-xs text-muted-foreground">Originado de Vendas Aprovadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Contas a Pagar</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalPayables)}</div>
            <p className="text-xs text-muted-foreground">Fornecedores e Custos</p>
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
          <TabsTrigger value="receber">Contas a Receber (Vendas)</TabsTrigger>
          <TabsTrigger value="pagar">Contas a Pagar</TabsTrigger>
        </TabsList>
        <TabsContent value="receber" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Lançamentos Futuros</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Origem</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Data da Venda</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvedQuotes.map((q) => {
                    const client = clients.find((c) => c.id === q.clientId)
                    return (
                      <TableRow key={q.id}>
                        <TableCell>
                          <Badge>Orc #{q.number}</Badge>
                        </TableCell>
                        <TableCell>{client?.name || 'Desconhecido'}</TableCell>
                        <TableCell>{formatDate(q.date)}</TableCell>
                        <TableCell className="text-right font-medium text-green-600">
                          {formatCurrency(q.total)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pagar" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Despesas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payables.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.desc}</TableCell>
                      <TableCell>{formatDate(p.date)}</TableCell>
                      <TableCell>
                        <Badge variant={p.status === 'Pago' ? 'default' : 'destructive'}>
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium text-red-600">
                        {formatCurrency(p.value)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
