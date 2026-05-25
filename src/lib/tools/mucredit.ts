import type { Lang } from '../i18n';

export const mucreditI18n = {
  zh: {
    title: '信用额账户出金计算器',
    subtitle: '基于 Closing P&L + Floating P&L — 历史出金 · 自动判定信用额扣除与清钱规则',
    closingPL: 'Closing P&L',
    floatingPL: 'Floating P&L',
    histWithdrawal: '历史出金总额',
    balance: '当前余额 (Balance)',
    credit: '信用额 (Credit)',
    withdrawAmount: '申请出金额',
    hasPosition: '📌 账户当前有持仓（需校验预付款比例/净值）',
    usedMargin: '已用保证金 (Used Margin)',
    calcBtn: '计算出金结果',
    ruleNote:
      '<strong>ⓘ 核心规则：</strong> 可取资金 = Closing P&L + Floating P&L - 历史出金。<br>若可取资金 ≤ 0，出金多少即扣等额信用额（不超现有信用额）。<br>若出金后余额 ≤ 10 USD → 触发清钱，信用额全部清零。<br>持仓时：若保证金 > 0，预付款比例 < 100% 拒绝；若保证金 = 0，则处理后净值 ≤ 0 时拒绝。',
    resultTitle: '📋 计算结果',
    avLabel: '不扣信用额的可取资金 (AV)',
    needCreditLabel: '是否需要扣除信用额',
    creditDeductLabel: '扣除信用额金额',
    afterBalanceLabel: '处理后余额 (Balance)',
    afterCreditLabel: '处理后信用额 (Credit)',
    marginLevelLabel: '处理后预付款比例',
    equityLabel: '处理后净值 (Equity)',
    statusLabel: '✅ 出金状态',
    needYes: '是，需扣除',
    needNo: '否',
    statusApproved: '批准',
    statusDeniedMargin: '拒绝（预付款比例低于100%）',
    statusDeniedEquity: '拒绝（处理后净值 ≤ 0）',
    errorAmount: '出金额必须大于0',
    errorBalance: '余额不能为负数',
    errorCredit: '信用额不能为负数',
    errorMargin: '有持仓时必须填写已用保证金（可为0）',
    errorInsufficient: '余额及信用额不足以支付该出金额',
    unitUSD: ' USD',
    unitPercent: '%',
    placeholderClosingPL: '已平仓盈亏',
    placeholderFloatingPL: '浮动盈亏（有持仓时填写）',
    placeholderHistWithdrawal: '历史累计出金',
    placeholderBalance: '真实现金余额',
    placeholderCredit: '赠金/信用额度',
    placeholderWithdrawAmount: '本次出金金额',
    placeholderUsedMargin: '持仓时必填；若填0则改为检查净值>0',
  },
  en: {
    title: 'Credit Account Withdrawal Calculator',
    subtitle:
      'Based on Closing P&L + Floating P&L — Historical Withdrawal · Automatic credit deduction & clearance',
    closingPL: 'Closing P&L',
    floatingPL: 'Floating P&L',
    histWithdrawal: 'Historical Withdrawal',
    balance: 'Balance',
    credit: 'Credit',
    withdrawAmount: 'Withdrawal Amount',
    hasPosition: '📌 Has open positions (Margin level/Equity check)',
    usedMargin: 'Used Margin',
    calcBtn: 'Calculate Withdrawal',
    ruleNote:
      '<strong>ⓘ Core Rules:</strong> Available = Closing P&L + Floating P&L - Historical Withdrawal.<br>If Available ≤ 0, withdrawal amount is deducted from credit (up to available credit).<br>If post-withdrawal balance ≤ 10 USD → Clearance, credit fully deducted.<br>With positions: if Margin > 0, reject if Margin Level < 100%; if Margin = 0, reject if Equity ≤ 0.',
    resultTitle: '📋 Calculation Result',
    avLabel: 'Available without Credit (AV)',
    needCreditLabel: 'Need Credit Deduction',
    creditDeductLabel: 'Credit Deduction Amount',
    afterBalanceLabel: 'Balance After',
    afterCreditLabel: 'Credit After',
    marginLevelLabel: 'Margin Level After',
    equityLabel: 'Equity After',
    statusLabel: '✅ Withdrawal Status',
    needYes: 'Yes, deduction required',
    needNo: 'No',
    statusApproved: 'Approved',
    statusDeniedMargin: 'Rejected (Margin level below 100%)',
    statusDeniedEquity: 'Rejected (Equity after ≤ 0)',
    errorAmount: 'Withdrawal amount must be > 0',
    errorBalance: 'Balance cannot be negative',
    errorCredit: 'Credit cannot be negative',
    errorMargin: 'Used margin is required when positions exist (can be 0)',
    errorInsufficient: 'Balance and credit insufficient',
    unitUSD: ' USD',
    unitPercent: '%',
    placeholderClosingPL: 'Closed P&L',
    placeholderFloatingPL: 'Floating P&L (if positions exist)',
    placeholderHistWithdrawal: 'Total historical withdrawals',
    placeholderBalance: 'Real cash balance',
    placeholderCredit: 'Bonus / Credit',
    placeholderWithdrawAmount: 'Requested withdrawal',
    placeholderUsedMargin: 'Required if positions; 0 = equity check',
  },
} as const;

