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
  const { quotes } = useAppStore()
  const sales = quotes.filter((q) => q.status === 'Aprovado')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vendas Realizadas</h1>
        <p className="text-muted-foreground">Acompanhamento de orçamentos aprovados.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Orçamento</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data Aprovação</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status Produção</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>#{sale.number}</TableCell>
                  <TableCell>{sale.clientName}</TableCell>
                  <TableCell>{formatDate(sale.date)}</TableCell>
                  <TableCell>{formatCurrency(sale.total)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-blue-500 text-blue-500">
                      Em Produção
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {sales.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Nenhuma venda registrada.
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
