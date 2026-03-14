import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Financial() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
        <p className="text-muted-foreground">Contas a Pagar, Receber e Fluxo de Caixa.</p>
      </div>

      <Tabs defaultValue="receber">
        <TabsList>
          <TabsTrigger value="receber">Contas a Receber</TabsTrigger>
          <TabsTrigger value="pagar">Contas a Pagar</TabsTrigger>
          <TabsTrigger value="fluxo">Fluxo de Caixa</TabsTrigger>
        </TabsList>
        <TabsContent value="receber" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Próximos Recebimentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Módulo em construção. Dados de demonstração virão do faturamento.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pagar" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Despesas e Custos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Módulo em construção.</div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="fluxo" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Projeção</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Gráficos de projeção financeira.</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
