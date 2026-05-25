import { useCallback, useEffect, useRef, useState } from 'react';
import { useLang } from '../../lib/lang-context';
import {
  calculateMuCredit,
  formatMu,
  mucreditI18n,
  tMu,
  type MuCreditError,
} from '../../lib/tools/mucredit';
import './mucredit.css';

type ShakeField = 'withdrawal' | 'balance' | 'credit' | 'margin' | null;

const ERROR_FIELD: Record<MuCreditError, ShakeField> = {
  errorAmount: 'withdrawal',
  errorBalance: 'balance',
  errorCredit: 'credit',
  errorMargin: 'margin',
  errorInsufficient: 'withdrawal',
};

function ResultValue({
  className = '',
  children,
}: {
  className?: string;
  children: string;
}) {
  const [updated, setUpdated] = useState(false);
  const prev = useRef(children);

  useEffect(() => {
    if (children !== '—' && children !== prev.current) {
      setUpdated(false);
      requestAnimationFrame(() => {
        setUpdated(true);
        setTimeout(() => setUpdated(false), 320);
      });
    }
    prev.current = children;
  }, [children]);

  return (
    <span className={`result-value${updated ? ' updated' : ''}${className ? ` ${className}` : ''}`}>
      {children}
    </span>
  );
}

export default function MuCreditApp() {
  const { lang } = useLang();
  const t = mucreditI18n[lang];

  const [closingPL, setClosingPL] = useState('');
  const [floatingPL, setFloatingPL] = useState('');
  const [historicalWithdrawal, setHistoricalWithdrawal] = useState('');
  const [balance, setBalance] = useState('');
  const [credit, setCredit] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [hasPosition, setHasPosition] = useState(true);
  const [usedMargin, setUsedMargin] = useState('');
  const [error, setError] = useState<MuCreditError | null>(null);
  const [result, setResult] = useState<ReturnType<typeof calculateMuCredit>['result']>(undefined);
  const [conditionalVisible, setConditionalVisible] = useState(true);
  const [conditionalAnim, setConditionalAnim] = useState<'active' | 'hiding'>('active');
  const [shakeField, setShakeField] = useState<ShakeField>(null);

  useEffect(() => {
    setResult(undefined);
    setError(null);
  }, [lang]);

  const onHasPositionChange = useCallback((checked: boolean) => {
    setHasPosition(checked);
    if (checked) {
      setConditionalVisible(true);
      requestAnimationFrame(() => setConditionalAnim('active'));
    } else {
      setConditionalAnim('hiding');
      window.setTimeout(() => {
        setConditionalVisible(false);
        setFloatingPL('');
        setUsedMargin('');
      }, 300);
    }
  }, []);

  function inputShakeClass(field: ShakeField) {
    return shakeField === field ? 'error-shake' : '';
  }

  function onCalculate() {
    setShakeField(null);
    const usedMarginProvided = !hasPosition || usedMargin.trim() !== '';
    const out = calculateMuCredit({
      closingPL: parseFloat(closingPL) || 0,
      floatingPL: parseFloat(floatingPL) || 0,
      historicalWithdrawal: parseFloat(historicalWithdrawal) || 0,
      balance: parseFloat(balance) || 0,
      credit: parseFloat(credit) || 0,
      withdrawalAmount: parseFloat(withdrawalAmount) || 0,
      hasPosition,
      usedMargin: hasPosition ? parseFloat(usedMargin) || 0 : 0,
      usedMarginProvided,
    });
    if (out.error) {
      setError(out.error);
      setResult(undefined);
      const field = ERROR_FIELD[out.error];
      setShakeField(field);
      window.setTimeout(() => setShakeField(null), 400);
    } else {
      setError(null);
      setResult(out.result);
    }
  }

  const conditionalClass = `field-group conditional-input ${conditionalAnim}`;

  return (
    <div className="mu-page">
      <div className="calculator-container surface-glass">
        <div className="header">
          <div className="header-left">
            <h1>{t.title}</h1>
            <p dangerouslySetInnerHTML={{ __html: t.subtitle }} />
          </div>
        </div>
        <div className="main-content">
          <div className="input-section">
            <div className="field-group">
              <label>📈 {t.closingPL}</label>
              <input
                type="number"
                step="any"
                placeholder={t.placeholderClosingPL}
                value={closingPL}
                onChange={(e) => setClosingPL(e.target.value)}
              />
            </div>
            <div className="field-row">
              <div className="field-group">
                <label>📋 {t.histWithdrawal}</label>
                <input
                  type="number"
                  step="any"
                  placeholder={t.placeholderHistWithdrawal}
                  value={historicalWithdrawal}
                  onChange={(e) => setHistoricalWithdrawal(e.target.value)}
                />
              </div>
              <div className="field-group">
                <label>💰 {t.balance}</label>
                <input
                  type="number"
                  step="any"
                  className={inputShakeClass('balance')}
                  placeholder={t.placeholderBalance}
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                />
              </div>
            </div>
            <div className="field-row">
              <div className="field-group">
                <label>🎁 {t.credit}</label>
                <input
                  type="number"
                  step="any"
                  className={inputShakeClass('credit')}
                  placeholder={t.placeholderCredit}
                  value={credit}
                  onChange={(e) => setCredit(e.target.value)}
                />
              </div>
              <div className="field-group">
                <label>💵 {t.withdrawAmount}</label>
                <input
                  type="number"
                  step="any"
                  className={inputShakeClass('withdrawal')}
                  placeholder={t.placeholderWithdrawAmount}
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                />
              </div>
            </div>
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="hasPosition"
                checked={hasPosition}
                onChange={(e) => onHasPositionChange(e.target.checked)}
              />
              <label htmlFor="hasPosition">{t.hasPosition}</label>
            </div>
            {conditionalVisible && (
              <>
                <div className={conditionalClass}>
                  <label>📉 {t.floatingPL}</label>
                  <input
                    type="number"
                    step="any"
                    placeholder={t.placeholderFloatingPL}
                    value={floatingPL}
                    disabled={!hasPosition}
                    onChange={(e) => setFloatingPL(e.target.value)}
                  />
                </div>
                <div className={conditionalClass}>
                  <label>⚙️ {t.usedMargin}</label>
                  <input
                    type="number"
                    step="any"
                    className={inputShakeClass('margin')}
                    placeholder={t.placeholderUsedMargin}
                    value={usedMargin}
                    disabled={!hasPosition}
                    onChange={(e) => setUsedMargin(e.target.value)}
                  />
                </div>
              </>
            )}
            <button type="button" className="button" onClick={onCalculate}>
              <span>🔍</span> {t.calcBtn}
            </button>
            <div className="rule-note" dangerouslySetInnerHTML={{ __html: t.ruleNote }} />
          </div>
          <div className="result-section">
            <div className="result-title">{t.resultTitle}</div>
            {error && (
              <div className="error-message show">⚠️ {tMu(lang, error)}</div>
            )}
            <div className="result-item">
              <span className="result-label">{t.avLabel}</span>
              <ResultValue>{result ? formatMu(result.av) + t.unitUSD : '—'}</ResultValue>
            </div>
            <div className="result-item">
              <span className="result-label">{t.needCreditLabel}</span>
              <ResultValue
                className={
                  result?.needDeduct ? 'value-highlight' : result ? 'value-success' : ''
                }
              >
                {result ? (result.needDeduct ? t.needYes : t.needNo) : '—'}
              </ResultValue>
            </div>
            <div className="result-item">
              <span className="result-label">{t.creditDeductLabel}</span>
              <ResultValue>
                {result ? formatMu(result.creditDeduct) + t.unitUSD : '—'}
              </ResultValue>
            </div>
            <div className="result-item">
              <span className="result-label">{t.afterBalanceLabel}</span>
              <ResultValue>
                {result ? formatMu(result.afterBalance) + t.unitUSD : '—'}
              </ResultValue>
            </div>
            <div className="result-item">
              <span className="result-label">{t.afterCreditLabel}</span>
              <ResultValue>
                {result ? formatMu(result.afterCredit) + t.unitUSD : '—'}
              </ResultValue>
            </div>
            {result?.marginLevel != null && (
              <div className="result-item">
                <span className="result-label">{t.marginLevelLabel}</span>
                <ResultValue
                  className={
                    result.marginLevel < 100 ? 'value-highlight' : 'value-success'
                  }
                >
                  {formatMu(result.marginLevel, 2) + t.unitPercent}
                </ResultValue>
              </div>
            )}
            {result?.equityAfter != null && (
              <div className="result-item">
                <span className="result-label">{t.equityLabel}</span>
                <ResultValue
                  className={
                    result.equityAfter <= 0 ? 'value-highlight' : 'value-success'
                  }
                >
                  {formatMu(result.equityAfter) + t.unitUSD}
                </ResultValue>
              </div>
            )}
            <div className="result-item">
              <span className="result-label">{t.statusLabel}</span>
              <ResultValue
                className={
                  result?.statusClass === 'approved'
                    ? 'approved'
                    : result?.statusClass === 'denied'
                      ? 'denied'
                      : ''
                }
              >
                {result ? tMu(lang, result.statusKey) : '—'}
              </ResultValue>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
