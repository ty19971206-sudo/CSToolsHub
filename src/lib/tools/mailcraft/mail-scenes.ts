export type MailSceneMeta = {
  id: string;
  icon: string;
  nameZh: string;
  nameEn: string;
  descZh: string;
  descEn: string;
  placeholders: string[];
};

export const MAIL_SCENES: MailSceneMeta[] = [
  {
    id: 'stop_loss_slippage',
    icon: '📉',
    nameZh: '止损滑点',
    nameEn: 'Stop Loss Slippage',
    descZh: '客户质疑止损成交价与设置价不符（市场跳空）。在 MailCraft 中选同一场景填写变量后生成邮件。',
    descEn: 'Client disputes stop fill vs set level (market gap). Use the same scene in MailCraft to fill variables.',
    placeholders: [
      'client_name',
      'account_number',
      'order_id',
      'trade_direction',
      'volume',
      'instrument',
      'stop_loss_price',
      'trigger_time',
      'filled_price',
      'your_name',
    ],
  },
  {
    id: 'margin_call_stop_out',
    icon: '💰',
    nameZh: '保证金强平',
    nameEn: 'Margin Call / Stop Out',
    descZh: '解释因保证金不足被强平的原因与账户数据。',
    descEn: 'Explain stop-out due to insufficient margin with account figures.',
    placeholders: [
      'client_name',
      'order_id',
      'instrument',
      'stop_out_time',
      'balance_before',
      'equity_before',
      'margin_level_before',
      'your_name',
    ],
  },
];

export function getMailScene(id: string) {
  return MAIL_SCENES.find((s) => s.id === id);
}

/** Sample values for admin preview only */
export function previewMailText(text: string) {
  const samples: Record<string, string> = {
    client_name: '张先生',
    account_number: '12345678',
    order_id: '987654',
    trade_direction: 'BUY',
    volume: '1.0',
    instrument: 'XAUUSD',
    stop_loss_price: '2331.21',
    trigger_time: '2024-01-15 10:30',
    filled_price: '2330.50',
    your_name: '客服姓名',
    stop_out_time: '2024-01-15 11:00',
    balance_before: '1000',
    equity_before: '50',
    margin_level_before: '45%',
    margin_level_after: '0%',
    trigger_reason: '保证金不足',
    direction_note: '（报价说明）',
    pre_gap_time: '10:29:59',
    pre_gap_price: '2331.00',
    gap_reason: '重要数据公布',
    news_link: 'https://example.com/news',
    favorable_example: '（有利跳空示例）',
  };
  return text.replace(/\{\{(\w+)\}\}/g, (_, key: string) => samples[key] ?? `[${key}]`);
}
