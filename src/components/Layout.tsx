import { Link, Outlet, useLocation } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  LayoutDashboard,
  Users,
  FileText,
  ShoppingCart,
  Calculator,
  Wallet,
  Receipt,
  Settings,
  Search,
  Bell,
  Truck,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import useAppStore from '@/stores/useAppStore'

const menuItems = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { title: 'CRM', icon: Users, path: '/crm' },
  { title: 'Fornecedores', icon: Truck, path: '/suppliers' },
  { title: 'Orçamentos', icon: FileText, path: '/quotes' },
  { title: 'Vendas', icon: ShoppingCart, path: '/sales' },
  { title: 'Tabela de Custos', icon: Calculator, path: '/costs' },
  { title: 'Financeiro', icon: Wallet, path: '/financial' },
  { title: 'Notas Fiscais', icon: Receipt, path: '/invoices' },
  { title: 'Configurações', icon: Settings, path: '/settings' },
]

export default function Layout() {
  const location = useLocation()
  // Cast to any to avoid TS errors if settings is not fully typed in the store interface
  const { settings } = useAppStore() as any

  // Safely access logoUrl and name with a fallback mechanism
  const logoUrl = settings?.logoUrl ?? 'https://img.usecurling.com/i?q=logo&color=blue&shape=fill'
  const appName = settings?.name ? settings.name.split(' ')[0] : 'ViahTap'

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/30">
        <Sidebar className="no-print border-r">
          <SidebarHeader className="h-16 flex items-center justify-center border-b px-4">
            <img src={logoUrl} alt={appName} className="h-8 object-contain" />
            <span className="ml-2 font-bold text-primary truncate hidden md:block">{appName}</span>
          </SidebarHeader>
          <SidebarContent className="py-4">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      location.pathname === item.path ||
                      (item.path !== '/' && location.pathname.startsWith(item.path))
                    }
                    tooltip={item.title}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-16 flex items-center justify-between border-b bg-background px-4 lg:px-8 no-print shrink-0">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="hidden md:flex relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar no sistema..."
                  className="w-full bg-background pl-8 h-9"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=female&seed=2" />
                <AvatarFallback>LM</AvatarFallback>
              </Avatar>
            </div>
          </header>
          <div className="flex-1 overflow-auto p-4 lg:p-8 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
