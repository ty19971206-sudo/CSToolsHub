/**
 * Quiz-aligned tests for gmcalc engine (run: npx tsx scripts/test-gmcalc.mjs)
 */
import assert from 'assert';
import { calcMarginRaw } from '../src/lib/tools/gmcalc/margin.ts';
import { calcPnlRaw } from '../src/lib/tools/gmcalc/pnl.ts';
import {
  resolveLeverage,
  resolveDynamicLeverage,
  isDynamicLeverageProduct,
} from '../src/lib/tools/gmcalc/leverage.ts';
import { applyHedgeDiscount } from '../src/lib/tools/gmcalc/hedge.ts';
import { computePortfolio } from '../src/lib/tools/gmcalc/engine.ts';
import {
  resolveFxPair,
  applyFxConversion,
  previewFxRequirements,
} from '../src/lib/tools/gmcalc/fxRequirement.ts';
import { convertWithPairRate } from '../src/lib/tools/gmcalc/fx.ts';
import { defaultProducts } from '../src/lib/tools/gmcalc/defaultProducts.ts';

const map = new Map(defaultProducts.map((p) => [p.code, p]));
const specCodes = defaultProducts.map((p) => p.code);

function product(code) {
  const p = map.get(code);
  if (!p) throw new Error(`missing ${code}`);
  return p;
}

function marginUsd(code, open, lots, lev) {
  const p = product(code);
  const m = calcMarginRaw({ product: p, openPrice: open, lots, leverage: lev });
  assert.ok(m);
  return m.amount;
}

assert.ok(Math.abs(marginUsd('EURUSD', 1.08, 1, 100) - 1080) < 0.01);
assert.ok(Math.abs(marginUsd('GBPUSD', 1.25, 2, 400) - 625) < 0.01);
assert.ok(Math.abs(marginUsd('USDJPY', 150, 0.5, 200) - 250) < 0.01);
assert.ok(Math.abs(marginUsd('USDCAD', 1.35, 1, 400) - 250) < 0.01);
assert.ok(Math.abs(marginUsd('XAUUSD', 2300, 1, 200) - 1150) < 0.01);

const oil = product('USOIL.MMMYY');
const oilM = calcMarginRaw({ product: oil, openPrice: 80, lots: 1, leverage: 100 });
assert.ok(Math.abs(oilM.amount - 800) < 0.01);

const eurPnl = calcPnlRaw({
  product: product('EURUSD'),
  side: 'buy',
  openPrice: 1.08,
  closePrice: 1.085,
  lots: 1,
});
assert.ok(Math.abs(eurPnl.amount - 500) < 0.01);

const usdJpyReq = resolveFxPair('JPY', specCodes);
assert.strictEqual(usdJpyReq.pair, 'USDJPY');
assert.strictEqual(usdJpyReq.op, 'divide');
const jpyConv = convertWithPairRate(150000, 'JPY', 'USDJPY', 'divide', 150);
assert.ok(Math.abs(jpyConv.value - 1000) < 0.01);

const nzdReq = resolveFxPair('NZD', specCodes);
assert.strictEqual(nzdReq.pair, 'NZDUSD');
assert.strictEqual(nzdReq.op, 'multiply');
assert.ok(Math.abs(applyFxConversion(100, 'multiply', 0.6) - 60) < 0.01);

const levA = resolveLeverage({
  product: product('EURHUF'),
  equity: 50000,
  accountLeverage: '1000',
  preCloseHour: false,
});
assert.strictEqual(levA.leverage, 50);

const xauTierLev = resolveLeverage({
  product: product('XAUUSD'),
  equity: 50_000,
  accountLeverage: '1000',
  preCloseHour: false,
  equityTier: '1000_l10k',
  useTierLeverage: true,
});
assert.strictEqual(xauTierLev.leverage, 1000);

const xauMidTier = resolveLeverage({
  product: product('XAUUSD'),
  equity: 8_000,
  accountLeverage: '1000',
  preCloseHour: false,
  equityTier: '1000_m10k100k',
  useTierLeverage: true,
});
assert.strictEqual(xauMidTier.leverage, 400);

