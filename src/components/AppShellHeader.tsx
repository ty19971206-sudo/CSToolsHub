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

  return (
    <header className="app-header">
      <div className="header-left">
        <a className="logo-area" href="/">
          <div className="logo-icon">AT</div>
          <h1>ATCS Tools</h1>
        </a>
        <div className="header-divider" />
        <nav className="nav-tabs" aria-label="Main">
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
