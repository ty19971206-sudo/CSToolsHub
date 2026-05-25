import type { QuizCategoryKey } from './types';

export const categoryNames: Record<
  QuizCategoryKey,
  { zh: string; en: string }
> = {
  'Industry Terminology': { zh: '行业术语', en: 'Industry Terminology' },
  'Company Background': { zh: '公司背景', en: 'Company Background' },
  'Trading Knowledge': { zh: '交易知識', en: 'Trading Knowledge' },
  'Product Knowledge': { zh: '产品知識', en: 'Product Knowledge' },
  'Trading Groups': { zh: '交易组别', en: 'Trading Groups' },
  'Trading Calculations': { zh: '交易计算', en: 'Trading Calculations' },
  'Trading Software': { zh: '交易软件', en: 'Trading Software' },
  Simulation: { zh: '情景模拟', en: 'Simulation' },
  'Account Opening Process': { zh: '开户流程', en: 'Account Opening Process' },
  'Deposit and Withdrawal Process': { zh: '出入金流程', en: 'Deposit and Withdrawal Process' },
  'Daily Workflow': { zh: '日常工作流程', en: 'Daily Workflow' },
  'Commission Settings': { zh: '佣金设置', en: 'Commission Settings' },
};
