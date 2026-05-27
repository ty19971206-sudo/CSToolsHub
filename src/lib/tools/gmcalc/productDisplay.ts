import type { Lang } from '../../i18n';
import type { ProductSpec } from './types';

const CURRENCY_EN: Record<string, string> = {
  EUR: 'Euro',
  USD: 'US Dollar',
  GBP: 'British Pound',
  CHF: 'Swiss Franc',
  AUD: 'Australian Dollar',
  NZD: 'New Zealand Dollar',
  CAD: 'Canadian Dollar',
  JPY: 'Japanese Yen',
  HUF: 'Hungarian Forint',
  PLN: 'Polish Zloty',
  CNH: 'Offshore Chinese Yuan',
  HKD: 'Hong Kong Dollar',
  SGD: 'Singapore Dollar',
  CZK: 'Czech Koruna',
  DKK: 'Danish Krone',
  MXN: 'Mexican Peso',
  NOK: 'Norwegian Krone',
  SEK: 'Swedish Krone',
  ZAR: 'South African Rand',
  XAU: 'Gold',
  XAG: 'Silver',
};

const PRODUCT_EN: Record<string, string> = {
  RKGCNH: 'Gold (gram) / CNH',
  GOLD_MMMYY: 'Gold Futures (CFD)',
  'USOIL.MMMYY': 'US Crude Oil Futures (CFD)',
  'UKOIL.MMMYY': 'UK Brent Oil Futures (CFD)',
  'NGAS.MMMYY': 'US Natural Gas Futures (CFD)',
  HG_MMMYY: 'Copper Futures (CFD)',
  CHI50: 'China A50 Index Spot (CFD)',
  HK50: 'Hang Seng 50 Index Spot (CFD)',
  HKCH50: 'Hang Seng China Enterprises Index Spot (CFD)',
  AUS200: 'Australia ASX 200 Index Spot (CFD)',
  EU50: 'EURO STOXX 50 Index Spot (CFD)',
  ESP35: 'Spain IBEX 35 Index Spot (CFD)',
  FRA40: 'France CAC 40 Index Spot (CFD)',
  GER30: 'Germany DAX 30 Index Spot (CFD)',
  IT40: 'Italy MIB 40 Index Spot (CFD)',
  JP225: 'Japan Nikkei 225 Index Spot (CFD)',
  UK100: 'UK FTSE 100 Index Spot (CFD)',
  US30: 'US Dow Jones 30 Index Spot (CFD)',
  NAS100: 'US Nasdaq 100 Index Spot (CFD)',
  SPX500: 'US S&P 500 Index Spot (CFD)',
  US2000: 'US Russell 2000 Index Spot (CFD)',
  USDX_MMMYY: 'US Dollar Index Futures (CFD)',
};

function currencyEn(code: string): string {
  return CURRENCY_EN[code] ?? code;
}

function englishNameFromCode(code: string): string {
  if (PRODUCT_EN[code]) return PRODUCT_EN[code];
  if (/^[A-Z]{6}$/.test(code)) {
    return `${currencyEn(code.slice(0, 3))} / ${currencyEn(code.slice(3))}`;
  }
  return code;
}

/** Localized product name for UI (spec `name` is Chinese from ATFX_GM_Spec) */
export function productDisplayName(product: ProductSpec, lang: Lang): string {
  if (lang === 'zh') return product.name;
  return englishNameFromCode(product.code);
}

export function productComboLabel(product: ProductSpec, lang: Lang): string {
  return `${product.code} — ${productDisplayName(product, lang)}`;
}
