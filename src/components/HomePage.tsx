import { useLang } from '../lib/lang-context';
import forexNews from '../data/forex-news.json';
import { homeTranslations, navTranslations } from '../lib/i18n';
import './home.css';

export default function HomePage() {
  const { lang } = useLang();
  const t = homeTranslations[lang];
  const quizCats = navTranslations[lang].quizCategories;
  const newsItems = forexNews.items ?? [];
  const updatedAt = forexNews.updatedAt;

  const fmtDateTime = (iso: string) =>
    new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));

  return (
    <div className="home-page container">
      <div className="hero hero-lite">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            <span>{t.badge}</span>
          </div>
          <h1>
            <span className="title-icon">🛠️</span> {t.title}
          </h1>
          {t.subtitle && <p>{t.subtitle}</p>}
        </div>
        <div className="hero-visual" aria-hidden="true">
          <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
            <line x1="25" y1="15" x2="25" y2="135" className="chart-grid" />
            <rect x="35" y="120" width="14" height="15" rx="3" className="chart-bar" />
            <rect x="57" y="105" width="14" height="30" rx="3" className="chart-bar" />
            <rect x="79" y="85" width="14" height="50" rx="3" className="chart-bar" />
            <rect x="101" y="65" width="14" height="70" rx="3" className="chart-bar" />
            <rect x="123" y="45" width="14" height="90" rx="3" className="chart-bar" />
            <rect x="145" y="25" width="14" height="110" rx="3" className="chart-bar" />
            <polyline
              points="28,120 42,120 64,105 86,85 108,65 130,45 152,25 175,15"
              className="chart-line-path"
            />
            <circle cx="175" cy="15" r="5" className="chart-dot-highlight" />
          </svg>
        </div>
      </div>

      <section className="tools-section-panel news-panel">
        <div className="news-header">
          <h2 className="section-title section-title-glow">{t.newsSection}</h2>
          <span className="news-updated">
            {t.newsUpdatedAt}: {fmtDateTime(updatedAt)}
          </span>
        </div>
        <p className="news-disclaimer">{t.newsDisclaimer}</p>
        {newsItems.length === 0 ? (
          <div className="card card-wide">
            <p>{t.newsEmpty}</p>
          </div>
        ) : (
          <div className="news-grid">
            {newsItems.map((item) => (
              <article key={item.url} className="card news-card">
                <div className="news-card-head">
                  <h3>
                    <a href={item.url} target="_blank" rel="noreferrer">
                      {item.title}
                    </a>
                  </h3>
                  <p className="news-meta">
                    {item.source} · {fmtDateTime(item.publishedAt)}
                  </p>
                </div>
                <div className="news-card-body">
                  <p className="news-summary">
                    <strong>{t.newsSummary}: </strong>
                    {lang === 'zh' ? (item.summaryZh ?? item.summary) : (item.summaryEn ?? item.summary)}
                  </p>
                  {(lang === 'zh' ? item.impactZh : item.impactEn)?.trim() ? (
                    <p className="news-impact">{lang === 'zh' ? item.impactZh : item.impactEn}</p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="tools-section-panel">
        <h2 className="section-title section-title-glow">{t.orderTools}</h2>
        <div className="tools-grid">
          <a className="card tilt-card" href="/tools/mailcraft/">
            <div className="card-icon">✉️</div>
            <h3>{t.cards.mail.title}</h3>
            <p>{t.cards.mail.desc}</p>
          </a>
          <a className="card tilt-card" href="/tools/mt4tp/">
            <div className="card-icon">📊</div>
            <h3>{t.cards.mt4.title}</h3>
            <p>{t.cards.mt4.desc}</p>
          </a>
          <a className="card tilt-card" href="/tools/mt5tp/">
            <div className="card-icon">📈</div>
            <h3>{t.cards.mt5.title}</h3>
            <p>{t.cards.mt5.desc}</p>
          </a>
        </div>
      </section>

      <section className="tools-section-panel">
        <h2 className="section-title section-title-glow">{t.fundTools}</h2>
        <div className="tools-grid">
          <a className="card tilt-card" href="/tools/mucredit/">
            <div className="card-icon">📟</div>
            <h3>{t.cards.mu.title}</h3>
            <p>{t.cards.mu.desc}</p>
          </a>
          <a className="card tilt-card" href="/tools/gmcalc/">
            <div className="card-icon">🧮</div>
            <h3>{t.cards.gm.title}</h3>
            <p>{t.cards.gm.desc}</p>
          </a>
        </div>
      </section>

      <section className="tools-section-panel">
        <h2 className="section-title section-title-glow">{t.quizSection}</h2>
        <div className="tools-grid">
          <div className="card card-wide">
            <div className="card-icon">📝</div>
            <h3>{t.quizCardTitle}</h3>
            <p>{t.quizCardDesc}</p>
            <div className="quiz-subgrid">
              {quizCats.map((cat) => (
                <a key={cat.slug} className="quiz-item" href={`/tools/quiz/${cat.slug}/`}>
                  {cat.icon} {cat.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <p className="footer-note">{t.footer}</p>
    </div>
  );
}
