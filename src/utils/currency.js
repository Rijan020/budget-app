export const currencies = {
  NPR: { symbol: 'Rs', rate: 1 },
  USD: { symbol: '$', rate: 132 },
  EUR: { symbol: '€', rate: 140 },
  GBP: { symbol: '£', rate: 160 },
  AUD: { symbol: 'A$', rate: 90 },
};

export function formatAmount(amount, currency = 'NPR') {
  const curr = currencies[currency] || currencies.NPR;
  return `${curr.symbol} ${amount.toFixed(2)}`;
}

export function convertAmount(amount, from = 'NPR', to = 'NPR') {
  if (from === to) return amount;
  if (!currencies[from] || !currencies[to]) return amount;
  const nprAmount = amount / currencies[from].rate;
  return nprAmount * currencies[to].rate;
}
