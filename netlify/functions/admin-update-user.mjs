import { createClient } from '@supabase/supabase-js';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(statusCode, body) {
  return { statusCode, headers: { ...cors, 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors, body: '' };
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

  const url = process.env.PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !serviceKey || !anonKey) {
    return json(500, { error: 'Server missing Supabase configuration (SERVICE_ROLE_KEY required)' });
  }

  const token = (event.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) return json(401, { error: 'Missing authorization' });

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }

  const { user_id: userId, email, display_name: displayName } = payload;
  if (!userId) return json(400, { error: 'user_id required' });

  const hasEmail = typeof email === 'string' && email.trim().length > 0;
  const hasName = typeof displayName === 'string';
  if (!hasEmail && !hasName) return json(400, { error: 'email or display_name required' });

  if (hasEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return json(400, { error: 'invalid email' });
  }

  const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

  const { data: caller, error: callerErr } = await admin.auth.getUser(token);
  if (callerErr || !caller?.user) return json(401, { error: 'Invalid session' });

  const { data: callerProfile } = await admin
    .from('profiles')
    .select('role')
    .eq('id', caller.user.id)
    .maybeSingle();

  if (callerProfile?.role !== 'admin') return json(403, { error: 'Admin only' });

  const authPatch = {};
  if (hasEmail) {
    authPatch.email = email.trim();
    authPatch.email_confirm = true;
  }
  if (hasName) {
    authPatch.user_metadata = { full_name: displayName.trim() };
  }

  if (Object.keys(authPatch).length > 0) {
    const { error: authErr } = await admin.auth.admin.updateUserById(userId, authPatch);
    if (authErr) return json(400, { error: authErr.message });
  }

  const profilePatch = { updated_at: new Date().toISOString() };
  if (hasEmail) profilePatch.email = email.trim();
  if (hasName) profilePatch.display_name = displayName.trim() || null;

  const { error: profileErr } = await admin.from('profiles').update(profilePatch).eq('id', userId);
  if (profileErr) return json(400, { error: profileErr.message });

  await admin.from('audit_logs').insert({
    user_id: caller.user.id,
    action: 'user.profile.update',
    meta: {
      target_user_id: userId,
      ...(hasEmail ? { email: email.trim() } : {}),
      ...(hasName ? { display_name: displayName.trim() } : {}),
    },
  });

  return json(200, { id: userId });
}
