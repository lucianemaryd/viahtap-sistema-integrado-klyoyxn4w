import { useState } from 'react'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Receipt, Download, FileCheck2 } from 'lucide-react'
import useAppStore, { Quote } from '@/stores/useAppStore'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

export default function Invoices() {
  const { quotes, clients } = useAppStore()
  const { toast } = useToast()
  const approvedQuotes = quotes.filter((q) => q.status === 'Aprovado')
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)

  const handleEmit = () => {
    toast({
      title: 'Integração em andamento',
      description: 'Dados fiscais enviados para SEFAZ via API.',
    })
    setSelectedQuote(null)
  }

  const clientInfo = selectedQuote ? clients.find((c) => c.id === selectedQuote.clientId) : null

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
            <Receipt className="h-5 w-5 text-blue-500" /> Status do Certificado A1
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <div className="text-sm">
            <p className="font-semibold text-green-600">Certificado Vinculado e Ativo</p>
            <p className="text-muted-foreground">Válido até 12/2026</p>
          </div>
          <Button variant="outline" size="sm">
            Renovar
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
                <TableHead>Cliente / Documento</TableHead>
                <TableHead>Data Venda</TableHead>
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
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => setSelectedQuote(q)}
                      >
                        <Download className="w-4 h-4 mr-2" /> Resumo NF-e
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

      <Dialog open={!!selectedQuote} onOpenChange={(open) => !open && setSelectedQuote(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-primary" /> Resumo para Emissão - NF-e
            </DialogTitle>
          </DialogHeader>
          {selectedQuote && clientInfo && (
            <div className="space-y-6 pt-4 text-sm">
              <div className="grid grid-cols-2 gap-4 border p-4 rounded bg-muted/30">
                <div>
                  <h4 className="font-bold text-xs uppercase text-muted-foreground mb-2">
                    Dados do Destinatário
                  </h4>
                  <p>
                    <strong>Nome:</strong> {clientInfo.name}
                  </p>
                  <p>
                    <strong>CNPJ/CPF:</strong> {clientInfo.doc}
                  </p>
                  <p>
                    <strong>IE:</strong> {clientInfo.ie || 'ISENTO'} | <strong>IM:</strong>{' '}
                    {clientInfo.im || 'Não Informado'}
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase text-muted-foreground mb-2">
                    Endereço
                  </h4>
                  <p>{clientInfo.address}</p>
                  <p>{clientInfo.bairro && `Bairro: ${clientInfo.bairro}`}</p>
                  <p>{clientInfo.cep && `CEP: ${clientInfo.cep}`}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase text-muted-foreground mb-2">
                  Itens da Nota (Produtos / NCM)
                </h4>
                <div className="border rounded overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted">
                      <TableRow>
                        <TableHead className="py-2 h-8 text-xs">Descrição Produto</TableHead>
                        <TableHead className="py-2 h-8 text-xs">NCM</TableHead>
                        <TableHead className="py-2 h-8 text-xs">Qtd</TableHead>
                        <TableHead className="py-2 h-8 text-xs text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedQuote.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="py-2 font-medium text-xs">
                            {item.description}
                          </TableCell>
                          <TableCell className="py-2 text-xs">{item.ncm || '0000.00.00'}</TableCell>
                          <TableCell className="py-2 text-xs">
                            {item.quantity} {item.unit}
                          </TableCell>
                          <TableCell className="py-2 text-right text-xs">
                            {formatCurrency(item.salePrice)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50 font-bold">
                        <TableCell colSpan={3} className="py-2 text-right">
                          Valor Total da Nota (Incluso Frete:{' '}
                          {formatCurrency(selectedQuote.freight)})
                        </TableCell>
                        <TableCell className="py-2 text-right text-primary">
                          {formatCurrency(selectedQuote.total)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedQuote(null)}>
                  Cancelar
                </Button>
                <Button onClick={handleEmit} className="bg-green-600 hover:bg-green-700">
                  Confirmar e Transmitir NF-e
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
