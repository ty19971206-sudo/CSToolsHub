import { useLang } from '../lib/lang-context';
import { formatNewsDateTime } from '../lib/format';
import { homeTranslations } from '../lib/i18n';

export type HomeNewsItem = {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  summary: string;
  summaryZh?: string;
  summaryEn?: string;
  impactZh?: string;
  impactEn?: string;
};

type Props = {
  items: HomeNewsItem[];
  updatedAt: string;
};

export default function HomeNews({ items, updatedAt }: Props) {
  const { lang } = useLang();
  const t = homeTranslations[lang];

  return (
    <section className="news-feed" aria-labelledby="news-feed-title">
      <header className="news-feed__header">
        <div className="news-feed__title-block">
          <span className="news-feed__kicker">{lang === 'zh' ? '市场速递' : 'Market wire'}</span>
          <h2 id="news-feed-title" className="news-feed__title">
            {t.newsSection}
          </h2>
        </div>
        <p className="news-feed__updated">
          <span className="news-feed__updated-label">{t.newsUpdatedAt}</span>
          <time dateTime={updatedAt}>{formatNewsDateTime(updatedAt, lang)}</time>
        </p>
      </header>

      <p className="news-feed__disclaimer">{t.newsDisclaimer}</p>

      {items.length === 0 ? (
        <p className="news-feed__empty">{t.newsEmpty}</p>
      ) : (
        <ol className="news-feed__list">
          {items.map((item, index) => (
            <li key={item.url} className="news-feed__item">
              <article className="news-feed__article">
                <div className="news-feed__item-index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="news-feed__item-main">
                  <h3 className="news-feed__headline">
                    <a href={item.url} target="_blank" rel="noreferrer">
                      {item.title}
                    </a>
                  </h3>
                  <p className="news-feed__meta">
                    <span className="news-feed__source">{item.source}</span>
                    <span className="news-feed__meta-sep" aria-hidden="true">
                      ·
                    </span>
                    <time dateTime={item.publishedAt}>
                      {formatNewsDateTime(item.publishedAt, lang)}
                    </time>
                  </p>
                  <div className="news-feed__body">
                    <p className="news-feed__summary">
                      {lang === 'zh' ? (item.summaryZh ?? item.summary) : (item.summaryEn ?? item.summary)}
                    </p>
                    {(lang === 'zh' ? item.impactZh : item.impactEn)?.trim() ? (
                      <p className="news-feed__impact">
                        {lang === 'zh' ? item.impactZh : item.impactEn}
                      </p>
                    ) : null}
                  </div>
                </div>
                <a
                  className="news-feed__read"
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={lang === 'zh' ? '阅读原文' : 'Read article'}
                >
                  {lang === 'zh' ? '原文 →' : 'Read →'}
                </a>
              </article>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
