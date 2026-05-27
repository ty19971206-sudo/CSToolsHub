const SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  HKD: 'HK$',
  CNH: '¥',
  AUD: 'A$',
};

export function formatMoney(value: number, currency = 'USD', decimals = 2): string {
  const sym = SYMBOLS[currency] ?? `${currency} `;
  const n = value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  if (SYMBOLS[currency]) return `${sym}${n}`;
  return `${n} ${currency}`;
}

export function formatPercent(value: number, decimals = 2): string {
  return `${value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}%`;
}

export function formatLeverageDisplay(leverage: number): string {
  return `1:${leverage}`;
}

export type MarginLevelTone = 'safe' | 'warning' | 'danger';

/** Margin level traffic light: >100% green, ≤100% yellow, ≤30% red */
export function marginLevelTone(value: number | null | undefined): MarginLevelTone | null {
  if (value == null || !Number.isFinite(value)) return null;
  if (value <= 30) return 'danger';
  if (value <= 100) return 'warning';
  return 'safe';
}

export type PnlTone = 'profit' | 'loss' | 'flat';

export function pnlTone(value: number | null | undefined): PnlTone | null {
  if (value == null || !Number.isFinite(value)) return null;
  if (value > 0) return 'profit';
  if (value < 0) return 'loss';
  return 'flat';
}

/** Signed P&L for display (+ prefix on profit; loss keeps minus from formatMoney) */
export function formatSignedMoney(value: number, currency = 'USD', decimals = 2): string {
  if (value > 0) return `+${formatMoney(value, currency, decimals)}`;
  return formatMoney(value, currency, decimals);
}
