import { logAudit } from './audit';
import { getSupabase } from './supabase/client';
import type { UserProfile } from './profile';

export type ProfileRow = UserProfile & { created_at?: string };

export async function fetchAllProfiles(): Promise<ProfileRow[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, display_name, lang, role, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    email: r.email,
    display_name: r.display_name,
    lang: r.lang === 'en' ? 'en' : 'zh',
    role: r.role as UserProfile['role'],
    created_at: r.created_at,
  }));
}

export async function updateUserRole(userId: string, role: UserProfile['role']) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.from('profiles').update({ role }).eq('id', userId);
  if (error) throw error;
  await logAudit('user.role.update', { user_id: userId, role });
}

export async function updateUserAsAdmin(params: {
  userId: string;
  email?: string;
  displayName?: string;
}) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { data: session } = await supabase.auth.getSession();
  const token = session.session?.access_token;
  if (!token) throw new Error('Not logged in');

  const body: Record<string, string> = { user_id: params.userId };
  if (params.email !== undefined) body.email = params.email.trim();
  if (params.displayName !== undefined) body.display_name = params.displayName.trim();

  const res = await fetch('/.netlify/functions/admin-update-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
}

export async function createUserAsAdmin(params: {
  email: string;
  password: string;
  role: UserProfile['role'];
  displayName?: string;
}) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { data: session } = await supabase.auth.getSession();
  const token = session.session?.access_token;
  if (!token) throw new Error('Not logged in');

  const res = await fetch('/.netlify/functions/admin-create-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      email: params.email,
      password: params.password,
      role: params.role,
      display_name: params.displayName,
    }),
  });

  const body = (await res.json().catch(() => ({}))) as { error?: string; id?: string };
  if (!res.ok) throw new Error(body.error || `HTTP ${res.status}`);
  return body;
}
