import type { OrderSide, ProductSpec } from './types';
import { classifySymbol, getBaseQuote } from './symbol';

export type PnlResult = {
  amount: number;
  currency: string;
};

/**
 * Buy: (close - open) × contract × lots
 * Sell: (open - close) × contract × lots
 */
export function calcPnlRaw(params: {
  product: ProductSpec;
  side: OrderSide;
  openPrice: number;
  closePrice: number;
  lots: number;
}): PnlResult | null {
  const { product, side, openPrice, closePrice, lots } = params;
  if (
    !Number.isFinite(openPrice) ||
    !Number.isFinite(closePrice) ||
    !Number.isFinite(lots) ||
    lots <= 0
  ) {
    return null;
  }

  const diff = side === 'buy' ? closePrice - openPrice : openPrice - closePrice;
  const amount = diff * product.contractUnit * lots;

  const kind = classifySymbol(product.code);
  const bq = getBaseQuote(product.code);

  if (kind === 'usdQuote' && bq) return { amount, currency: 'USD' };
  if (kind === 'usdBase' && bq) return { amount, currency: bq.quote };
  if (kind === 'metal' || kind === 'index') {
    return { amount, currency: product.quoteCurrency || 'USD' };
  }
  if (bq) return { amount, currency: bq.quote };
  return { amount, currency: product.quoteCurrency || 'USD' };
}
