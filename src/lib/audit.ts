import { getSupabase } from './supabase/client';

export async function logAudit(action: string, meta: Record<string, unknown> = {}) {
  const supabase = getSupabase();
  if (!supabase) return;
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return;
  const { error } = await supabase.from('audit_logs').insert({
    user_id: user.user.id,
    action,
    meta,
  });
  if (error) console.warn('[audit]', action, error.message);
}
