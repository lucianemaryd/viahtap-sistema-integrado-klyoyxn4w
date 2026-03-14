import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, FileText, CheckCircle } from 'lucide-react'
import useAppStore from '@/stores/useAppStore'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { useToast } from '@/hooks/use-toast'

export default function QuotesList() {
  const { quotes, clients, updateQuoteStatus } = useAppStore()
  const { toast } = useToast()
  const [search, setSearch] = useState('')

  const getClientName = (id: string) => clients.find((c) => c.id === id)?.name || 'Desconhecido'

  const filteredQuotes = quotes.filter(
    (q) =>
      getClientName(q.clientId).toLowerCase().includes(search.toLowerCase()) ||
      q.number.toString().includes(search),
  )

  const handleApprove = (id: string) => {
    updateQuoteStatus(id, 'Aprovado')
    toast({ title: 'Orçamento Aprovado!', description: 'Enviado para Vendas e Financeiro.' })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orçamentos</h1>
          <p className="text-muted-foreground">Gerencie propostas e gere PDFs.</p>
        </div>
        <Button asChild>
          <Link to="/quotes/new">
            <Plus className="mr-2 h-4 w-4" /> Novo Orçamento
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente ou nº..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhum orçamento encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredQuotes.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell className="font-medium">#{quote.number}</TableCell>
                    <TableCell>{formatDate(quote.date)}</TableCell>
                    <TableCell>{getClientName(quote.clientId)}</TableCell>
                    <TableCell className="font-medium text-primary">
                      {formatCurrency(quote.total)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          quote.status === 'Aprovado'
                            ? 'default'
                            : quote.status === 'Rascunho'
                              ? 'outline'
                              : 'secondary'
                        }
                      >
                        {quote.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {quote.status !== 'Aprovado' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApprove(quote.id)}
                          title="Aprovar Venda"
                        >
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                      )}
                      <Button variant="secondary" size="sm" asChild title="Ver PDF">
                        <Link to={`/quotes/new`} state={{ quoteId: quote.id }}>
                          <FileText className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
