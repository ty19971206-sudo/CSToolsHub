import { useEffect, useMemo, useState } from 'react';
import { useLang } from '../../lib/lang-context';
import { navTranslations } from '../../lib/i18n';
import {
  fetchMyCertifications,
  fetchMyQuizAttempts,
  type QuizAttemptRow,
} from '../../lib/tools/quiz/supabase-quiz';
import { isSupabaseConfigured } from '../../lib/supabase/client';
import './quiz.css';

const PASS_RATIO = 0.8;

const copy = {
  zh: {
    title: '我的测验成绩',
    subtitle: '查看各分类测验记录与通过状态（80% 及以上视为通过）。',
    empty: '还没有测验记录',
    emptyHint: '从下方分类开始第一次测验吧。',
    colCat: '分类',
    colScore: '得分',
    colTime: '时间',
    pass: '已通过',
    retry: '再测一次',
    loading: '加载中…',
    noConfig: '请配置 Supabase 后查看成绩。',
    pct: '正确率',
  },
  en: {
    title: 'My Quiz Scores',
    subtitle: 'Review attempts and pass status (80% or above counts as passed).',
    empty: 'No attempts yet',
    emptyHint: 'Pick a category below to start your first quiz.',
    colCat: 'Category',
    colScore: 'Score',
    colTime: 'Time',
    pass: 'Passed',
    retry: 'Try again',
    loading: 'Loading…',
    noConfig: 'Configure Supabase to view scores.',
    pct: 'Score',
  },
} as const;

function scorePct(score: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((score / total) * 100);
}

export default function QuizHistoryApp() {
  const { lang } = useLang();
  const t = copy[lang];
  const [rows, setRows] = useState<QuizAttemptRow[]>([]);
  const [certSet, setCertSet] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }
    void (async () => {
      const [attempts, certs] = await Promise.all([
        fetchMyQuizAttempts(),
        fetchMyCertifications(),
      ]);
      setRows(attempts);
      setCertSet(new Set(certs.map((c) => c.category_id)));
      setLoading(false);
    })();
  }, []);

  const categories = navTranslations[lang].quizCategories;

  const summary = useMemo(() => {
    const passed = rows.filter((r) => scorePct(r.score, r.total) >= PASS_RATIO * 100).length;
    return { total: rows.length, passed };
  }, [rows]);

  if (!isSupabaseConfigured()) {
    return (
      <div className="quiz-page">
        <div className="quiz-container">
          <div className="quiz-history-body">
            <p>{t.noConfig}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page quiz-history-page">
      <div className="quiz-container">
        <header className="header quiz-history-header">
          <div>
            <h1>{t.title}</h1>
            <p className="quiz-history-subtitle">{t.subtitle}</p>
          </div>
          {rows.length > 0 && (
            <div className="quiz-history-stats" aria-label="Summary">
              <span className="quiz-history-stat">
                <strong>{summary.total}</strong>
                <span>{lang === 'zh' ? '次测验' : 'attempts'}</span>
              </span>
              <span className="quiz-history-stat quiz-history-stat--pass">
                <strong>{summary.passed}</strong>
                <span>{lang === 'zh' ? '次达标' : 'passed'}</span>
              </span>
            </div>
          )}
        </header>

        <div className="quiz-history-body">
          {loading ? (
            <p className="quiz-history-loading">{t.loading}</p>
          ) : rows.length === 0 ? (
            <div className="quiz-history-empty">
              <p className="quiz-history-empty-title">{t.empty}</p>
              <p>{t.emptyHint}</p>
              <div className="quiz-history-empty-links">
                {categories.map((cat) => (
                  <a key={cat.slug} className="quiz-history-cat-link" href={`/tools/quiz/${cat.slug}/`}>
                    <span>{cat.icon}</span> {cat.label}
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <ul className="quiz-history-list">
              {rows.map((r) => {
                const cat = r.quiz_categories;
                const name = cat ? (lang === 'zh' ? cat.name_zh : cat.name_en) : r.category_id;
                const pct = scorePct(r.score, r.total);
                const passed = certSet.has(r.category_id) || pct >= PASS_RATIO * 100;
                return (
                  <li key={r.id} className="quiz-history-item">
                    <div className="quiz-history-item-main">
                      <div className="quiz-history-item-head">
                        <span className="quiz-history-cat">{name}</span>
                        {passed && <span className="quiz-cert-badge">✓ {t.pass}</span>}
                      </div>
                      <div className="quiz-history-score-row">
                        <span className="quiz-history-score-text">
                          {r.score}/{r.total} · {pct}%
                        </span>
                        <div className="quiz-history-bar" aria-hidden="true">
                          <div
                            className={`quiz-history-bar-fill${passed ? ' is-pass' : ''}`}
                            style={{ width: `${Math.min(100, pct)}%` }}
                          />
                        </div>
                      </div>
                      <time className="quiz-history-time" dateTime={r.created_at}>
                        {new Date(r.created_at).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-GB')}
                      </time>
                    </div>
                    {cat?.slug && (
                      <a className="quiz-history-retry btn btn-secondary" href={`/tools/quiz/${cat.slug}/`}>
                        {t.retry}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
