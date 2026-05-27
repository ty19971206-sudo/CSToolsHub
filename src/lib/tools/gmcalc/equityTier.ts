import type { AccountLeverage } from './types';

export type EquityTierId =
  | '1000_l10k'
  | '1000_m10k100k'
  | '1000_g100k'
  | '400_l100k'
  | '400_g100k'
  | '200_l100k'
  | '200_g100k'
  | '100_any';

/** Representative equity (USD) for Rule B dynamic leverage tiers */
export function equityValueFromTier(tier: EquityTierId): number {
  switch (tier) {
    case '1000_l10k':
      return 8_000;
    case '1000_m10k100k':
      return 50_000;
    case '1000_g100k':
      return 150_000;
    case '400_l100k':
    case '200_l100k':
      return 50_000;
    case '400_g100k':
    case '200_g100k':
      return 150_000;
    case '100_any':
      return 50_000;
    default:
      return 50_000;
  }
}

/** Rule B leverage implied by each equity tier (must match dynamic tier table) */
export function dynamicLeverageFromTier(tier: EquityTierId): number {
  switch (tier) {
    case '1000_l10k':
      return 1000;
    case '1000_m10k100k':
      return 400;
    case '1000_g100k':
      return 200;
    case '400_l100k':
      return 400;
    case '400_g100k':
      return 200;
    case '200_l100k':
      return 200;
    case '200_g100k':
      return 200;
    case '100_any':
      return 100;
    default:
      return 400;
  }
}

export function firstEquityTier(accountLeverage: AccountLeverage): EquityTierId {
  return tiersForAccountLeverage(accountLeverage)[0];
}

export function defaultEquityTier(accountLeverage: AccountLeverage): EquityTierId {
  return firstEquityTier(accountLeverage);
}

/** 1:100 / 1:200 accounts use fixed leverage — no equity tier picker (Rule B dynamic tiers) */
export function usesDynamicEquityTier(accountLeverage: AccountLeverage): boolean {
  return accountLeverage === '400' || accountLeverage === '1000';
}

export function tiersForAccountLeverage(
  accountLeverage: AccountLeverage
): EquityTierId[] {
  switch (accountLeverage) {
    case '1000':
      return ['1000_l10k', '1000_m10k100k', '1000_g100k'];
    case '400':
      return ['400_l100k', '400_g100k'];
    case '200':
      return ['200_l100k', '200_g100k'];
    case '100':
      return ['100_any'];
    default:
      return ['400_l100k', '400_g100k'];
  }
}

export function coerceEquityTier(
  accountLeverage: AccountLeverage,
  tier: EquityTierId
): EquityTierId {
  const allowed = tiersForAccountLeverage(accountLeverage);
  return allowed.includes(tier) ? tier : defaultEquityTier(accountLeverage);
}
