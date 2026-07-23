import { getSupabase } from './supabase/client';

export function getAuthRedirectOrigin() {
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}

export async function signOut() {
  const supabase = getSupabase();
  if (!supabase) return;
  await supabase.auth.signOut();
  window.location.href = '/';
}

export async function sendPasswordResetEmail(email: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const redirectTo = `${getAuthRedirectOrigin()}/auth/reset-password/`;
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
  if (error) throw error;
}

export async function updatePassword(newPassword: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}
