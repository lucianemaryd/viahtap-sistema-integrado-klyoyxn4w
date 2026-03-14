import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import useAppStore from '@/stores/useAppStore'
import { Save } from 'lucide-react'

export default function Settings() {
  const { settings, updateSettings } = useAppStore()
  const { toast } = useToast()
  const [form, setForm] = useState(settings)

  const handleSave = () => {
    updateSettings(form)
    toast({ title: 'Configurações atualizadas com sucesso!' })
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações da Empresa</h1>
        <p className="text-muted-foreground">
          Gerencie a identidade visual e dados que aparecem nos orçamentos.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados da Empresa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nome da Empresa</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>CNPJ</Label>
            <Input value={form.cnpj} onChange={(e) => setForm({ ...form, cnpj: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Endereço Completo</Label>
            <Input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Telefone</Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Vendedor(a) Padrão</Label>
            <Input
              value={form.defaultSeller}
              onChange={(e) => setForm({ ...form, defaultSeller: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>URL da Logomarca</Label>
            <div className="flex gap-4 items-center">
              <Input
                value={form.logoUrl}
                onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
              />
              <img
                src={form.logoUrl}
                alt="Logo Preview"
                className="h-10 object-contain border p-1 rounded bg-white"
              />
            </div>
          </div>
          <Button onClick={handleSave} className="mt-4">
            <Save className="w-4 h-4 mr-2" />
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
