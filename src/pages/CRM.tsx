import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Phone, Mail } from 'lucide-react'

export default function CRM() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">CRM & Leads</h1>
        <p className="text-muted-foreground">Gerencie seus contatos e prospecções.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Condomínio Exemplo {i}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 text-sm mt-2">
                <span className="flex items-center gap-2">
                  <Phone className="h-3 w-3" /> (19) 99999-000{i}
                </span>
                <span className="flex items-center gap-2">
                  <Mail className="h-3 w-3" /> contato{i}@exemplo.com
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
