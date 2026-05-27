import type { EquityTierId } from './equityTier';

export type AccountLeverage = '100' | '200' | '400' | '1000';

export type OrderSide = 'buy' | 'sell';

export type ProductSpec = {
  code: string;
  name: string;
  contractUnit: number;
  contractUnitRaw: string;
  contractUnitHint: string;
  quoteCurrency: string | null;
  maxLeverage: number | null;
};

export type CalcModes = {
  margin: boolean;
  pnl: boolean;
  marginLevel: boolean;
};

export type OrderInput = {
  id: string;
  productCode: string;
  side: OrderSide;
  openPrice: string;
  closePrice: string;
  lots: string;
  preCloseHour: boolean;
  /** Pair code → rate, e.g. { USDJPY: "150" } */
  fxRates: Record<string, string>;
};

export type GlobalInput = {
  balance: string;
  accountLeverage: AccountLeverage;
  /** Rule B tier when calculating margin without balance-based margin level */
  equityTier: EquityTierId;
  calcModes: CalcModes;
};

export type LeverageRule = 'A' | 'B' | 'C';

export type OrderComputed = {
  id: string;
  valid: boolean;
  margin: number | null;
  marginDisplay: string;
  pnl: number | null;
  pnlDisplay: string;
  effectiveLeverage: number | null;
  leverageRule: LeverageRule | null;
  marginCurrency: string | null;
  pnlCurrency: string | null;
  fxMissing: boolean;
  fxRequirements: Array<{ pair: string; op: 'divide' | 'multiply'; amountCurrency: string }>;
};

export type PortfolioResult = {
  orders: OrderComputed[];
  rawTotalMargin: number | null;
  totalMargin: number | null;
  hedgeSaving: number | null;
  hasHedge: boolean;
  totalPnL: number | null;
  equity: number | null;
  marginLevel: number | null;
  leverageUsage: number | null;
  freeMargin: number | null;
};

