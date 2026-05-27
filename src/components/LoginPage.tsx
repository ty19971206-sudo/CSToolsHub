import { useEffect, useState } from 'react';
import { isAuthRequired } from '../lib/auth';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase/client';
import './login.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthRequired()) window.location.replace('/');
  }, []);

  if (!isAuthRequired()) {
    return (
      <div className="login-page">
        <div className="login-card">
          <p>正在返回首页…</p>
        </div>
      </div>
    );
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h1>Supabase 未配置</h1>
          <p>请在 Netlify 设置 PUBLIC_SUPABASE_URL 与 PUBLIC_SUPABASE_ANON_KEY。</p>
          <a href="/">返回首页</a>
        </div>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const supabase = getSupabase();
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect') || '/';
    window.location.href = redirect;
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={onSubmit}>
        <h1>ATCS Tools 登录</h1>
        <p>使用内部账号登录以访问工具与测验记录。</p>
        <label>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {message && <div className="login-error">{message}</div>}
        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? '登录中…' : '登录'}
        </button>
      </form>
    </div>
  );
}
