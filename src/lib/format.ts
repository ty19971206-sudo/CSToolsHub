import type { Lang } from './i18n';

/** Stable across SSR and browser (UTC) to avoid hydration text mismatches. */
export function formatNewsDateTime(iso: string, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    hour12: false,
  }).format(new Date(iso));
}
