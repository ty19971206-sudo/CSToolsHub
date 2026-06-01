import { useCallback, useMemo, useState, startTransition } from 'react';
import { useLang } from '../../lib/lang-context';
import { defaultProducts } from '../../lib/tools/gmcalc/defaultProducts';
import { computePortfolio } from '../../lib/tools/gmcalc/engine';
import {
  formatLeverageDisplay,
  formatMoney,
  formatPercent,
  formatSignedMoney,
  marginLevelTone,
  pnlTone,
} from '../../lib/tools/gmcalc/format';
import {
  defaultEquityTier,
  firstEquityTier,
  tiersForAccountLeverage,
  usesDynamicEquityTier,
  type EquityTierId,
} from '../../lib/tools/gmcalc/equityTier';
import { equityTierLabel, fxRequirementLabel, gmcalcI18n } from '../../lib/tools/gmcalc/i18n';
import { previewFxRequirements } from '../../lib/tools/gmcalc/fxRequirement';
import { parseMarkdownSpec, parseSheetRows, parseTableSpec } from '../../lib/tools/gmcalc/parseSpec';
import { loadStoredProducts, saveStoredProducts } from '../../lib/tools/gmcalc/storage';
import type {
  AccountLeverage,
  CalcModes,
  OrderInput,
  PortfolioResult,
  ProductSpec,
} from '../../lib/tools/gmcalc/types';
import ProductCombo from './gmcalc/ProductCombo';
import './gmcalc.css';

const STORAGE_SPEC_PASTE = 'gmcalc_spec_paste_v1';

const DEFAULT_MODES: CalcModes = {
  margin: true,
  pnl: false,
  marginLevel: false,
};

