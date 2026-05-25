export type Lang = 'zh' | 'en';

export const LANG_STORAGE_KEY = 'atcs_global_lang';

export const navTranslations = {
  zh: {
    orderInquiry: '订单查询',
    fundManagement: '资金管理',
    quiz: '知识测试',
    orderOptions: {
      MailCraft: '邮件助手',
      'MT4 TP': 'MT4 止盈滑点',
      'MT5 TP': 'MT5 止盈滑点',
    },
    fundOptions: {
      'MU Credit': 'MU 信用额计算器',
    },
    quizCategories: [
      { key: 'Industry Terminology', slug: 'industry-terminology', label: '行业术语', icon: '📚' },
      { key: 'Company Background', slug: 'company-background', label: '公司背景', icon: '🏢' },
      { key: 'Trading Knowledge', slug: 'trading-knowledge', label: '交易知识', icon: '📖' },
      { key: 'Product Knowledge', slug: 'product-knowledge', label: '产品知识', icon: '📦' },
      { key: 'Trading Groups', slug: 'trading-groups', label: '交易组别', icon: '👥' },
      { key: 'Trading Calculations', slug: 'trading-calculations', label: '交易计算', icon: '🧮' },
      { key: 'Trading Software', slug: 'trading-software', label: '交易软件', icon: '💻' },
      { key: 'Simulation', slug: 'simulation', label: '情景模拟', icon: '🎮' },
      { key: 'Account Opening Process', slug: 'account-opening-process', label: '开户流程', icon: '📄' },
      { key: 'Deposit and Withdrawal Process', slug: 'deposit-and-withdrawal-process', label: '出入金流程', icon: '💳' },
      { key: 'Daily Workflow', slug: 'daily-workflow', label: '日常工作流程', icon: '⏰' },
      { key: 'Commission Settings', slug: 'commission-settings', label: '佣金设置', icon: '⚙️' },
    ],
  },
  en: {
    orderInquiry: 'Order Inquiry',
    fundManagement: 'Fund Management',
    quiz: 'Quiz',
    orderOptions: {
      MailCraft: 'MailCraft',
      'MT4 TP': 'MT4 TP',
      'MT5 TP': 'MT5 TP',
    },
    fundOptions: {
      'MU Credit': 'MU Credit',
    },
    quizCategories: [
      { key: 'Industry Terminology', slug: 'industry-terminology', label: 'Industry Terminology', icon: '📚' },
      { key: 'Company Background', slug: 'company-background', label: 'Company Background', icon: '🏢' },
      { key: 'Trading Knowledge', slug: 'trading-knowledge', label: 'Trading Knowledge', icon: '📖' },
      { key: 'Product Knowledge', slug: 'product-knowledge', label: 'Product Knowledge', icon: '📦' },
      { key: 'Trading Groups', slug: 'trading-groups', label: 'Trading Groups', icon: '👥' },
      { key: 'Trading Calculations', slug: 'trading-calculations', label: 'Trading Calculations', icon: '🧮' },
      { key: 'Trading Software', slug: 'trading-software', label: 'Trading Software', icon: '💻' },
      { key: 'Simulation', slug: 'simulation', label: 'Simulation', icon: '🎮' },
      { key: 'Account Opening Process', slug: 'account-opening-process', label: 'Account Opening Process', icon: '📄' },
      { key: 'Deposit and Withdrawal Process', slug: 'deposit-and-withdrawal-process', label: 'Deposit and Withdrawal Process', icon: '💳' },
      { key: 'Daily Workflow', slug: 'daily-workflow', label: 'Daily Workflow', icon: '⏰' },
      { key: 'Commission Settings', slug: 'commission-settings', label: 'Commission Settings', icon: '⚙️' },
    ],
  },
} as const;

export const homeTranslations = {
  zh: {
    badge: 'ATCS',
    title: 'Tools Hub',
    subtitle: '',
    orderTools: '📌 查单工具',
    fundTools: '💰 资金管理',
    quizSection: '📚 知识测试',
    quizCardTitle: '选择测试类别',
    quizCardDesc: '点击下方任意主题，即可开始随机抽题测试（10题/套，支持中英文）。',
    footer: '⚡ 提示：您也可以使用顶部导航栏的下拉菜单快速切换工具。',
    cards: {
      mail: { title: '邮件助手', desc: '邮件编辑与模板工具，快速生成交易查询相关邮件。' },
      mt4: { title: 'MT4 TP', desc: 'MT4 止盈滑点查询。' },
      mt5: { title: 'MT5 TP', desc: 'MT5 止盈滑点查询。' },
      mu: { title: 'MU 信用额度计算器', desc: '信用额与仓位计算器。' },
    },
  },
  en: {
    badge: 'ATCS',
    title: 'Tools Hub',
    subtitle: '',
    orderTools: '📌 Order Inquiry Tools',
    fundTools: '💰 Fund Management',
    quizSection: '📚 Knowledge Quiz',
    quizCardTitle: 'Select Quiz Category',
    quizCardDesc: 'Click any topic below to start a random 10-question test (bilingual support).',
    footer: '⚡ Tip: You can also use the dropdown menus in the top navigation bar.',
    cards: {
      mail: { title: 'MailCraft', desc: 'Email editing and template tool for quickly generating trading inquiry emails.' },
      mt4: { title: 'MT4 TP', desc: 'Take-Profit Slippage Lookup Tool for MT4.' },
      mt5: { title: 'MT5 TP', desc: 'Take-Profit Slippage Lookup Tool for MT5.' },
      mu: { title: 'MU Credit', desc: 'Credit and position Calculator.' },
    },
  },
} as const;

export function getStoredLang(): Lang {
  if (typeof localStorage === 'undefined') return 'zh';
  const v = localStorage.getItem(LANG_STORAGE_KEY);
  return v === 'en' ? 'en' : 'zh';
}

export function setStoredLang(lang: Lang) {
  localStorage.setItem(LANG_STORAGE_KEY, lang);
}

export function getQuizCategoryBySlug(slug: string) {
  for (const lang of ['zh', 'en'] as const) {
    const found = navTranslations[lang].quizCategories.find((c) => c.slug === slug);
    if (found) return found;
  }
  return navTranslations.zh.quizCategories[0];
}

export function getQuizSlugFromKey(key: string) {
  const found = navTranslations.en.quizCategories.find((c) => c.key === key);
  return found?.slug ?? 'industry-terminology';
}
