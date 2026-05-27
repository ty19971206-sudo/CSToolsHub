import { convertWithPairRate } from './fx';
import { applyHedgeDiscount, type OrderMarginSlice } from './hedge';
import { resolveLeverage } from './leverage';
import { calcMarginRaw } from './margin';
import { calcPnlRaw } from './pnl';
import { formatMoney, formatSignedMoney } from './format';
import { getOrderFxRequirements, resolveFxPair } from './fxRequirement';
import { normalizeCurrency } from './fx';
import { equityValueFromTier, usesDynamicEquityTier } from './equityTier';
import type {
  CalcModes,
  GlobalInput,
  OrderComputed,
  OrderInput,
  PortfolioResult,
  ProductSpec,
} from './types';

type PrecomputedPnL = { total: number; any: boolean };

function precomputePortfolioPnL(params: {
  productMap: Map<string, ProductSpec>;
  orders: OrderInput[];
  specCodes: string[];
  calcPnl: boolean;
  hasProductTable: boolean;
}): PrecomputedPnL {
  const { productMap, orders, specCodes, calcPnl, hasProductTable } = params;
  if (!calcPnl || !hasProductTable) return { total: 0, any: false };

  let total = 0;
  let any = false;
  for (const order of orders) {
    const product = productMap.get(order.productCode);
    const open = parseNum(order.openPrice);
    const close = parseNum(order.closePrice);
    const lots = parseNum(order.lots);
    if (!product || open == null || close == null || lots == null || lots <= 0) continue;

    const pnlRaw = calcPnlRaw({
      product,
      side: order.side,
      openPrice: open,
      closePrice: close,
      lots,
    });
    if (!pnlRaw) continue;

    const conv = toUsd(pnlRaw.amount, pnlRaw.currency, specCodes, order.fxRates ?? {});
    if (conv.value != null) {
      total += conv.value;
      any = true;
    }
  }
  return { total, any };
}

/** Account equity (USD) for Rule B — tier picker, balance, or balance + floating P&L */
function accountEquityForLeverage(
  global: GlobalInput,
  calcModes: CalcModes,
  balanceVal: number,
  prePnL: PrecomputedPnL
): number {
  const useTierLeverage =
    calcModes.margin &&
    !calcModes.marginLevel &&
    usesDynamicEquityTier(global.accountLeverage);

  if (useTierLeverage) {
    return equityValueFromTier(global.equityTier);
  }

  if (calcModes.marginLevel) {
    if (calcModes.pnl && prePnL.any) {
      return balanceVal + prePnL.total;
    }
    const b = parseNum(global.balance);
    return b ?? balanceVal;
  }

  if (usesDynamicEquityTier(global.accountLeverage)) {
    return equityValueFromTier(global.equityTier);
  }

  const b = parseNum(global.balance);
  return b ?? balanceVal;
}

function parseNum(s: string): number | null {
  const t = s.trim();
  if (t === '') return null;
  const n = parseFloat(t);
  return Number.isFinite(n) ? n : null;
}

function toUsd(
  amount: number,
  currency: string,
  specCodes: string[],
  orderFxRates: Record<string, string>
): { value: number | null; missing: boolean } {
  const ccy = normalizeCurrency(currency);
  if (ccy === 'USD') return { value: amount, missing: false };

  const req = resolveFxPair(ccy, specCodes);
  if (!req) return { value: null, missing: true };

  const rate = parseNum(orderFxRates[req.pair] ?? '');
  return convertWithPairRate(amount, ccy, req.pair, req.op, rate ?? NaN);
}

function needsLeverage(modes: CalcModes): boolean {
  return modes.margin || modes.marginLevel;
}

