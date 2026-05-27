import type { ProductSpec } from './types';
import { classifySymbol, getBaseQuote } from './symbol';

export type MarginResult = {
  amount: number;
  currency: string;
};

/**
 * Margin = openPrice × lots × contractUnit ÷ leverage
 * USD-base forex (USDJPY, USDCAD): omit openPrice → contract × lots ÷ leverage
 */
export function calcMarginRaw(params: {
  product: ProductSpec;
  openPrice: number;
  lots: number;
  leverage: number;
}): MarginResult | null {
  const { product, openPrice, lots, leverage } = params;
  if (!Number.isFinite(openPrice) || !Number.isFinite(lots) || lots <= 0 || leverage <= 0) {
    return null;
  }
  if (product.contractUnit <= 0) return null;

  const kind = classifySymbol(product.code);
  const bq = getBaseQuote(product.code);

  if (kind === 'usdBase' && bq) {
    const amount = (product.contractUnit * lots) / leverage;
    return { amount, currency: 'USD' };
  }

  if (kind === 'usdQuote' && bq) {
    const amount = (openPrice * product.contractUnit * lots) / leverage;
    return { amount, currency: 'USD' };
  }

  if (kind === 'metal' || kind === 'index') {
    const ccy = product.quoteCurrency || 'USD';
    const amount = (openPrice * product.contractUnit * lots) / leverage;
    return { amount, currency: ccy };
  }

  if (bq) {
    const amount = (openPrice * product.contractUnit * lots) / leverage;
    return { amount, currency: bq.quote };
  }

  const ccy = product.quoteCurrency || 'USD';
  const amount = (openPrice * product.contractUnit * lots) / leverage;
  return { amount, currency: ccy };
}
