import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { COSTS } from '@/lib/constants'
import { formatCurrency } from '@/lib/formatters'
import tabelaImg from '../assets/tabela-atualizada-0303_page-0002-698f3.jpg'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Maximize2 } from 'lucide-react'

export default function Costs() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tabela de Custos</h1>
          <p className="text-muted-foreground">
            Gerencie os preços base para os cálculos de orçamento.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Maximize2 className="h-4 w-4" />
              Ver Tabela Original
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
            <img src={tabelaImg} alt="Tabela Original" className="w-full h-auto" />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tapetes de Vinil (R$)</CardTitle>
          <CardDescription>Preços por nível de personalização.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Categoria</TableHead>
                {Object.keys(COSTS.VINIL_GOLD).map((key) => (
                  <TableHead key={key} className="text-right">
                    {key}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium text-amber-600">GOLD</TableCell>
                {Object.values(COSTS.VINIL_GOLD).map((val, i) => (
                  <TableCell key={i} className="text-right">
                    {formatCurrency(val)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-red-600">ALTO TRÁFEGO</TableCell>
                {Object.values(COSTS.VINIL_ALTO_TRAFEGO).map((val, i) => (
                  <TableCell key={i} className="text-right">
                    {val > 0 ? formatCurrency(val) : 'NÃO TEM'}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cleankap (R$)</CardTitle>
            <CardDescription>
              Preço Mínimo: SEM BORDA R$ 614,00 | BORDA FLEX R$ 700,00
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(COSTS.CLEANKAP).map(([key, val]) => (
                  <TableRow key={key}>
                    <TableCell>{key}</TableCell>
                    <TableCell className="text-right">{formatCurrency(val)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Borda Flex 5cm (M²)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(COSTS.BORDA_FLEX).map(([key, val]) => (
                  <TableRow key={key}>
                    <TableCell>Borda {key}</TableCell>
                    <TableCell className="text-right">{formatCurrency(val)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
