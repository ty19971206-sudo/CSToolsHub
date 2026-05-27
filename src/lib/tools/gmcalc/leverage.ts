import { dynamicLeverageFromTier, type EquityTierId } from './equityTier';
import type { AccountLeverage, LeverageRule, ProductSpec } from './types';

const SPOT_GOLD_CODES = new Set(['XAUUSD', 'XAUEUR']);

/** Rule C: spot gold (XAUUSD/XAUEUR) or crude oil, pre-close hour */
export function isPreCloseLeverageProduct(code: string): boolean {
  const c = code.toUpperCase();
  if (c === 'XAUUSD' || c === 'XAUEUR') return true;
  if (c.startsWith('USOIL') || c.startsWith('UKOIL')) return true;
  if (c.includes('OIL') && !c.includes('SOIL')) return true;
  return false;
}

/** Major/minor FX (no product cap) + spot gold — Rule B dynamic tiers for 1:400 / 1:1000 groups */
export function isDynamicLeverageProduct(product: ProductSpec): boolean {
  const code = product.code.toUpperCase();
  if (SPOT_GOLD_CODES.has(code)) return true;
  if (product.maxLeverage != null && product.maxLeverage > 0) return false;
  const base = code.replace(/[._-].*$/, '');
  return /^[A-Z]{6}$/.test(base);
}

export function isDynamicLeverageAccount(accountLeverage: AccountLeverage): boolean {
  return accountLeverage === '400' || accountLeverage === '1000';
}

/**
 * Rule B — dynamic leverage by account equity (USD).
 * Only for 1:400 and 1:1000 account groups.
 */
export function resolveDynamicLeverage(equity: number, accountLeverage: AccountLeverage): number {
  switch (accountLeverage) {
    case '1000':
      if (equity <= 10_000) return 1000;
      if (equity <= 100_000) return 400;
      return 200;
    case '400':
      if (equity <= 100_000) return 400;
      return 200;
    default:
      return Number(accountLeverage);
  }
}

export function resolveLeverage(params: {
  product: ProductSpec;
  equity: number;
  accountLeverage: AccountLeverage;
  preCloseHour: boolean;
  equityTier?: EquityTierId;
  useTierLeverage?: boolean;
}): { leverage: number; rule: LeverageRule } {
  const { product, equity, accountLeverage, preCloseHour, equityTier, useTierLeverage } =
    params;
  const accountLevNum = Number(accountLeverage);

  // Rule C — last session hour before weekly close (new orders / triggered pendings)
  if (preCloseHour && isPreCloseLeverageProduct(product.code)) {
    return { leverage: 50, rule: 'C' };
  }

  const dynamicAccount = isDynamicLeverageAccount(accountLeverage);

  // Rule B — dynamic tiers (1:400 / 1:1000 only; major/minor FX + spot gold)
  if (dynamicAccount && isDynamicLeverageProduct(product)) {
    const leverage =
      useTierLeverage && equityTier
        ? dynamicLeverageFromTier(equityTier)
        : resolveDynamicLeverage(equity, accountLeverage);
    return { leverage, rule: 'B' };
  }

  // 1:100 / 1:200 — fixed account leverage on all products
  if (accountLeverage === '100' || accountLeverage === '200') {
    return { leverage: accountLevNum, rule: 'B' };
  }

  // Rule A — product max leverage (indices, exotics, oil, silver, etc.)
  if (product.maxLeverage != null && product.maxLeverage > 0) {
    return { leverage: product.maxLeverage, rule: 'A' };
  }

  // Fallback: account leverage for non-dynamic products on 400/1000 groups
  if (dynamicAccount) {
    return {
      leverage: resolveDynamicLeverage(equity, accountLeverage),
      rule: 'B',
    };
  }

  return { leverage: accountLevNum, rule: 'B' };
}
