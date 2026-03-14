import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Receipt, Download } from 'lucide-react'
import useAppStore from '@/stores/useAppStore'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { Badge } from '@/components/ui/badge'

export default function Invoices() {
  const { quotes, clients } = useAppStore()
  const approvedQuotes = quotes.filter((q) => q.status === 'Aprovado')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notas Fiscais (NF-e)</h1>
        <p className="text-muted-foreground">
          Faturamento das vendas aprovadas e integração SEFAZ.
        </p>
      </div>

      <Card className="bg-muted/50 border-dashed">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Receipt className="h-5 w-5 text-blue-500" /> Status do Certificado
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <div className="text-sm">
            <p className="font-semibold text-green-600">Certificado A1 Vinculado</p>
            <p className="text-muted-foreground">Válido até 12/2026</p>
          </div>
          <Button variant="outline" size="sm">
            Renovar Certificado
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Aguardando Emissão</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Venda Ref.</TableHead>
                <TableHead>Cliente / CNPJ</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvedQuotes.map((q) => {
                const client = clients.find((c) => c.id === q.clientId)
                return (
                  <TableRow key={q.id}>
                    <TableCell>
                      <Badge variant="outline">#{q.number}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{client?.name}</div>
                      <div className="text-xs text-muted-foreground">{client?.doc}</div>
                    </TableCell>
                    <TableCell>{formatDate(q.date)}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(q.total)}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Download className="w-4 h-4 mr-2" /> Emitir NF-e
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
              {approvedQuotes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Nenhuma venda pendente de emissão.
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