function newOrderId() {
  return `o-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function emptyOrder(): OrderInput {
  return {
    id: newOrderId(),
    productCode: '',
    side: 'buy',
    openPrice: '',
    closePrice: '',
    lots: '1',
    preCloseHour: false,
    fxRates: {},
  };
}

function ResultValue({
  className = '',
  children,
}: {
  className?: string;
  children: string;
}) {
  return (
    <span className={`result-value${className ? ` ${className}` : ''}`}>{children}</span>
  );
}

const pnlLabels = (t: (typeof gmcalcI18n)['zh']) => ({
  profit: t.pnlProfit,
  loss: t.pnlLoss,
  flat: t.pnlFlat,
});

const marginLevelLabels = (t: (typeof gmcalcI18n)['zh']) => ({
  safe: t.marginLevelSafe,
  warning: t.marginLevelWarn,
  danger: t.marginLevelDanger,
});

function MarginLevelHighlight({
  value,
  display,
  labels,
}: {
  value: number | null | undefined;
  display: string;
  labels: { safe: string; warning: string; danger: string };
}) {
  const tone = marginLevelTone(value);
  const empty = display === '—' || tone == null;

  if (empty) {
    return <span className="result-value ml-neutral">{display}</span>;
  }

  const badge =
    tone === 'safe' ? labels.safe : tone === 'warning' ? labels.warning : labels.danger;

  return (
    <span
      className={`ml-value ml-${tone}`}
      role="status"
      aria-label={`${badge} ${display}`}
    >
      <span className="ml-lights" aria-hidden>
        <span className={`ml-light ml-light--safe${tone === 'safe' ? ' is-on' : ''}`} />
        <span className={`ml-light ml-light--warn${tone === 'warning' ? ' is-on' : ''}`} />
        <span className={`ml-light ml-light--danger${tone === 'danger' ? ' is-on' : ''}`} />
      </span>
      <span className="ml-badge">{badge}</span>
      <span className="ml-amount">{display}</span>
    </span>
  );
}

function PnlHighlight({
  value,
  display,
  labels,
  size = 'md',
  className = '',
}: {
  value: number | null | undefined;
  display: string;
  labels: { profit: string; loss: string; flat: string };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const tone = pnlTone(value);
  const empty = display === '—' || tone == null;

  if (empty) {
    return (
      <span className={`result-value pnl-neutral${className ? ` ${className}` : ''}`}>
        {display}
      </span>
    );
  }

  const icon = tone === 'profit' ? '▲' : tone === 'loss' ? '▼' : '●';
  const badge =
    tone === 'profit' ? labels.profit : tone === 'loss' ? labels.loss : labels.flat;

  return (
    <span
      className={`pnl-value pnl-${tone} pnl-value--${size}${className ? ` ${className}` : ''}`}
      role="status"
      aria-label={badge}
    >
      <span className="pnl-badge">{badge}</span>
      <span className="pnl-icon" aria-hidden>
        {icon}
      </span>
      <span className="pnl-amount">{display}</span>
    </span>
  );
}

export default function GmCalcApp() {
  const { lang } = useLang();
  const t = gmcalcI18n[lang];

  const [products, setProducts] = useState<ProductSpec[]>(
    () => loadStoredProducts() ?? defaultProducts
  );
  const [pasteText, setPasteText] = useState('');
  const [balance, setBalance] = useState('10000');
  const [accountLeverage, setAccountLeverage] = useState<AccountLeverage>('400');
  const [equityTier, setEquityTier] = useState<EquityTierId>(() =>
    defaultEquityTier('400')
  );
  const [calcModes, setCalcModes] = useState<CalcModes>(DEFAULT_MODES);
  const [orders, setOrders] = useState<OrderInput[]>(() => [emptyOrder()]);
  const [result, setResult] = useState<PortfolioResult | null>(null);

  const productMap = useMemo(() => new Map(products.map((p) => [p.code, p])), [products]);
  const specCodes = useMemo(() => products.map((p) => p.code), [products]);
  const hasProductTable = products.length > 0;

  const needsLeverage = calcModes.margin || calcModes.marginLevel;
  const showEquityTier =
    calcModes.margin &&
    !calcModes.marginLevel &&
    needsLeverage &&
    usesDynamicEquityTier(accountLeverage);
  const tierOptions = useMemo(
    () => tiersForAccountLeverage(accountLeverage),
    [accountLeverage]
  );

  const runCalculate = useCallback(() => {
    const next = computePortfolio({
      products,
      productMap,
      orders,
      global: { balance, accountLeverage, equityTier, calcModes },
      hasProductTable,
    });
    startTransition(() => setResult(next));
  }, [
    products,
    productMap,
    orders,
    balance,
    accountLeverage,
    equityTier,
    calcModes,
    hasProductTable,
  ]);

  const resetCalculator = useCallback(() => {
    const defaultLeverage: AccountLeverage = '400';
    setBalance('10000');
    setAccountLeverage(defaultLeverage);
    setEquityTier(defaultEquityTier(defaultLeverage));
    setCalcModes(DEFAULT_MODES);
    setOrders([emptyOrder()]);
    setResult(null);
  }, []);

  const applyProducts = useCallback((list: ProductSpec[]) => {
    setProducts(list);
    saveStoredProducts(list);
  }, []);

  function toggleCalcMode(key: keyof CalcModes) {
    startTransition(() => {
      setCalcModes((prev) => {
        const next = { ...prev, [key]: !prev[key] } as CalcModes;

        // Margin level must be computed together with P&L (can't be standalone)
        if (key === 'marginLevel' && next.marginLevel) {
          next.pnl = true;
        }
        if (key === 'pnl' && !next.pnl) {
          next.marginLevel = false;
        }

        if (!next.margin && !next.pnl && !next.marginLevel) return prev;
        return next;
      });
    });
  }

  function onParsePaste() {
    const fromMd = parseMarkdownSpec(pasteText);
    const list = fromMd.length > 0 ? fromMd : parseTableSpec(pasteText);
    if (list.length > 0) applyProducts(list);
  }

  async function onFileUpload(file: File | undefined) {
    if (!file) return;
    const name = file.name.toLowerCase();
    if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
      const XLSX = await import('xlsx');
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: 'array' });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' }) as unknown[][];
      const list = parseSheetRows(rows);
      if (list.length > 0) applyProducts(list);
      return;
    }
    const text = await file.text();
    const fromMd = parseMarkdownSpec(text);
    const list = fromMd.length > 0 ? fromMd : parseTableSpec(text);
    if (list.length > 0) applyProducts(list);
  }

  function updateOrder(id: string, patch: Partial<OrderInput>) {
    startTransition(() => {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
    });
  }

  function updateOrderFx(id: string, pair: string, value: string) {
    startTransition(() => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, fxRates: { ...o.fxRates, [pair]: value } } : o
        )
      );
    });
  }

  function addOrder() {
    startTransition(() => setOrders((prev) => [...prev, emptyOrder()]));
  }

  function removeOrder(id: string) {
    startTransition(() => {
      setOrders((prev) => (prev.length <= 1 ? prev : prev.filter((o) => o.id !== id)));
    });
  }

  function orderFxFields(order: OrderInput) {
    const computed = result?.orders.find((r) => r.id === order.id);
    if (computed?.fxRequirements.length) return computed.fxRequirements;
    const product = productMap.get(order.productCode);
    if (!product) return [];
    return previewFxRequirements(product, specCodes, {
      margin: calcModes.margin || calcModes.marginLevel,
      pnl: calcModes.pnl,
    });
  }

  return (
    <div className="gm-page">
      <div className="calculator-container surface-glass">
        <div className="header">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        <div className="gm-dashboard">
          <div className="gm-workspace">
            <div className="gm-settings-row panel-animate">
              <div className="panel panel-compact">
                <div className="panel-title">{t.calcModeTitle}</div>
                <div className="calc-mode-row">
                  <label className="calc-mode-chip">
                    <input
                      type="checkbox"
                      checked={calcModes.margin}
                      onChange={() => toggleCalcMode('margin')}
                    />
                    <span>{t.calcMargin}</span>
                  </label>
                  <label className="calc-mode-chip">
                    <input
                      type="checkbox"
                      checked={calcModes.pnl}
                      onChange={() => toggleCalcMode('pnl')}
                    />
                    <span>{t.calcPnl}</span>
                  </label>
                  <label className="calc-mode-chip calc-mode-sub">
                    <input
                      type="checkbox"
                      checked={calcModes.marginLevel}
                      onChange={() => toggleCalcMode('marginLevel')}
                    />
                    <span>↳ {t.calcMarginLevel}</span>
                  </label>
                </div>
                <p className="hint calc-mode-hint">{t.calcModeHint}</p>
              </div>

              <div className="panel panel-compact">
                <div className="panel-title">{t.globalTitle}</div>
                <div className="field-row">
                  {calcModes.marginLevel && (
                    <div className="field-group">
                      <label>{t.accountEquity}</label>
                      <input
                        type="number"
                        step="any"
                        value={balance}
                        onChange={(e) => setBalance(e.target.value)}
                      />
                    </div>
                  )}
                  {needsLeverage && (
                    <div className="field-group">
                      <label>{t.accountLeverage}</label>
                      <select
                        value={accountLeverage}
                        onChange={(e) => {
                          const lev = e.target.value as AccountLeverage;
                          setAccountLeverage(lev);
                          setEquityTier(firstEquityTier(lev));
                        }}
                      >
                        <option value="100">{t.lev100}</option>
                        <option value="200">{t.lev200}</option>
                        <option value="400">{t.lev400}</option>
                        <option value="1000">{t.lev1000}</option>
                      </select>
                    </div>
                  )}
                  {showEquityTier && (
                    <div className="field-group">
                      <label>{t.equityTier}</label>
                      <select
                        value={equityTier}
                        onChange={(e) =>
                          setEquityTier(e.target.value as EquityTierId)
                        }
                      >
                        {tierOptions.map((id) => (
                          <option key={id} value={id}>
                            {equityTierLabel(lang, id)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="panel panel-animate">
              <div className="panel-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{t.ordersTitle}</span>
                <button type="button" className="button-primary" onClick={addOrder}>
                  + {t.addOrder}
                </button>
              </div>

              {orders.map((order, idx) => {
                const computed = result?.orders.find((r) => r.id === order.id);
                const product = productMap.get(order.productCode);
                const fxFields = orderFxFields(order);
                return (
                  <details
                    key={order.id}
                    className="order-card order-card-animate"
                    style={{ animationDelay: `${idx * 50}ms` }}
                    open
                  >
                    <summary>
                      <span>
                        #{idx + 1}{' '}
                        {order.productCode || t.selectProduct} ·{' '}
                        {order.side === 'buy' ? t.buy : t.sell}
                      </span>
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={(e) => {
                          e.preventDefault();
                          removeOrder(order.id);
                        }}
                      >
                        {t.removeOrder}
                      </button>
                    </summary>
                    <div className="order-body">
                      <div className="order-inputs">
                      <div className="field-row">
                        <div className="field-group">
                          <label>{t.product}</label>
                          <ProductCombo
                            products={products}
                            value={order.productCode}
                            disabled={!hasProductTable}
                            placeholder={t.selectProduct}
                            onChange={(code) =>
                              updateOrder(order.id, { productCode: code, fxRates: {} })
                            }
                          />
                        </div>
                        <div className="field-group">
                          <label>{t.side}</label>
                          <select
                            value={order.side}
                            onChange={(e) =>
                              updateOrder(order.id, { side: e.target.value as 'buy' | 'sell' })
                            }
                          >
                            <option value="buy">{t.buy}</option>
                            <option value="sell">{t.sell}</option>
                          </select>
                        </div>
                      </div>
                      <div className="field-row">
                        <div className="field-group">
                          <label>{t.openPrice}</label>
                          <input
                            type="number"
                            step="any"
                            value={order.openPrice}
                            onChange={(e) => updateOrder(order.id, { openPrice: e.target.value })}
                          />
                        </div>
                        {calcModes.pnl && (
                          <div className="field-group">
                            <label>{t.closePrice}</label>
                            <input
                              type="number"
                              step="any"
                              value={order.closePrice}
                              onChange={(e) =>
                                updateOrder(order.id, { closePrice: e.target.value })
                              }
                            />
                          </div>
                        )}
                        <div className="field-group">
                          <label>{t.lots}</label>
                          <input
                            type="number"
                            step="any"
                            value={order.lots}
                            onChange={(e) => updateOrder(order.id, { lots: e.target.value })}
                          />
                        </div>
                      </div>
                      {needsLeverage && (
                        <div
                          className="field-group"
                          style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                        >
                          <input
                            type="checkbox"
                            id={`pre-${order.id}`}
                            checked={order.preCloseHour}
                            onChange={(e) =>
                              updateOrder(order.id, { preCloseHour: e.target.checked })
                            }
                          />
                          <label htmlFor={`pre-${order.id}`} style={{ fontWeight: 500 }}>
                            {t.preCloseHour}
                          </label>
                        </div>
                      )}

                      {fxFields.length > 0 && (
                        <div className="fx-fields-panel">
                          {fxFields.map((req) => (
                            <div key={req.pair} className="field-group">
                              <label>
                                {fxRequirementLabel(lang, req.pair, req.op, req.amountCurrency)}
                              </label>
                              <input
                                type="number"
                                step="any"
                                placeholder={req.pair}
                                value={order.fxRates[req.pair] ?? ''}
                                onChange={(e) =>
                                  updateOrderFx(order.id, req.pair, e.target.value)
                                }
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      </div>

                      <div className="order-results-block">
                        <div className="order-results-heading">{t.orderResults}</div>
                      <div className="order-mini-results">
                        {(calcModes.margin || calcModes.marginLevel) && (
                          <div>
                            <span>{t.orderMargin}</span>
                            <strong>{computed?.marginDisplay ?? '—'}</strong>
                          </div>
                        )}
                        {calcModes.pnl && (
                          <div className="pnl-result-cell">
                            <span>{t.orderPnl}</span>
                            <PnlHighlight
                              value={computed?.pnl ?? null}
                              display={computed?.pnlDisplay ?? '—'}
                              labels={pnlLabels(t)}
                              size="sm"
                            />
                          </div>
                        )}
                        {needsLeverage && (
                          <div>
                            <span>{t.orderLeverage}</span>
                            <strong>
                              {computed?.effectiveLeverage
                                ? formatLeverageDisplay(computed.effectiveLeverage)
                                : '—'}
                            </strong>
                          </div>
                        )}
                      </div>
                      </div>
                    </div>
                  </details>
                );
              })}
            </div>

            <div className="panel panel-spec-bottom panel-animate">
              <div className="panel-title">{t.specTitle}</div>
              <p className="hint">{t.specHint}</p>
              {hasProductTable && (
                <span className="spec-badge">
                  {t.specCount}: {products.length}
                </span>
              )}
              <div className="field-group">
                <label>{t.specPaste}</label>
                <textarea
                  value={pasteText}
                  placeholder="产品,名称,...,合约单位,...,最高杠杆"
                  onChange={(e) => {
                    setPasteText(e.target.value);
                    if (typeof localStorage !== 'undefined') {
                      localStorage.setItem(STORAGE_SPEC_PASTE, e.target.value);
                    }
                  }}
                />
                <div className="btn-row">
                  <button type="button" className="button-primary" onClick={onParsePaste}>
                    {t.specPaste}
                  </button>
                  <label className="button-secondary" style={{ cursor: 'pointer' }}>
                    {t.specUpload}
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls,.md,.txt"
                      hidden
                      onChange={(e) => {
                        void onFileUpload(e.target.files?.[0]);
                        e.target.value = '';
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={() => applyProducts(defaultProducts)}
                  >
                    {lang === 'zh' ? '恢复内置细则' : 'Reset built-in spec'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <aside className="gm-right">
            <div className="gm-right-stack panel-animate">
              <div className="gm-calc-bar">
                <button type="button" className="button-primary gm-calc-btn" onClick={runCalculate}>
                  {t.calcBtn}
                </button>
                <button
                  type="button"
                  className="button-secondary gm-calc-btn gm-reset-btn"
                  onClick={resetCalculator}
                >
                  {t.resetBtn}
                </button>
              </div>
            <div className="result-section result-section-sticky">
              <div className="result-title">
                {t.summaryTitle}
                {result && calcModes.margin && result.hasHedge && (
                  <span className="hedge-tag">{t.hedgeBadge}</span>
                )}
              </div>

              {!result && (
                <p className="summary-pending hint">{t.summaryPending}</p>
              )}

              {result && (calcModes.margin || calcModes.marginLevel) && (
                <div className="result-item">
                  <span className="result-label">{t.totalMargin}</span>
                  <ResultValue>
                    {result.totalMargin != null ? formatMoney(result.totalMargin, 'USD') : '—'}
                  </ResultValue>
                </div>
              )}

              {result && calcModes.margin && result.hasHedge && result.rawTotalMargin != null && (
                <div className="result-item">
                  <span className="result-label">{t.rawMargin}</span>
                  <ResultValue>{formatMoney(result.rawTotalMargin, 'USD')}</ResultValue>
                </div>
              )}

              {result && calcModes.margin && result.hedgeSaving != null && result.hedgeSaving > 0 && (
                <div className="result-item">
                  <span className="result-label">{t.hedgeSaving}</span>
                  <ResultValue className="value-success">
                    {formatMoney(result.hedgeSaving, 'USD')}
                  </ResultValue>
                </div>
              )}

              {result && calcModes.pnl && (
                <div className="result-item result-item--pnl">
                  <span className="result-label">{t.totalPnl}</span>
                  <PnlHighlight
                    value={result.totalPnL}
                    display={
                      result.totalPnL != null
                        ? formatSignedMoney(result.totalPnL, 'USD')
                        : '—'
                    }
                    labels={pnlLabels(t)}
                    size="lg"
                  />
                </div>
              )}

              {result && calcModes.marginLevel && (
                <>
                  <div className="result-item">
                    <span className="result-label">{t.equityResult}</span>
                    <ResultValue>
                      {result.equity != null ? formatMoney(result.equity, 'USD') : '—'}
                    </ResultValue>
                  </div>
                  <div className="result-item result-item--margin-level">
                    <span className="result-label">{t.marginLevel}</span>
                    <MarginLevelHighlight
                      value={result.marginLevel}
                      display={
                        result.marginLevel != null ? formatPercent(result.marginLevel) : '—'
                      }
                      labels={marginLevelLabels(t)}
                    />
                  </div>
                  <div className="result-item">
                    <span className="result-label">{t.freeMargin}</span>
                    <ResultValue>
                      {result.freeMargin != null ? formatMoney(result.freeMargin, 'USD') : '—'}
                    </ResultValue>
                  </div>
                </>
              )}
            </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
