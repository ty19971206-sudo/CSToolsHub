import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { getStoredLang, setStoredLang, type Lang } from './i18n';

/** Event-based lang hook — works across separate Astro client islands. */
export function useLang() {
  const [lang, setLangState] = useState<Lang>('zh');

  useEffect(() => {
    setLangState(getStoredLang());
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<Lang>).detail;
      if (detail) setLangState(detail);
    };
    window.addEventListener('atcs-lang-change', onChange);
    return () => window.removeEventListener('atcs-lang-change', onChange);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    setStoredLang(next);
    document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en';
    window.__ATCS_LANG = next;
    window.dispatchEvent(new CustomEvent('atcs-lang-change', { detail: next }));
  }, []);

  return { lang, setLang };
}

/** @deprecated Provider not required; kept for API compatibility */
export function LangProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