export function computePortfolio(params: {
  products: ProductSpec[];
  productMap: Map<string, ProductSpec>;
  orders: OrderInput[];
  global: GlobalInput;
  hasProductTable: boolean;
}): PortfolioResult {
  const { productMap, orders, global, hasProductTable } = params;
  const { calcModes } = global;
  const specCodes = params.products.map((p) => p.code);
  const balance = parseNum(global.balance);
  const balanceVal = balance ?? 0;
  const calcMargin = calcModes.margin || calcModes.marginLevel;
  const calcPnl = calcModes.pnl;
  const prePnL = precomputePortfolioPnL({
    productMap,
    orders,
    specCodes,
    calcPnl,
    hasProductTable,
  });
  const equityForLev = accountEquityForLeverage(global, calcModes, balanceVal, prePnL);
  const useLeverage = needsLeverage(calcModes);

  const marginSlices: OrderMarginSlice[] = [];
  const orderResults: OrderComputed[] = [];
  let totalPnL: number | null = calcPnl ? 0 : null;
  let anyPnL = false;

  for (const order of orders) {
    const product = productMap.get(order.productCode);
    const open = parseNum(order.openPrice);
    const close = parseNum(order.closePrice);
    const lots = parseNum(order.lots);

    const emptyRow = (): OrderComputed => ({
      id: order.id,
      valid: false,
      margin: null,
      marginDisplay: '—',
      pnl: null,
      pnlDisplay: '—',
      effectiveLeverage: null,
      leverageRule: null,
      marginCurrency: null,
      pnlCurrency: null,
      fxMissing: false,
      fxRequirements: [],
    });

    if (!hasProductTable || !product) {
      orderResults.push(emptyRow());
      continue;
    }

    if (open == null || lots == null || lots <= 0) {
      orderResults.push(emptyRow());
      continue;
    }

    if (calcPnl && close == null) {
      orderResults.push(emptyRow());
      continue;
    }

    let leverage = 100;
    let rule: OrderComputed['leverageRule'] = null;
    if (useLeverage) {
      const useTierLeverage =
        calcModes.margin &&
        !calcModes.marginLevel &&
        usesDynamicEquityTier(global.accountLeverage);
      const resolved = resolveLeverage({
        product,
        equity: equityForLev,
        accountLeverage: global.accountLeverage,
        preCloseHour: order.preCloseHour,
        equityTier: global.equityTier,
        useTierLeverage,
      });
      leverage = resolved.leverage;
      rule = resolved.rule;
    }

    const fxRequirements = getOrderFxRequirements({
      product,
      side: order.side,
      openPrice: open,
      closePrice: calcPnl ? close : null,
      lots,
      leverage,
      specCodes,
      calcMargin,
      calcPnl,
    });

    let marginUsd: number | null = null;
    let marginFxMissing = false;
    let marginRaw: ReturnType<typeof calcMarginRaw> = null;

    if (calcMargin) {
      marginRaw = calcMarginRaw({ product, openPrice: open, lots, leverage });
      if (marginRaw) {
        const conv = toUsd(marginRaw.amount, marginRaw.currency, specCodes, order.fxRates ?? {});
        marginUsd = conv.value;
        marginFxMissing = conv.missing;
        if (marginUsd != null) {
          marginSlices.push({
            id: order.id,
            productCode: order.productCode,
            side: order.side,
            lots,
            rawMarginUsd: marginUsd,
          });
        }
      }
    }

    let pnlUsd: number | null = null;
    let pnlFxMissing = false;
    let pnlCurrency: string | null = null;
    if (calcPnl && close != null) {
      const pnlRaw = calcPnlRaw({
        product,
        side: order.side,
        openPrice: open,
        closePrice: close,
        lots,
      });
      if (pnlRaw) {
        pnlCurrency = pnlRaw.currency;
        const conv = toUsd(pnlRaw.amount, pnlRaw.currency, specCodes, order.fxRates ?? {});
        pnlUsd = conv.value;
        pnlFxMissing = conv.missing;
        if (pnlUsd != null) {
          anyPnL = true;
          totalPnL = (totalPnL ?? 0) + pnlUsd;
        }
      }
    }

    const relevantFxMissing =
      (calcMargin && marginFxMissing) ||
      (calcPnl && pnlFxMissing) ||
      fxRequirements.some((r) => !parseNum(order.fxRates?.[r.pair] ?? ''));

    const valid =
      (!calcMargin || marginUsd != null) && (!calcPnl || (close != null && pnlUsd != null));

    orderResults.push({
      id: order.id,
      valid,
      margin: calcMargin ? marginUsd : null,
      marginDisplay: calcMargin && marginUsd != null ? formatMoney(marginUsd, 'USD') : '—',
      pnl: calcPnl ? pnlUsd : null,
      pnlDisplay:
        calcPnl && pnlUsd != null
          ? formatSignedMoney(pnlUsd, 'USD')
          : calcPnl && close != null
            ? '—'
            : '—',
      effectiveLeverage: useLeverage ? leverage : null,
      leverageRule: useLeverage ? rule : null,
      marginCurrency: marginRaw?.currency ?? null,
      pnlCurrency,
      fxMissing: fxRequirements.length > 0 && relevantFxMissing,
      fxRequirements,
    });
  }

  if (calcPnl && !anyPnL) {
    totalPnL = orders.some((o) => parseNum(o.closePrice) != null) ? null : 0;
  }
  if (orders.length === 0 && calcPnl) totalPnL = 0;

  let rawTotalMargin: number | null = null;
  let totalMargin: number | null = null;
  let hedgeSaving: number | null = null;
  let hasHedge = false;

  if (calcMargin && marginSlices.length > 0) {
    const hedge = applyHedgeDiscount(marginSlices);
    rawTotalMargin = hedge.rawTotalMargin;
    totalMargin = hedge.totalMargin;
    hedgeSaving = hedge.hasHedge ? hedge.hedgeSaving : null;
    hasHedge = hedge.hasHedge;
  }

  let equity: number | null = null;
  let marginLevel: number | null = null;
  let leverageUsage: number | null = null;
  let freeMargin: number | null = null;

  if (calcModes.marginLevel && balance != null) {
    equity = balanceVal + (calcPnl && anyPnL ? (totalPnL ?? 0) : 0);
    if (totalMargin != null) {
      if (totalMargin > 0) {
        marginLevel = (equity / totalMargin) * 100;
        leverageUsage = (totalMargin / equity) * 100;
      }
      freeMargin = equity - totalMargin;
    } else if (calcMargin) {
      marginLevel = null;
      freeMargin = equity;
    } else {
      equity = balanceVal;
    }
  }

  return {
    orders: orderResults,
    rawTotalMargin: calcMargin ? rawTotalMargin : null,
    totalMargin: calcMargin ? totalMargin : null,
    hedgeSaving: calcMargin ? hedgeSaving : null,
    hasHedge: calcMargin && hasHedge,
    totalPnL: calcPnl ? totalPnL : null,
    equity: calcModes.marginLevel ? equity : null,
    marginLevel: calcModes.marginLevel ? marginLevel : null,
    leverageUsage: calcModes.marginLevel ? leverageUsage : null,
    freeMargin: calcModes.marginLevel ? freeMargin : null,
  };
}
