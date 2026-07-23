import { useCallback, useSyncExternalStore, type ReactNode } from 'react';
import { getStoredLang, setStoredLang, type Lang } from './i18n';
import { updateProfileLang } from './profile';
import { isSupabaseConfigured } from './supabase/client';

declare global {
  interface Window {
    __ATCS_LANG?: Lang;
  }
}

function readLang(): Lang {
  if (typeof window !== 'undefined' && window.__ATCS_LANG) return window.__ATCS_LANG;
  return getStoredLang();
}

function subscribe(onStoreChange: () => void) {
  const handler = () => onStoreChange();
  window.addEventListener('atcs-lang-change', handler);
  return () => window.removeEventListener('atcs-lang-change', handler);
}

/** Event-based lang hook — works across separate Astro client islands. */
export function useLang() {
  const lang = useSyncExternalStore(subscribe, readLang, () => 'zh');

  const setLang = useCallback((next: Lang) => {
    setStoredLang(next);
    document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en';
    window.__ATCS_LANG = next;
    window.dispatchEvent(new CustomEvent('atcs-lang-change', { detail: next }));
    if (isSupabaseConfigured()) void updateProfileLang(next);
  }, []);

  return { lang, setLang };
}

/** @deprecated Provider not required; kept for API compatibility */
export function LangProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
