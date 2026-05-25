import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLang } from '../../lib/lang-context';
import { buildQuizBank } from '../../lib/tools/quiz/bank';
import { categoryNames } from '../../lib/tools/quiz/categories';
import { fetchQuizQuestionsBySlug, saveQuizAttempt } from '../../lib/tools/quiz/supabase-quiz';
import { isSupabaseConfigured } from '../../lib/supabase/client';
import type { QuizCategoryKey, QuizQuestion } from '../../lib/tools/quiz/types';
import './quiz.css';

const QUIZ_SIZE = 10;

const localQuizBank = buildQuizBank();

type Props = {
  category: QuizCategoryKey;
  categorySlug: string;
};

function escapeHtml(str: string) {
  return String(str).replace(/[&<>]/g, (m) => {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

function pickIndices(total: number, count: number, exclude: number[] = []) {
  const pool = Array.from({ length: total }, (_, i) => i).filter((i) => !exclude.includes(i));
  const picked: number[] = [];
  while (picked.length < count && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(idx, 1)[0]);
  }
  return picked;
}

export default function QuizApp({ category, categorySlug }: Props) {
  const { lang } = useLang();
  const [qSet, setQSet] = useState<QuizQuestion[]>(localQuizBank[category] || []);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [source, setSource] = useState<'local' | 'db'>('local');

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setQSet(localQuizBank[category] || []);
      setSource('local');
      return;
    }
    void (async () => {
      const db = await fetchQuizQuestionsBySlug(categorySlug);
      if (db?.questions.length) {
        setQSet(db.questions);
        setCategoryId(db.categoryId);
        setSource('db');
      } else {
        setQSet(localQuizBank[category] || []);
        setCategoryId(null);
        setSource('local');
      }
    })();
  }, [category, categorySlug]);

  const [questionIndices, setQuestionIndices] = useState<number[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUIZ_SIZE).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [details, setDetails] = useState<
    { q: string; correct: string; yours: string; ok: boolean }[]
  >([]);
  const [deckKey, setDeckKey] = useState(0);
  const [scoreReveal, setScoreReveal] = useState(false);

  const title = categoryNames[category]
    ? lang === 'zh'
      ? categoryNames[category].zh
      : categoryNames[category].en
    : category;

  const reshuffle = useCallback(
    (exclude: number[] = []) => {
      const indices = pickIndices(qSet.length, Math.min(QUIZ_SIZE, qSet.length), exclude);
      setQuestionIndices(indices);
      setAnswers(Array(indices.length).fill(null));
      setSubmitted(false);
      setLocked(false);
      setScore(null);
      setDetails([]);
      setScoreReveal(false);
      setDeckKey((k) => k + 1);
    },
    [qSet.length],
  );

  useEffect(() => {
    reshuffle();
  }, [category, reshuffle]);

  useEffect(() => {
    if (submitted && locked) {
      evaluate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  function getLocalized(originalIdx: number) {
    const original = qSet[originalIdx];
    if (!original) return { text: lang === 'zh' ? '暂无题目' : 'No question', options: [] as string[] };
    if (lang === 'zh') return { text: original.zh.question, options: [...original.zh.options] };
    return { text: original.en.question, options: [...original.en.options] };
  }

  function evaluate() {
    let correctCount = 0;
    const detailRows: typeof details = [];
    const answerLog: { index: number; selected: number | null; correct: number }[] = [];
    questionIndices.forEach((origIdx, i) => {
      const localized = getLocalized(origIdx);
      const correctIdx = qSet[origIdx]?.correct ?? 0;
      const userAns = answers[i];
      const ok = userAns === correctIdx;
      if (ok) correctCount++;
      answerLog.push({ index: origIdx, selected: userAns, correct: correctIdx });
      detailRows.push({
        q: localized.text,
        correct: localized.options[correctIdx] ?? '',
        yours: userAns !== null ? (localized.options[userAns] ?? '') : '—',
        ok,
      });
    });
    setScore(correctCount);
    setDetails(detailRows);
    setSubmitted(true);
    setLocked(true);
    setScoreReveal(true);
    window.setTimeout(() => setScoreReveal(false), 500);
    if (source === 'db' && categoryId) {
      void saveQuizAttempt({
        categoryId,
        score: correctCount,
        total: questionIndices.length,
        answers: answerLog,
      });
    }
  }

  const allAnswered = answers.every((a) => a !== null);

  function getOptionClass(qIndex: number, optIdx: number) {
    if (!locked || !submitted) return '';
    const origIdx = questionIndices[qIndex];
    const correctIdx = qSet[origIdx]?.correct ?? 0;
    const userAns = answers[qIndex];
    if (optIdx === correctIdx) return 'option-correct';
    if (userAns === optIdx) return 'option-wrong';
    return '';
  }

  const labels = useMemo(
    () =>
      lang === 'zh'
        ? {
            sub: '随机抽取10题 | 题库随机抽题',
            result: '测试结果',
            submit: '✅ 提交答案',
            reshuffle: '🎲 重新抽题',
            note: 'ⓘ 必须答完所有题目才能提交；提交后不可修改。只能重新抽题。',
            scoreTip: submitted
              ? `正确率 ${Math.round(((score ?? 0) / questionIndices.length) * 100)}%`
              : '请答完所有题目后提交',
            needAll: '请答完所有题目后再提交',
          }
        : {
            sub: '10 random questions | Random from bank',
            result: 'Results',
            submit: '✅ Submit',
            reshuffle: '🎲 Reshuffle',
            note: 'ⓘ Must answer all to submit; answers locked after submit.',
            scoreTip: submitted
              ? `Accuracy ${Math.round(((score ?? 0) / questionIndices.length) * 100)}%`
              : 'Answer all questions to submit',
            needAll: 'Please answer all questions before submitting',
          },
    [lang, submitted, score, questionIndices.length],
  );

  return (
    <div className="quiz-page">
      <div className="quiz-container">
        <div className="header">
          <div className="header-left">
            <h1>{title}</h1>
            <p>{labels.sub}</p>
            <div className="category-badge">{title}</div>
          </div>
        </div>
        <div className="main-content">
          <div className={`questions-panel${locked ? ' disabled-options' : ''}`}>
            {questionIndices.map((origIdx, i) => {
              const localized = getLocalized(origIdx);
              return (
                <div
                  key={`${deckKey}-${origIdx}-${i}`}
                  className="quiz-card"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <div className="question-number">
                    {lang === 'zh' ? '第' : 'Q'} {i + 1} / {questionIndices.length}
                  </div>
                  <div
                    className="question-text"
                    dangerouslySetInnerHTML={{ __html: escapeHtml(localized.text) }}
                  />
                  <div className="options-list">
                    {localized.options.map((opt, optIdx) => (
                      <label
                        key={optIdx}
                        className={`option-item ${getOptionClass(i, optIdx)}`.trim()}
                      >
                        <input
                          type="radio"
                          name={`q${deckKey}-${i}`}
                          checked={answers[i] === optIdx}
                          disabled={locked}
                          onChange={() => {
                            const next = [...answers];
                            next[i] = optIdx;
                            setAnswers(next);
                            if (submitted) setSubmitted(false);
                          }}
                        />
                        <span className="option-label">
                          {String.fromCharCode(65 + optIdx)}. {opt}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="result-panel">
            <div className="result-title">
              <span>📊</span> {labels.result}
            </div>
            <div className={`score-area${scoreReveal ? ' score-reveal' : ''}`}>
              <div className="score-number">
                {submitted ? `${score}/${questionIndices.length}` : `?/${questionIndices.length}`}
              </div>
              <div className="score-detail">{labels.scoreTip}</div>
            </div>
            <div className="action-buttons">
              <button
                type="button"
                className="btn-primary"
                disabled={!allAnswered || locked}
                onClick={() => {
                  if (!allAnswered) {
                    alert(labels.needAll);
                    return;
                  }
                  evaluate();
                }}
              >
                {labels.submit}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => reshuffle(questionIndices)}
              >
                {labels.reshuffle}
              </button>
            </div>
            {submitted && details.length > 0 && (
              <div className="result-summary">
                {details.map((d, i) => (
                  <div key={i} className={d.ok ? 'detail-ok' : 'detail-bad'}>
                    <strong>
                      {i + 1}. {d.ok ? '✓' : '✗'}
                    </strong>
                    <div>{d.q}</div>
                    {!d.ok && (
                      <div className="detail-answer">
                        {lang === 'zh' ? '正确答案' : 'Correct'}: {d.correct}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="info-note">
              {labels.note}
              {source === 'db' && (
                <span>
                  <br />
                  {lang === 'zh' ? '（题库来源：数据库）' : ' (Question bank: database)'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
