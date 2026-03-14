import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, TrendingUp, DollarSign, CreditCard } from 'lucide-react'
import useAppStore from '@/stores/useAppStore'
import { formatCurrency, formatDate } from '@/lib/formatters'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Cell } from 'recharts'

const barData = [
  { month: 'Out', vendas: 45000, custos: 22000 },
  { month: 'Nov', vendas: 52000, custos: 26000 },
  { month: 'Dez', vendas: 48000, custos: 24000 },
  { month: 'Jan', vendas: 61000, custos: 29000 },
  { month: 'Fev', vendas: 59000, custos: 28000 },
  { month: 'Mar', vendas: 68000, custos: 31000 },
]

const pieData = [
  { name: 'Vinil Gold', value: 45, fill: 'var(--color-vinil)' },
  { name: 'Cleankap', value: 35, fill: 'var(--color-cleankap)' },
  { name: 'Alto Tráfego', value: 20, fill: 'var(--color-alto)' },
]

export default function Dashboard() {
  const { quotes } = useAppStore()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do negócio ViahTap.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orçamentos Pendentes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {quotes.filter((q) => q.status === 'Enviado').length}
            </div>
            <p className="text-xs text-muted-foreground">+2 desde ontem</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas (Mês)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 68.000,00</div>
            <p className="text-xs text-muted-foreground">+15% vs mês anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fluxo de Caixa</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 142.350,00</div>
            <p className="text-xs text-muted-foreground">Saldo atual</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contas a Pagar (Hoje)</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 3.450,00</div>
            <p className="text-xs text-muted-foreground">4 boletos vencendo</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Vendas vs Custos (6 Meses)</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer
              config={{
                vendas: { label: 'Vendas', color: 'hsl(var(--primary))' },
                custos: { label: 'Custos', color: 'hsl(var(--destructive))' },
              }}
              className="h-[300px] w-full"
            >
              <BarChart data={barData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="vendas" fill="var(--color-vendas)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="custos" fill="var(--color-custos)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Distribuição de Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                vinil: { label: 'Vinil Gold', color: 'hsl(var(--chart-1))' },
                cleankap: { label: 'Cleankap', color: 'hsl(var(--chart-2))' },
                alto: { label: 'Alto Tráfego', color: 'hsl(var(--chart-3))' },
              }}
              className="h-[300px] w-full"
            >
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Últimos Orçamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quotes.slice(0, 5).map((quote) => (
              <div
                key={quote.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-medium">
                    #{quote.number} - {quote.clientName}
                  </span>
                  <span className="text-sm text-muted-foreground">{formatDate(quote.date)}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{formatCurrency(quote.total)}</span>
                  <Badge
                    variant={
                      quote.status === 'Aprovado'
                        ? 'default'
                        : quote.status === 'Rejeitado'
                          ? 'destructive'
                          : 'secondary'
                    }
                  >
                    {quote.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
