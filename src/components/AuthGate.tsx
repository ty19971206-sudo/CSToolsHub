import { useEffect, useState, type ReactNode } from 'react';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase/client';

export default function AuthGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!isSupabaseConfigured());
  const [authed, setAuthed] = useState(!isSupabaseConfigured());

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    if (window.location.pathname.startsWith('/login')) {
      setAuthed(true);
      setReady(true);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setAuthed(true);
        setReady(true);
      } else {
        const next = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        window.location.href = next;
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAuthed(true);
        setReady(true);
      } else {
        window.location.href = '/login/';
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  if (!ready) {
    return (
      <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading…
      </div>
    );
  }

  if (!authed) return null;
  return <>{children}</>;
}
