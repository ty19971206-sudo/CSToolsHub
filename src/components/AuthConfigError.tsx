import { isAuthRequired } from '../lib/auth';
import { isSupabaseConfigured } from '../lib/supabase/client';

export default function AuthConfigError() {
  if (!isAuthRequired() || isSupabaseConfigured()) return null;
  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: 480,
        margin: '4rem auto',
        textAlign: 'center',
        color: 'var(--text-primary, #e8ecf0)',
      }}
    >
      <h1>需要 Supabase 配置</h1>
      <p>
        已启用登录门禁（PUBLIC_AUTH_REQUIRED=true），但未配置 PUBLIC_SUPABASE_URL 与
        PUBLIC_SUPABASE_ANON_KEY。请在环境变量中设置后重新部署。
      </p>
      <p>
        <a href="/login/">返回登录页</a>
      </p>
    </div>
  );
}
