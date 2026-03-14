import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import useAppStore from '@/stores/useAppStore'
import { formatCurrency, formatDate } from '@/lib/formatters'

export default function Sales() {
  const { quotes, clients } = useAppStore()
  const sales = quotes.filter((q) => q.status === 'Aprovado')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vendas Realizadas</h1>
        <p className="text-muted-foreground">Painel operacional de produção e faturamento.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Produção</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Orçamento</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data Aprovação</TableHead>
                <TableHead>Valor Base</TableHead>
                <TableHead>Status Operacional</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => {
                const client = clients.find((c) => c.id === sale.clientId)
                return (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">#{sale.number}</TableCell>
                    <TableCell>{client?.name || 'Cliente Removido'}</TableCell>
                    <TableCell>{formatDate(sale.date)}</TableCell>
                    <TableCell>{formatCurrency(sale.total)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-blue-500 text-blue-500 bg-blue-50">
                        Aguardando Layout
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
              {sales.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    Nenhuma venda registrada ainda. Aprove orçamentos para visualizar aqui.
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
