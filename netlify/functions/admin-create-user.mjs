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

  const { email, password, role = 'user', display_name: displayName } = payload;
  if (!email || !password) return json(400, { error: 'email and password required' });
  if (password.length < 6) return json(400, { error: 'password must be at least 6 characters' });
  if (!['user', 'editor', 'admin'].includes(role)) return json(400, { error: 'invalid role' });

  const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

  const { data: caller, error: callerErr } = await admin.auth.getUser(token);
  if (callerErr || !caller?.user) return json(401, { error: 'Invalid session' });

  const { data: callerProfile } = await admin
    .from('profiles')
    .select('role')
    .eq('id', caller.user.id)
    .maybeSingle();

  if (callerProfile?.role !== 'admin') return json(403, { error: 'Admin only' });

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: displayName ? { full_name: displayName } : undefined,
  });

  if (createErr) return json(400, { error: createErr.message });

  const userId = created.user?.id;
  if (!userId) return json(500, { error: 'User created but no id returned' });

  if (role !== 'user' || displayName) {
    await admin
      .from('profiles')
      .update({
        role,
        ...(displayName ? { display_name: displayName } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);
  }

  await admin.from('audit_logs').insert({
    user_id: caller.user.id,
    action: 'user.create',
    meta: { email, role, created_user_id: userId },
  });

  return json(200, { id: userId, email });
}
