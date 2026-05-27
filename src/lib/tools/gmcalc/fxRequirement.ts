import type { ProductSpec } from './types';
import { classifySymbol, getBaseQuote } from './symbol';
import { calcMarginRaw } from './margin';
import { calcPnlRaw } from './pnl';
import { normalizeCurrency } from './fx';
import type { OrderSide } from './types';

export type FxOp = 'divide' | 'multiply';

export type FxRequirement = {
  pair: string;
  op: FxOp;
  amountCurrency: string;
};

function specHasPair(codes: string[], pair: string): boolean {
  const target = pair.toUpperCase();
  return codes.some((code) => {
    const n = code.toUpperCase().replace(/\..*$/, '');
    return n === target;
  });
}

/**
 * Find spec pair to convert `amountCurrency` → USD.
 * USDJPY in spec → divide (JPY ÷ rate).
 * NZDUSD in spec → multiply (NZD × rate).
 */
export function resolveFxPair(amountCurrency: string, specCodes: string[]): FxRequirement | null {
  const ccy = normalizeCurrency(amountCurrency);
  if (ccy === 'USD') return null;

  const usdBase = `USD${ccy}`;
  const ccyUsd = `${ccy}USD`;

  if (specHasPair(specCodes, usdBase)) {
    return { pair: usdBase, op: 'divide', amountCurrency: ccy };
  }
  if (specHasPair(specCodes, ccyUsd)) {
    return { pair: ccyUsd, op: 'multiply', amountCurrency: ccy };
  }
  return null;
}

export function applyFxConversion(amount: number, op: FxOp, rate: number): number | null {
  if (!Number.isFinite(rate) || rate <= 0) return null;
  return op === 'divide' ? amount / rate : amount * rate;
}

/** Currencies that may need FX for this order (margin and/or P&L). */
export function getOrderFxRequirements(params: {
  product: ProductSpec;
  side: OrderSide;
  openPrice: number;
  closePrice: number | null;
  lots: number;
  leverage: number;
  specCodes: string[];
  calcMargin: boolean;
  calcPnl: boolean;
}): FxRequirement[] {
  const { product, side, openPrice, closePrice, lots, leverage, specCodes, calcMargin, calcPnl } =
    params;
  const needed = new Set<string>();
  const out: FxRequirement[] = [];
  const seen = new Set<string>();

  if (calcMargin) {
    const margin = calcMarginRaw({ product, openPrice, lots, leverage });
    if (margin && margin.currency !== 'USD') {
      needed.add(normalizeCurrency(margin.currency));
    }
  }

  if (calcPnl && closePrice != null) {
    const pnl = calcPnlRaw({
      product,
      side,
      openPrice,
      closePrice,
      lots,
    });
    if (pnl && pnl.currency !== 'USD') {
      needed.add(normalizeCurrency(pnl.currency));
    }
  }

  for (const ccy of needed) {
    const req = resolveFxPair(ccy, specCodes);
    if (req && !seen.has(req.pair)) {
      seen.add(req.pair);
      out.push(req);
    }
  }

  return out;
}

/** Infer FX fields when product selected but prices incomplete. */
export function previewFxRequirements(
  product: ProductSpec,
  specCodes: string[],
  modes: { margin: boolean; pnl: boolean }
): FxRequirement[] {
  if (!modes.margin && !modes.pnl) return [];
  const kind = classifySymbol(product.code);
  const bq = getBaseQuote(product.code);
  const currencies = new Set<string>();

  if (kind === 'usdBase' && bq) {
    currencies.add(normalizeCurrency(bq.quote));
  } else if (kind === 'usdQuote') {
    return [];
  } else if (product.quoteCurrency) {
    currencies.add(normalizeCurrency(product.quoteCurrency));
  } else if (bq) {
    currencies.add(normalizeCurrency(bq.quote));
  }

  const out: FxRequirement[] = [];
  const seen = new Set<string>();
  for (const ccy of currencies) {
    if (ccy === 'USD') continue;
    const req = resolveFxPair(ccy, specCodes);
    if (req && !seen.has(req.pair)) {
      seen.add(req.pair);
      out.push(req);
    }
  }
  return out;
}
