import { useEffect, useRef } from 'react';
import { fetchProfile } from '../lib/profile';
import { getStoredLang, setStoredLang, type Lang } from '../lib/i18n';
import { isSupabaseConfigured } from '../lib/supabase/client';

/** On login, apply profile.lang to site language. */
export default function ProfileLangBootstrap() {
  const applied = useRef(false);

  useEffect(() => {
    if (!isSupabaseConfigured() || applied.current) return;

    void (async () => {
      const profile = await fetchProfile();
      if (!profile) return;
      applied.current = true;
      const stored = getStoredLang();
      const profileLang = profile.lang as Lang;
      if (profileLang !== stored) {
        setStoredLang(profileLang);
        document.documentElement.lang = profileLang === 'zh' ? 'zh-CN' : 'en';
        window.__ATCS_LANG = profileLang;
        window.dispatchEvent(new CustomEvent('atcs-lang-change', { detail: profileLang }));
      }
    })();
  }, []);

  return null;
}
