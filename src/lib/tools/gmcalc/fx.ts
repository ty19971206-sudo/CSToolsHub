import type { FxOp } from './fxRequirement';

const CCY_ALIASES: Record<string, string> = {
  美元: 'USD',
  欧元: 'EUR',
  英镑: 'GBP',
  日元: 'JPY',
  瑞郎: 'CHF',
  加元: 'CAD',
  澳元: 'AUD',
  纽元: 'NZD',
  港元: 'HKD',
  人民币: 'CNH',
  CNH: 'CNH',
  CNY: 'CNH',
};

export function normalizeCurrency(ccy: string): string {
  const s = ccy.trim().toUpperCase();
  return CCY_ALIASES[ccy] || CCY_ALIASES[s] || s;
}

/**
 * Convert amount to USD using spec pair rate.
 * USDJPY rate → divide; NZDUSD rate → multiply.
 */
export function convertWithPairRate(
  amount: number,
  fromCurrency: string,
  pair: string,
  op: FxOp,
  rate: number
): { value: number | null; missing: boolean } {
  const from = normalizeCurrency(fromCurrency);
  if (from === 'USD') return { value: amount, missing: false };
  if (!Number.isFinite(rate) || rate <= 0) return { value: null, missing: true };

  const base = pair.slice(0, 3).toUpperCase();
  const quote = pair.slice(3, 6).toUpperCase();

  if (from === quote && base === 'USD' && op === 'divide') {
    return { value: amount / rate, missing: false };
  }
  if (from === base && quote === 'USD' && op === 'multiply') {
    return { value: amount * rate, missing: false };
  }
  if (op === 'divide') return { value: amount / rate, missing: false };
  return { value: amount * rate, missing: false };
}