assert.strictEqual(resolveDynamicLeverage(10_000, '1000'), 1000);
assert.strictEqual(resolveDynamicLeverage(10_001, '1000'), 400);
assert.strictEqual(resolveDynamicLeverage(100_000, '1000'), 400);
assert.strictEqual(resolveDynamicLeverage(100_001, '1000'), 200);
assert.strictEqual(resolveDynamicLeverage(100_000, '400'), 400);
assert.strictEqual(resolveDynamicLeverage(100_001, '400'), 200);

assert.ok(isDynamicLeverageProduct(product('EURUSD')));
assert.ok(isDynamicLeverageProduct(product('XAUUSD')));
assert.ok(!isDynamicLeverageProduct(product('EURHUF')));
assert.ok(!isDynamicLeverageProduct(product('USOIL.MMMYY')));

const lev200HighEquity = resolveLeverage({
  product: product('EURUSD'),
  equity: 150_000,
  accountLeverage: '200',
  preCloseHour: false,
});
assert.strictEqual(lev200HighEquity.leverage, 200);
assert.strictEqual(lev200HighEquity.rule, 'B');

const oilNormal = resolveLeverage({
  product: product('USOIL.MMMYY'),
  equity: 50_000,
  accountLeverage: '1000',
  preCloseHour: false,
});
assert.strictEqual(oilNormal.leverage, 100);
assert.strictEqual(oilNormal.rule, 'A');

const oilPreClose = resolveLeverage({
  product: product('USOIL.MMMYY'),
  equity: 50_000,
  accountLeverage: '1000',
  preCloseHour: true,
});
assert.strictEqual(oilPreClose.leverage, 50);
assert.strictEqual(oilPreClose.rule, 'C');

const eurHighEquity = resolveLeverage({
  product: product('EURUSD'),
  equity: 150_000,
  accountLeverage: '1000',
  preCloseHour: false,
});
assert.strictEqual(eurHighEquity.leverage, 200);
assert.strictEqual(eurHighEquity.rule, 'B');

const nzdchf = product('NZDCHF');
const nzdMargin = calcMarginRaw({
  product: nzdchf,
  openPrice: 0.5,
  lots: 1,
  leverage: 400,
});
assert.strictEqual(nzdMargin.currency, 'CHF');
assert.ok(Math.abs(nzdMargin.amount - 125) < 0.01);

const nzdFx = previewFxRequirements(nzdchf, specCodes, { margin: true, pnl: false });
assert.strictEqual(nzdFx.length, 1);
assert.strictEqual(nzdFx[0].pair, 'USDCHF');
assert.strictEqual(nzdFx[0].amountCurrency, 'CHF');

const hedge = applyHedgeDiscount([
  { id: '1', productCode: 'XAUUSD', side: 'buy', lots: 1, rawMarginUsd: 2000 },
  { id: '2', productCode: 'XAUUSD', side: 'sell', lots: 1, rawMarginUsd: 2000 },
]);
assert.ok(Math.abs(hedge.totalMargin - 2000) < 0.01);

const pf = computePortfolio({
  products: defaultProducts,
  productMap: map,
  orders: [
    {
      id: 'a',
      productCode: 'EURUSD',
      side: 'buy',
      openPrice: '1.1',
      closePrice: '',
      lots: '2',
      preCloseHour: false,
      fxRates: {},
    },
    {
      id: 'b',
      productCode: 'EURUSD',
      side: 'sell',
      openPrice: '1.1',
      closePrice: '',
      lots: '1',
      preCloseHour: false,
      fxRates: {},
    },
  ],
  global: {
    balance: '10000',
    accountLeverage: '400',
    equityTier: '400_l100k',
    calcModes: { margin: true, pnl: false, marginLevel: false },
  },
  hasProductTable: true,
});
assert.ok(pf.totalMargin != null && Math.abs(pf.totalMargin - 550) < 0.01);

console.log('All gmcalc tests passed.');
