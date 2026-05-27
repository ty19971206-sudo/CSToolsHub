import { useCallback, useEffect, useState, startTransition, type ReactNode } from 'react';
import { getStoredLang, setStoredLang, type Lang } from './i18n';

declare global {
  interface Window {
    __ATCS_LANG?: Lang;
  }
}

function readLang(): Lang {
  if (typeof window !== 'undefined' && window.__ATCS_LANG) return window.__ATCS_LANG;
  return getStoredLang();
}

/** Event-based lang hook — works across separate Astro client islands. */
export function useLang() {
  const [lang, setLangState] = useState<Lang>(readLang);

  useEffect(() => {
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<Lang>).detail;
      if (detail) setLangState(detail);
    };
    window.addEventListener('atcs-lang-change', onChange);
    return () => window.removeEventListener('atcs-lang-change', onChange);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setStoredLang(next);
    document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en';
    window.__ATCS_LANG = next;
    startTransition(() => {
      setLangState(next);
      window.dispatchEvent(new CustomEvent('atcs-lang-change', { detail: next }));
    });
  }, []);

  return { lang, setLang };
}

/** @deprecated Provider not required; kept for API compatibility */
export function LangProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