export type MuCreditInput = {
  closingPL: number;
  floatingPL: number;
  historicalWithdrawal: number;
  balance: number;
  credit: number;
  withdrawalAmount: number;
  hasPosition: boolean;
  usedMargin: number;
  usedMarginProvided: boolean;
};

export type MuCreditResult = {
  av: number;
  needDeduct: boolean;
  creditDeduct: number;
  afterBalance: number;
  afterCredit: number;
  marginLevel: number | null;
  equityAfter: number | null;
  statusKey: 'statusApproved' | 'statusDeniedMargin' | 'statusDeniedEquity';
  statusClass: 'approved' | 'denied';
};

export type MuCreditError =
  | 'errorAmount'
  | 'errorBalance'
  | 'errorCredit'
  | 'errorMargin'
  | 'errorInsufficient';

export function calculateMuCredit(input: MuCreditInput): {
  result?: MuCreditResult;
  error?: MuCreditError;
} {
  const {
    closingPL,
    floatingPL,
    historicalWithdrawal,
    balance,
    credit,
    withdrawalAmount,
    hasPosition,
    usedMargin,
    usedMarginProvided,
  } = input;

  if (withdrawalAmount <= 0) return { error: 'errorAmount' };
  if (balance < 0) return { error: 'errorBalance' };
  if (credit < 0) return { error: 'errorCredit' };
  if (hasPosition && !usedMarginProvided) return { error: 'errorMargin' };

  const av = closingPL + floatingPL - historicalWithdrawal;
  let needDeduct = false;
  let creditDeduct = 0;
  let afterBalance = balance - withdrawalAmount;
  let afterCredit = credit;
  let marginLevel: number | null = null;
  let equityAfter: number | null = null;
  let statusKey: MuCreditResult['statusKey'] = 'statusApproved';
  let statusClass: MuCreditResult['statusClass'] = 'approved';

  if (av > 0 && withdrawalAmount <= av) {
    needDeduct = false;
    creditDeduct = 0;
    afterBalance = balance - withdrawalAmount;
    afterCredit = credit;
  } else {
    needDeduct = true;
    const requiredCredit = av > 0 ? withdrawalAmount - av : withdrawalAmount;
    const balanceTemp = balance - withdrawalAmount;
    if (balanceTemp <= 10) {
      creditDeduct = credit;
      afterCredit = 0;
      afterBalance = balanceTemp;
    } else {
      creditDeduct = Math.min(requiredCredit, credit);
      afterCredit = credit - creditDeduct;
      afterBalance = balanceTemp;
    }
  }

  if (afterBalance < 0) return { error: 'errorInsufficient' };

  if (hasPosition) {
    equityAfter = afterBalance + floatingPL + afterCredit;
    if (usedMargin > 0) {
      marginLevel = (equityAfter / usedMargin) * 100;
      if (marginLevel < 100) {
        statusKey = 'statusDeniedMargin';
        statusClass = 'denied';
      }
    } else if (equityAfter <= 0) {
      statusKey = 'statusDeniedEquity';
      statusClass = 'denied';
    }
  }

  return {
    result: {
      av,
      needDeduct,
      creditDeduct,
      afterBalance,
      afterCredit,
      marginLevel,
      equityAfter,
      statusKey,
      statusClass,
    },
  };
}

export function tMu(lang: Lang, key: keyof (typeof mucreditI18n)['zh']) {
  return mucreditI18n[lang][key];
}

export function formatMu(n: number | null | undefined, digits = 2) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  return Number(n).toFixed(digits);
}
