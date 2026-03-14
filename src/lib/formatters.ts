export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date: Date | string): string {
  if (!date) return ''
  const d = new Date(date)
  return new Intl.DateTimeFormat('pt-BR').format(d)
}

export function formatArea(width: number, height: number): string {
  return ((width * height) / 10000).toFixed(2) // Assuming input in cm, output in m2
}
