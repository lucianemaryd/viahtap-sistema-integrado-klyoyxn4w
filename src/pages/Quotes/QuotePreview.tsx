import { Quote } from '@/stores/useAppStore'
import { formatCurrency, formatDate } from '@/lib/formatters'
import useAppStore from '@/stores/useAppStore'

export default function QuotePreview({ quote }: { quote: Quote }) {
  const { clients, settings } = useAppStore()

  const client = clients.find((c) => c.id === quote.clientId) || {
    name: 'NOME DO CLIENTE',
    doc: 'CPF/CNPJ',
    address: 'ENDEREÇO',
    phone: '',
  }

  const totalItems = quote.items.reduce((acc, item) => acc + item.salePrice, 0)
  const totalQtd = quote.items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <div className="max-w-[800px] mx-auto bg-white p-8 border shadow-sm text-sm text-black relative">
      <div className="flex justify-between items-start mb-8 border-b pb-4">
        <div className="flex items-center gap-4">
          <img src={settings.logoUrl} alt="Logo" className="h-16 object-contain" />
          <div>
            <div className="text-primary font-bold text-2xl">{settings.name}</div>
          </div>
        </div>
        <div className="text-right text-xs space-y-1">
          <p className="font-bold">{settings.name.toUpperCase()}</p>
          <p>{settings.address}</p>
          <p>Telefone: {settings.phone}</p>
          <p>CNPJ: {settings.cnpj}</p>
        </div>
      </div>

      <h2 className="text-center text-xl font-bold mb-6">Proposta Nº {quote.number}</h2>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 border border-black p-2">
          <p className="font-bold mb-1">Para: {client.name}</p>
          <p>CPF/CNPJ: {client.doc}</p>
          <p>{client.address}</p>
          {client.phone && <p>Tel: {client.phone}</p>}
        </div>
        <div className="w-64 border border-black">
          <div className="flex border-b border-black h-1/2">
            <div className="w-1/2 border-r border-black p-2 flex items-center font-bold">
              Nº Proposta
            </div>
            <div className="w-1/2 p-2 flex items-center">{quote.number}</div>
          </div>
          <div className="flex h-1/2">
            <div className="w-1/2 border-r border-black p-2 flex items-center font-bold">Data</div>
            <div className="w-1/2 p-2 flex items-center">{formatDate(quote.date)}</div>
          </div>
        </div>
      </div>

      <p className="mb-4">
        Vendedor(a): <span className="font-bold uppercase">{quote.seller}</span>
      </p>

      <div className="mb-6">
        <p className="font-bold mb-2 border-b-2 border-black inline-block">
          Itens da proposta comercial
        </p>
        <table className="w-full border-collapse border border-black text-xs text-center">
          <thead>
            <tr className="border-b border-black font-bold bg-gray-50">
              <td className="p-1 w-8 border-r border-black">Item</td>
              <td className="p-1 border-r border-black text-left">Descrição</td>
              <td className="p-1 border-r border-black">Un</td>
              <td className="p-1 border-r border-black">Qtd.</td>
              <td className="p-1 border-r border-black">Preço un.</td>
              <td className="p-1">Preço total</td>
            </tr>
          </thead>
          <tbody>
            {quote.items.map((item, idx) => (
              <tr key={idx} className="border-b border-black">
                <td className="p-1 border-r border-black">{idx + 1}</td>
                <td className="p-1 border-r border-black text-left font-medium">
                  {item.description}
                </td>
                <td className="p-1 border-r border-black">UN</td>
                <td className="p-1 border-r border-black">{item.quantity.toFixed(2)}</td>
                <td className="p-1 border-r border-black">
                  {formatCurrency(item.salePrice / item.quantity)}
                </td>
                <td className="p-1 font-bold">{formatCurrency(item.salePrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <table className="w-full border-collapse border border-black text-xs text-center mt-4">
          <thead>
            <tr className="border-b border-black font-bold bg-gray-50">
              <td className="p-1 border-r border-black">Total de Itens</td>
              <td className="p-1 border-r border-black">Soma das Qtdes</td>
              <td className="p-1 border-r border-black">Total Produtos</td>
              <td className="p-1 border-r border-black">Frete</td>
              <td className="p-1 bg-gray-200">Total da Proposta</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-1 border-r border-black">{quote.items.length}</td>
              <td className="p-1 border-r border-black">{totalQtd}</td>
              <td className="p-1 border-r border-black font-bold">{formatCurrency(totalItems)}</td>
              <td className="p-1 border-r border-black">{formatCurrency(quote.freight)}</td>
              <td className="p-1 font-bold bg-gray-200 text-sm">{formatCurrency(quote.total)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-6 w-1/2">
        <p className="font-bold mb-2">Condições gerais</p>
        <div className="border border-black">
          <div className="flex border-b border-black p-2">
            <div className="w-1/2 font-bold">Prazo de entrega</div>
            <div className="w-1/2">{quote.deliveryTime}</div>
          </div>
          <div className="flex p-2">
            <div className="w-1/2 font-bold">Validade</div>
            <div className="w-1/2">{quote.validityDays} dia(s)</div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <p className="font-bold mb-2">Observações e Condições de Pagamento</p>
        <div className="border border-black p-2 text-xs min-h-[80px] whitespace-pre-line">
          {quote.observations}
          <br />
          <br />
          <span className="font-bold">Pagamento: </span>
          {quote.paymentTerms}
        </div>
      </div>

      {(quote.photos.length > 0 || quote.layouts.length > 0) && (
        <div className="mb-6 page-break-inside-avoid">
          <p className="font-bold mb-2 border-b border-black">Anexos & Referências Visuais</p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {quote.photos.map((p, i) => (
              <div key={`p-${i}`} className="border p-2 bg-gray-50">
                <p className="text-xs font-bold mb-1 text-center">Foto Local {i + 1}</p>
                <img src={p} className="w-full h-auto object-cover rounded" />
              </div>
            ))}
            {quote.layouts.map((l, i) => (
              <div key={`l-${i}`} className="border p-2 bg-gray-50">
                <p className="text-xs font-bold mb-1 text-center">Layout Referência {i + 1}</p>
                <img src={l} className="w-full h-auto object-cover rounded" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 text-sm text-center">
        <p>Atenciosamente,</p>
        <p className="font-bold mt-2">{quote.seller}</p>
        <p className="text-xs">Departamento de Vendas</p>
      </div>

      <div className="mt-8 text-center no-print border-t pt-6">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`Olá, segue a proposta nº ${quote.number} da ViahTap. Valor total: ${formatCurrency(quote.total)}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 bg-green-600 text-white hover:bg-green-700"
        >
          Enviar via WhatsApp
        </a>
      </div>
    </div>
  )
}
