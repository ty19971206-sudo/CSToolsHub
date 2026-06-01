import type { Lang } from './i18n';

const NEWS_TIME_ZONE = 'Asia/Taipei';

/** Stable across SSR and browser with a fixed UTC+8 timezone. */
export function formatNewsDateTime(iso: string, lang: Lang): string {
  const locale = lang === 'zh' ? 'zh-CN' : 'en-US';
  const dateTime = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: NEWS_TIME_ZONE,
    hour12: true,
  }).format(new Date(iso));

  return lang === 'zh' ? `${dateTime}（UTC+8，12小时制）` : `${dateTime} (UTC+8, 12h)`;
}
