import { useEffect, useState, type ReactNode } from 'react';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase/client';

function scheduleIdle(task: () => void): () => void {
  if (typeof requestIdleCallback !== 'undefined') {
    const id = requestIdleCallback(task, { timeout: 1500 });
    return () => cancelIdleCallback(id);
  }
  const t = window.setTimeout(task, 1);
  return () => clearTimeout(t);
}

export default function AuthGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(!isSupabaseConfigured());

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    if (window.location.pathname.startsWith('/login')) {
      setAuthed(true);
      return;
    }

    const cancel = scheduleIdle(() => {
      void supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          setAuthed(true);
          return;
        }
        const next = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        window.location.href = next;
      });
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setAuthed(true);
      else if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login/';
      }
    });

    return () => {
      cancel();
      sub.subscription.unsubscribe();
    };
  }, []);

  if (!isSupabaseConfigured()) return <>{children}</>;
  if (!authed) return null;
  return <>{children}</>;
}
