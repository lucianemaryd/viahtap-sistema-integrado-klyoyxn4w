import { Quote } from '@/stores/useAppStore'
import { formatCurrency, formatDate } from '@/lib/formatters'
import modeloImg from '../../assets/modelo-orcamento-249c9.png'

export default function QuotePreview({ quote }: { quote: Quote }) {
  const totalItems = quote.items.reduce((acc, item) => acc + item.salePrice, 0)
  const totalQtd = quote.items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <div className="max-w-[800px] mx-auto bg-white p-8 border shadow-sm text-sm text-black relative">
      <div className="flex justify-between items-start mb-8 border-b pb-4">
        <div>
          {/* Emulating the logo and brand from the image */}
          <div className="text-red-500 font-serif italic text-3xl font-bold">ViahTap</div>
          <div className="text-xs text-muted-foreground">PERSONALIZADOS</div>
        </div>
        <div className="text-right text-xs space-y-1">
          <p className="font-bold">VIAHTAP TAPETES PERSONALIZADOS LTDA</p>
          <p>Rua Rubens Trefiglio, 54</p>
          <p>13088-037 - Campinas, SP</p>
          <p>Telefone: (19) 98428-3777</p>
          <p>CNPJ: 39.529.932/0001-61</p>
          <p className="mt-2">Site: viahtap.com.br</p>
        </div>
      </div>

      <h2 className="text-center text-xl font-bold mb-6">Proposta Nº {quote.number}</h2>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 border border-black p-2">
          <p className="font-bold mb-1">Para</p>
          <p>{quote.clientName}</p>
          <p>CPF/CNPJ: {quote.clientDoc}</p>
          <p>{quote.clientAddress}</p>
        </div>
        <div className="w-64 border border-black">
          <div className="flex border-b border-black h-1/2">
            <div className="w-1/2 border-r border-black p-2 flex items-center font-bold">
              Número da Proposta
            </div>
            <div className="w-1/2 p-2 flex items-center">{quote.number}</div>
          </div>
          <div className="flex h-1/2">
            <div className="w-1/2 border-r border-black p-2 flex items-center font-bold">Data</div>
            <div className="w-1/2 p-2 flex items-center">{formatDate(quote.date)}</div>
          </div>
        </div>
      </div>

      <p className="mb-4">Vendedor(a): SISTEMA VIAHTAP</p>

      <div className="mb-6">
        <p className="font-bold mb-2 border-b-2 border-black inline-block">
          Itens da proposta comercial
        </p>
        <table className="w-full border-collapse border border-black text-xs text-center">
          <thead>
            <tr className="border-b border-black font-bold bg-gray-50">
              <td className="p-1 w-8 border-r border-black"></td>
              <td className="p-1 border-r border-black text-left">Descrição do produto/serviço</td>
              <td className="p-1 border-r border-black">Código</td>
              <td className="p-1 border-r border-black">Un</td>
              <td className="p-1 border-r border-black">Qtd.</td>
              <td className="p-1 border-r border-black">Preço lista.</td>
              <td className="p-1 border-r border-black">Desconto %</td>
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
                <td className="p-1 border-r border-black"></td>
                <td className="p-1 border-r border-black">UN</td>
                <td className="p-1 border-r border-black">{item.quantity.toFixed(2)}</td>
                <td className="p-1 border-r border-black">
                  {formatCurrency(item.salePrice / item.quantity)}
                </td>
                <td className="p-1 border-r border-black">0,00</td>
                <td className="p-1 border-r border-black">
                  {formatCurrency(item.salePrice / item.quantity)}
                </td>
                <td className="p-1">{formatCurrency(item.salePrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <table className="w-full border-collapse border border-black text-xs text-center mt-4">
          <thead>
            <tr className="border-b border-black font-bold bg-gray-50">
              <td className="p-1 border-r border-black">Nº de itens</td>
              <td className="p-1 border-r border-black">Soma das Qtdes</td>
              <td className="p-1 border-r border-black">Total outros itens</td>
              <td className="p-1 border-r border-black">Desconto total</td>
              <td className="p-1 border-r border-black">Total dos itens</td>
              <td className="p-1 border-r border-black">Frete</td>
              <td className="p-1">Total da proposta</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-1 border-r border-black">{quote.items.length.toFixed(2)}</td>
              <td className="p-1 border-r border-black">{totalQtd}</td>
              <td className="p-1 border-r border-black">0,00</td>
              <td className="p-1 border-r border-black">0,00</td>
              <td className="p-1 border-r border-black font-bold">{formatCurrency(totalItems)}</td>
              <td className="p-1 border-r border-black">{formatCurrency(quote.freight)}</td>
              <td className="p-1 font-bold">{formatCurrency(quote.total)}</td>
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

      <div>
        <p className="font-bold mb-2">Observações</p>
        <div className="border border-black p-2 text-xs h-24">
          <p>Obs.: A produção do layout será realizada após a aprovação do orçamento.</p>
          <br />
          <p>Condições de pagamento:</p>
          <p className="whitespace-pre-line">{quote.paymentTerms}</p>
        </div>
      </div>

      <div className="mt-8 text-xs">
        <p>Atenciosamente, Departamento de Vendas</p>
      </div>
    </div>
  )
}
