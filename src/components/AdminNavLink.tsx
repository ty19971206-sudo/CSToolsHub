import { useEffect, useState } from 'react';
import { fetchProfile, isEditorOrAdmin } from '../lib/profile';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase/client';

export default function AdminNavLink() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = getSupabase();
    if (!supabase) return;

    let cancelled = false;
    const refresh = () => {
      void fetchProfile().then((p) => {
        if (!cancelled) setShow(Boolean(p && isEditorOrAdmin(p.role)));
      });
    };

    refresh();
    void supabase.auth.getSession().then(() => {
      if (!cancelled) refresh();
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      if (session) refresh();
      else setShow(false);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (!show) return null;

  return (
    <a className="nav-btn admin-nav-link" href="/tools/admin/">
      <span className="i18n-zh">管理</span>
      <span className="i18n-en">Admin</span>
    </a>
  );
}
