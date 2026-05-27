import { useEffect, useState, type ReactNode } from 'react';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase/client';

export default function AuthGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(!isSupabaseConfigured());

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    if (window.location.pathname.startsWith('/login')) {
      setAuthed(true);
      return;
    }

    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setAuthed(true);
        return;
      }
      const next = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      window.location.href = next;
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setAuthed(true);
      else if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login/';
      }
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  if (!isSupabaseConfigured()) return <>{children}</>;
  if (!authed) return null;
  return <>{children}</>;
}
