import type { Lang } from './i18n';
import { getSupabase } from './supabase/client';

export type UserProfile = {
  id: string;
  email: string | null;
  display_name: string | null;
  lang: Lang;
  role: 'user' | 'editor' | 'admin';
};

export async function fetchProfile(): Promise<UserProfile | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data: sessionData } = await supabase.auth.getSession();
  let userId = sessionData.session?.user?.id;
  if (!userId) {
    const { data: user } = await supabase.auth.getUser();
    userId = user.user?.id;
  }
  if (!userId) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, display_name, lang, role')
    .eq('id', userId)
    .maybeSingle();
  if (error || !data) return null;
  return {
    id: data.id,
    email: data.email,
    display_name: data.display_name,
    lang: data.lang === 'en' ? 'en' : 'zh',
    role: data.role as UserProfile['role'],
  };
}

export async function updateProfileLang(lang: Lang) {
  const supabase = getSupabase();
  if (!supabase) return;
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return;
  await supabase.from('profiles').update({ lang, updated_at: new Date().toISOString() }).eq('id', user.user.id);
}

export function isEditorOrAdmin(role: string | null | undefined) {
  return role === 'editor' || role === 'admin';
}
