import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Costs from './pages/Costs'
import QuotesList from './pages/Quotes/index'
import QuoteBuilder from './pages/Quotes/Builder'
import Sales from './pages/Sales'
import Financial from './pages/Financial'
import CRM from './pages/CRM'
import Suppliers from './pages/Suppliers'
import Invoices from './pages/Invoices'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="crm" element={<CRM />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="quotes" element={<QuotesList />} />
          <Route path="quotes/new" element={<QuoteBuilder />} />
          <Route path="sales" element={<Sales />} />
          <Route path="costs" element={<Costs />} />
          <Route path="financial" element={<Financial />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}
