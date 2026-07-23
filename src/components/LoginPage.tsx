import { useEffect, useMemo, useState } from 'react';
import { isAuthRequired } from '../lib/auth';
import { sendPasswordResetEmail } from '../lib/auth-session';
import { useLang } from '../lib/lang-context';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase/client';
import LangSwitch from './LangSwitch';
import './login.css';
import './user-menu.css';

const copy = {
  zh: {
    title: 'ATCS Tools 登录',
    subtitle: '使用内部账号登录以访问工具与测验记录。',
    email: '邮箱',
    password: '密码',
    emailPlaceholder: 'you@company.com',
    submit: '登录',
    submitting: '登录中…',
    redirecting: '正在返回首页…',
    configTitle: 'Supabase 未配置',
    configBody: '请在环境变量中设置 PUBLIC_SUPABASE_URL 与 PUBLIC_SUPABASE_ANON_KEY。',
    backHome: '返回首页',
    forgot: '忘记密码？',
    forgotTitle: '重置密码',
    forgotSubtitle: '输入注册邮箱，我们将发送重置链接（请检查垃圾邮件）。',
    sendReset: '发送重置邮件',
    sending: '发送中…',
    resetSent: '已发送重置邮件，请查收邮箱中的链接。',
    backToLogin: '返回登录',
  },
  en: {
    title: 'ATCS Tools Sign In',
    subtitle: 'Sign in with your internal account to access tools and quiz history.',
    email: 'Email',
    password: 'Password',
    emailPlaceholder: 'you@company.com',
    submit: 'Sign in',
    submitting: 'Signing in…',
    redirecting: 'Returning to home…',
    configTitle: 'Supabase not configured',
    configBody: 'Set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY in your environment.',
    backHome: 'Back to home',
    forgot: 'Forgot password?',
    forgotTitle: 'Reset password',
    forgotSubtitle: 'Enter your email and we will send a reset link (check spam).',
    sendReset: 'Send reset email',
    sending: 'Sending…',
    resetSent: 'Reset email sent. Open the link in your inbox.',
    backToLogin: 'Back to sign in',
  },
} as const;

export default function LoginPage() {
  const { lang } = useLang();
  const t = copy[lang];
  const [mode, setMode] = useState<'login' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const authErrors = useMemo(
    () =>
      ({
        'Invalid login credentials': {
          zh: '邮箱或密码错误',
          en: 'Invalid email or password',
        },
      }) as Record<string, { zh: string; en: string }>,
    [],
  );

  useEffect(() => {
    if (!isAuthRequired()) window.location.replace('/');
  }, []);

  if (!isAuthRequired()) {
    return (
      <div className="login-page">
        <div className="login-card">
          <p>{t.redirecting}</p>
        </div>
      </div>
    );
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-card-top">
            <LangSwitch />
          </div>
          <h1>{t.configTitle}</h1>
          <p>{t.configBody}</p>
          <a href="/">{t.backHome}</a>
        </div>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setSuccess('');
    const supabase = getSupabase();
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const mapped = authErrors[error.message];
      setMessage(mapped ? mapped[lang] : error.message);
      setLoading(false);
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect') || '/';
    window.location.href = redirect;
  }

  async function onForgot(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setSuccess('');
    try {
      await sendPasswordResetEmail(email);
      setSuccess(t.resetSent);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  if (mode === 'forgot') {
    return (
      <div className="login-page">
        <form className="login-card" onSubmit={onForgot}>
          <div className="login-card-top">
            <LangSwitch />
          </div>
          <h1>{t.forgotTitle}</h1>
          <p className="login-subtitle">{t.forgotSubtitle}</p>
          <label>
            {t.email}
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
            />
          </label>
          {success && <div className="login-success">{success}</div>}
          {message && <div className="login-error">{message}</div>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? t.sending : t.sendReset}
          </button>
          <p className="login-back-link">
            <button type="button" onClick={() => setMode('login')}>
              ← {t.backToLogin}
            </button>
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={onSubmit}>
        <div className="login-card-top">
          <LangSwitch />
        </div>
        <h1>{t.title}</h1>
        <p className="login-subtitle">{t.subtitle}</p>
        <label>
          {t.email}
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.emailPlaceholder}
          />
        </label>
        <label>
          {t.password}
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <p className="login-forgot">
          <button type="button" onClick={() => setMode('forgot')}>
            {t.forgot}
          </button>
        </p>
        {message && <div className="login-error">{message}</div>}
        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? t.submitting : t.submit}
        </button>
      </form>
    </div>
  );
}
