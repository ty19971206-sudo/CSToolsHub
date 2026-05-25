export type QuizCategoryKey =
  | 'Industry Terminology'
  | 'Company Background'
  | 'Trading Knowledge'
  | 'Product Knowledge'
  | 'Trading Groups'
  | 'Trading Calculations'
  | 'Trading Software'
  | 'Simulation'
  | 'Account Opening Process'
  | 'Deposit and Withdrawal Process'
  | 'Daily Workflow'
  | 'Commission Settings';

export type QuizQuestion = {
  zh: { question: string; options: string[] };
  en: { question: string; options: string[] };
  correct: number;
};

export type QuizBank = Partial<Record<QuizCategoryKey, QuizQuestion[]>>;
