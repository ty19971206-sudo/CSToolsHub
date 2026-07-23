import { useEffect, useState } from 'react';
import { isAuthRequired } from '../lib/auth';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase/client';
import { navTranslations } from '../lib/i18n';
import AdminNavLink from './AdminNavLink';

function isAuthOnlyRoute() {
  if (typeof window === 'undefined') return false;
  const p = window.location.pathname;
  return p.startsWith('/login') || p.startsWith('/auth/');
}

export default function AppShellNav() {
  const [show, setShow] = useState(!isAuthRequired());
  const zh = navTranslations.zh;
  const en = navTranslations.en;

  useEffect(() => {
    if (!isAuthRequired()) {
      setShow(true);
      return;
    }
    if (!isSupabaseConfigured()) {
      setShow(false);
      return;
    }
    if (isAuthOnlyRoute()) {
      setShow(false);
      return;
    }

    const supabase = getSupabase();
    if (!supabase) return;

    const sync = () => {
      void supabase.auth.getSession().then(({ data }) => {
        setShow(Boolean(data.session));
      });
    };

    sync();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isAuthOnlyRoute()) {
        setShow(false);
        return;
      }
      setShow(Boolean(session));
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!show) return null;

  return (
    <>
      <div className="header-divider" />
      <nav className="nav-tabs" aria-label="Main">
        <NavDropdown
          icon="📋"
          labelZh={zh.orderInquiry}
          labelEn={en.orderInquiry}
          items={[
            { href: '/tools/mailcraft/', icon: '✉️', zh: zh.orderOptions.MailCraft, en: en.orderOptions.MailCraft },
            { href: '/tools/mt4tp/', icon: '📊', zh: zh.orderOptions['MT4 TP'], en: en.orderOptions['MT4 TP'] },
            { href: '/tools/mt5tp/', icon: '📈', zh: zh.orderOptions['MT5 TP'], en: en.orderOptions['MT5 TP'] },
          ]}
        />
        <NavDropdown
          icon="💰"
          labelZh={zh.fundManagement}
          labelEn={en.fundManagement}
          items={[
            { href: '/tools/mucredit/', icon: '📟', zh: zh.fundOptions['MU Credit'], en: en.fundOptions['MU Credit'] },
            { href: '/tools/gmcalc/', icon: '🧮', zh: zh.fundOptions['CN GM Calc'], en: en.fundOptions['CN GM Calc'] },
          ]}
        />
        <NavDropdown
          icon="📝"
          labelZh={zh.quiz}
          labelEn={en.quiz}
          items={[
            ...zh.quizCategories.map((cat, i) => ({
              href: `/tools/quiz/${cat.slug}/`,
              icon: cat.icon,
              zh: cat.label,
              en: en.quizCategories[i].label,
            })),
            { href: '/tools/quiz/history/', icon: '📜', zh: '我的成绩', en: 'My Scores' },
          ]}
        />
        <AdminNavLink />
      </nav>
    </>
  );
}

function NavDropdown({
  icon,
  labelZh,
  labelEn,
  items,
}: {
  icon: string;
  labelZh: string;
  labelEn: string;
  items: { href: string; icon: string; zh: string; en: string }[];
}) {
  return (
    <details className="dropdown">
      <summary className="nav-btn dropdown-toggle">
        <span>
          {icon}{' '}
          <span className="i18n-zh">{labelZh}</span>
          <span className="i18n-en">{labelEn}</span>
        </span>
        <span className="arrow">▼</span>
      </summary>
      <div className="dropdown-menu">
        {items.map((item) => (
          <a key={item.href} className="dropdown-item" href={item.href}>
            <span className="item-icon">{item.icon}</span>
            <span className="i18n-zh">{item.zh}</span>
            <span className="i18n-en">{item.en}</span>
          </a>
        ))}
      </div>
    </details>
  );
}
