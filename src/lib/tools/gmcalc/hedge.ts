import type { OrderSide } from './types';

export type OrderMarginSlice = {
  id: string;
  productCode: string;
  side: OrderSide;
  lots: number;
  rawMarginUsd: number;
};

export type HedgeResult = {
  rawTotalMargin: number;
  totalMargin: number;
  hedgeSaving: number;
  hasHedge: boolean;
};

/**
 * Same product code, opposite sides: hedged lots pay 50% of (buy margin + sell margin) for matched volume.
 */
export function applyHedgeDiscount(slices: OrderMarginSlice[]): HedgeResult {
  const rawTotalMargin = slices.reduce((s, x) => s + x.rawMarginUsd, 0);
  if (slices.length === 0) {
    return { rawTotalMargin: 0, totalMargin: 0, hedgeSaving: 0, hasHedge: false };
  }

  const byProduct = new Map<string, OrderMarginSlice[]>();
  for (const s of slices) {
    const list = byProduct.get(s.productCode) ?? [];
    list.push(s);
    byProduct.set(s.productCode, list);
  }

  let totalMargin = 0;
  let hasHedge = false;

  for (const list of byProduct.values()) {
    const buys = list.filter((x) => x.side === 'buy');
    const sells = list.filter((x) => x.side === 'sell');
    const totalBuyLots = buys.reduce((s, x) => s + x.lots, 0);
    const totalSellLots = sells.reduce((s, x) => s + x.lots, 0);
    const rawBuy = buys.reduce((s, x) => s + x.rawMarginUsd, 0);
    const rawSell = sells.reduce((s, x) => s + x.rawMarginUsd, 0);

    const h = Math.min(totalBuyLots, totalSellLots);
    if (h <= 0 || totalBuyLots <= 0 || totalSellLots <= 0) {
      totalMargin += rawBuy + rawSell;
      continue;
    }

    hasHedge = true;
    const buyPerLot = rawBuy / totalBuyLots;
    const sellPerLot = rawSell / totalSellLots;
    const hedgedMargin = 0.5 * (buyPerLot * h + sellPerLot * h);
    const unhedgedBuy = buyPerLot * (totalBuyLots - h);
    const unhedgedSell = sellPerLot * (totalSellLots - h);
    totalMargin += hedgedMargin + unhedgedBuy + unhedgedSell;
  }

  return {
    rawTotalMargin,
    totalMargin,
    hedgeSaving: rawTotalMargin - totalMargin,
    hasHedge,
  };
}
