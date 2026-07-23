import { useEffect, useState } from 'react';
import { isAuthRequired } from '../lib/auth';
import { updatePassword } from '../lib/auth-session';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase/client';
import { useLang } from '../lib/lang-context';
import LangSwitch from './LangSwitch';
import './login.css';
import './user-menu.css';

const copy = {
  zh: {
    title: '设置新密码',
    subtitle: '请为账号设置新密码，完成后将跳转到首页。',
    newPassword: '新密码',
    confirmPassword: '确认新密码',
    submit: '更新密码',
    submitting: '更新中…',
    mismatch: '两次输入的密码不一致',
    tooShort: '密码至少 8 个字符',
    noSession: '链接无效或已过期，请重新申请重置邮件。',
    requestAgain: '返回登录',
    configTitle: 'Supabase 未配置',
  },
  en: {
    title: 'Set new password',
    subtitle: 'Choose a new password for your account. You will be redirected home when done.',
    newPassword: 'New password',
    confirmPassword: 'Confirm password',
    submit: 'Update password',
    submitting: 'Updating…',
    mismatch: 'Passwords do not match',
    tooShort: 'Password must be at least 8 characters',
    noSession: 'This link is invalid or expired. Request a new reset email.',
    requestAgain: 'Back to sign in',
    configTitle: 'Supabase not configured',
  },
} as const;

export default function ResetPasswordPage() {
  const { lang } = useLang();
  const t = copy[lang];
  const [ready, setReady] = useState(false);
  const [pw1, setPw1] = useState('');
  const [pw2, setPw2] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = getSupabase();
    if (!supabase) return;

    const check = () => {
      void supabase.auth.getSession().then(({ data }) => {
        setReady(Boolean(data.session));
      });
    };

    check();
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === 'PASSWORD_RECOVERY' || event === 'INITIAL_SESSION' || event === 'SIGNED_IN')) {
        setReady(true);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!isSupabaseConfigured()) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h1>{t.configTitle}</h1>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h1>{t.title}</h1>
          <p className="login-subtitle">{t.noSession}</p>
          <a href="/login/" className="login-btn" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
            {t.requestAgain}
          </a>
        </div>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    if (pw1.length < 8) {
      setMsg(t.tooShort);
      return;
    }
    if (pw1 !== pw2) {
      setMsg(t.mismatch);
      return;
    }
    setLoading(true);
    try {
      await updatePassword(pw1);
      window.location.href = '/';
    } catch (err) {
      setMsg(err instanceof Error ? err.message : String(err));
      setLoading(false);
    }
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
          {t.newPassword}
          <input
            type="password"
            required
            autoComplete="new-password"
            value={pw1}
            onChange={(e) => setPw1(e.target.value)}
          />
        </label>
        <label>
          {t.confirmPassword}
          <input
            type="password"
            required
            autoComplete="new-password"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
          />
        </label>
        {msg && <div className="login-error">{msg}</div>}
        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? t.submitting : t.submit}
        </button>
      </form>
    </div>
  );
}
