import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Receipt } from 'lucide-react'

export default function Invoices() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notas Fiscais</h1>
        <p className="text-muted-foreground">Emissão e controle de NF-e e NFS-e.</p>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" /> Integração Sefaz
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            O sistema está pronto para emitir notas fiscais das vendas aprovadas. É necessário
            configurar o certificado digital.
          </p>
          <Button variant="outline" className="w-full">
            Configurar Certificado A1
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
