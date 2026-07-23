import { useEffect, useRef, useState } from 'react';
import { isAuthRequired } from '../lib/auth';
import { signOut, updatePassword } from '../lib/auth-session';
import { fetchProfile } from '../lib/profile';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase/client';
import { useLang } from '../lib/lang-context';
import './user-menu.css';

const copy = {
  zh: {
    account: '账号',
    changePassword: '修改密码',
    signOut: '登出',
    modalTitle: '修改密码',
    modalHint: '请输入新密码（至少 8 个字符）。',
    newPassword: '新密码',
    confirmPassword: '确认新密码',
    cancel: '取消',
    save: '保存',
    saving: '保存中…',
    mismatch: '两次输入的密码不一致',
    tooShort: '密码至少 8 个字符',
    success: '密码已更新',
  },
  en: {
    account: 'Account',
    changePassword: 'Change password',
    signOut: 'Sign out',
    modalTitle: 'Change password',
    modalHint: 'Enter a new password (at least 8 characters).',
    newPassword: 'New password',
    confirmPassword: 'Confirm password',
    cancel: 'Cancel',
    save: 'Save',
    saving: 'Saving…',
    mismatch: 'Passwords do not match',
    tooShort: 'Password must be at least 8 characters',
    success: 'Password updated',
  },
} as const;

export default function UserMenu() {
  const { lang } = useLang();
  const t = copy[lang];
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [pw1, setPw1] = useState('');
  const [pw2, setPw2] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    if (!isAuthRequired()) return;

    const supabase = getSupabase();
    if (!supabase) return;

    const sync = () => {
      void (async () => {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          setVisible(false);
          setEmail(null);
          return;
        }
        setVisible(true);
        const profile = await fetchProfile();
        setEmail(profile?.email ?? data.session.user.email ?? null);
      })();
    };

    sync();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) sync();
      else {
        setVisible(false);
        setEmail(null);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDoc);
    return () => document.removeEventListener('pointerdown', onDoc);
  }, [open]);

  if (!visible) return null;

  const initial = (email?.[0] ?? '?').toUpperCase();

  async function onSavePassword() {
    setMsg('');
    if (pw1.length < 8) {
      setMsg(t.tooShort);
      return;
    }
    if (pw1 !== pw2) {
      setMsg(t.mismatch);
      return;
    }
    setBusy(true);
    try {
      await updatePassword(pw1);
      setMsg(t.success);
      setPw1('');
      setPw2('');
      setTimeout(() => {
        setModal(false);
        setMsg('');
      }, 1200);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="user-menu" ref={rootRef}>
        <button
          type="button"
          className="user-menu-trigger"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="menu"
        >
          <span className="user-menu-avatar" aria-hidden="true">
            {initial}
          </span>
          <span className="user-menu-email">{email ?? t.account}</span>
          <span className="user-menu-chevron" aria-hidden="true">
            ▼
          </span>
        </button>
        {open && (
          <div className="user-menu-panel" role="menu">
            <button
              type="button"
              className="user-menu-item"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                setModal(true);
                setMsg('');
                setPw1('');
                setPw2('');
              }}
            >
              {t.changePassword}
            </button>
            <div className="user-menu-divider" />
            <button
              type="button"
              className="user-menu-item user-menu-item--danger"
              role="menuitem"
              onClick={() => void signOut()}
            >
              {t.signOut}
            </button>
          </div>
        )}
      </div>

      {modal && (
        <div
          className="user-modal-overlay"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.target === e.currentTarget && setModal(false)}
        >
          <div className="user-modal">
            <h2>{t.modalTitle}</h2>
            <p>{t.modalHint}</p>
            <label>
              {t.newPassword}
              <input
                type="password"
                autoComplete="new-password"
                value={pw1}
                onChange={(e) => setPw1(e.target.value)}
              />
            </label>
            <label>
              {t.confirmPassword}
              <input
                type="password"
                autoComplete="new-password"
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
              />
            </label>
            {msg && (
              <p className={msg === t.success ? 'login-success' : 'user-modal-error'}>{msg}</p>
            )}
            <div className="user-modal-actions">
              <button
                type="button"
                className="user-modal-btn user-modal-btn--ghost"
                onClick={() => setModal(false)}
              >
                {t.cancel}
              </button>
              <button
                type="button"
                className="user-modal-btn user-modal-btn--primary"
                disabled={busy}
                onClick={() => void onSavePassword()}
              >
                {busy ? t.saving : t.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
