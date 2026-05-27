import { useEffect, useRef, type MouseEvent } from 'react';
import { useLang } from '../lib/lang-context';
import { navTranslations } from '../lib/i18n';
import LangSwitch from './LangSwitch';

function NavDropdown({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <details className="dropdown">
      <summary className="nav-btn dropdown-toggle">
        <span>{label}</span>
        <span className="arrow">▼</span>
      </summary>
      <div className="dropdown-menu">{children}</div>
    </details>
  );
}

export default function AppShellHeader() {
  const { lang } = useLang();
  const t = navTranslations[lang];
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function closeAllDropdowns() {
      const root = headerRef.current;
      if (!root) return;
      root.querySelectorAll('details.dropdown[open]').forEach((d) => {
        (d as HTMLDetailsElement).open = false;
      });
    }

    function onDocPointerDown(e: PointerEvent) {
      const root = headerRef.current;
      if (!root) return;
      const target = e.target as Node | null;
      if (target && root.contains(target)) return;
      closeAllDropdowns();
    }

    function onDocKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeAllDropdowns();
    }

    document.addEventListener('pointerdown', onDocPointerDown);
    document.addEventListener('keydown', onDocKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onDocPointerDown);
      document.removeEventListener('keydown', onDocKeyDown);
    };
  }, []);

  function onNavClickCapture(e: MouseEvent) {
    const a = (e.target as HTMLElement | null)?.closest?.('a.dropdown-item');
    if (!a) return;
    const details = a.closest('details.dropdown') as HTMLDetailsElement | null;
    if (details) details.open = false;
  }

  return (
    <header className="app-header" ref={headerRef}>
      <div className="header-left">
        <a className="logo-area" href="/">
          <div className="logo-icon">AT</div>
          <h1>ATCS Tools</h1>
        </a>
        <div className="header-divider" />
        <nav className="nav-tabs" aria-label="Main" onClickCapture={onNavClickCapture}>
          <NavDropdown label={`📋 ${t.orderInquiry}`}>
            <a className="dropdown-item" href="/tools/mailcraft/">
              <span className="item-icon">✉️</span>
              <span>{t.orderOptions.MailCraft}</span>
            </a>
            <a className="dropdown-item" href="/tools/mt4tp/">
              <span className="item-icon">📊</span>
              <span>{t.orderOptions['MT4 TP']}</span>
            </a>
            <a className="dropdown-item" href="/tools/mt5tp/">
              <span className="item-icon">📈</span>
              <span>{t.orderOptions['MT5 TP']}</span>
            </a>
          </NavDropdown>
          <NavDropdown label={`💰 ${t.fundManagement}`}>
            <a className="dropdown-item" href="/tools/mucredit/">
              <span className="item-icon">📟</span>
              <span>{t.fundOptions['MU Credit']}</span>
            </a>
            <a className="dropdown-item" href="/tools/gmcalc/">
              <span className="item-icon">🧮</span>
              <span>{t.fundOptions['CN GM Calc']}</span>
            </a>
          </NavDropdown>
          <NavDropdown label={`📝 ${t.quiz}`}>
            {t.quizCategories.map((cat) => (
              <a key={cat.slug} className="dropdown-item" href={`/tools/quiz/${cat.slug}/`}>
                <span className="item-icon">{cat.icon}</span>
                <span>{cat.label}</span>
              </a>
            ))}
          </NavDropdown>
        </nav>
      </div>
      <LangSwitch />
    </header>
  );
}
