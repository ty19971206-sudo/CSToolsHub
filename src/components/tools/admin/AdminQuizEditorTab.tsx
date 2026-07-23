import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createQuizQuestion,
  deleteQuizQuestion,
  fetchAllQuestionsForCategory,
  fetchQuizCategories,
  updateQuizQuestion,
} from '../../../lib/tools/quiz/supabase-quiz';
import type { QuizQuestion } from '../../../lib/tools/quiz/types';

type Cat = { id: string; slug: string; name_zh: string; name_en: string };
type QRow = {
  id: string;
  zh_json: QuizQuestion['zh'];
  en_json: QuizQuestion['en'];
  correct_index: number;
  is_active: boolean;
};

type FormState = { zh: QuizQuestion['zh']; en: QuizQuestion['en']; correct: number };

const emptyQ = (): FormState => ({
  zh: { question: '', options: ['', '', '', ''] },
  en: { question: '', options: ['', '', '', ''] },
  correct: 0,
});

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function AdminQuizEditorTab() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [catId, setCatId] = useState('');
  const [questions, setQuestions] = useState<QRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyQ());
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const isNew = selectedId === '__new__';
  const selectedQ = questions.find((q) => q.id === selectedId);

  const loadQuestions = useCallback(async () => {
    if (!catId) return;
    const rows = await fetchAllQuestionsForCategory(catId);
    setQuestions(rows as QRow[]);
  }, [catId]);

  useEffect(() => {
    void fetchQuizCategories().then((c) => {
      setCats(c);
      if (c[0]) setCatId((prev) => prev || c[0].id);
    });
  }, []);

  useEffect(() => {
    void loadQuestions();
    setSelectedId(null);
    setForm(emptyQ());
  }, [catId, loadQuestions]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return questions;
    return questions.filter(
      (row) =>
        row.zh_json.question.toLowerCase().includes(q) ||
        row.en_json.question.toLowerCase().includes(q),
    );
  }, [questions, search]);

  function selectQuestion(row: QRow) {
    setSelectedId(row.id);
    setForm({ zh: row.zh_json, en: row.en_json, correct: row.correct_index });
  }

  function startNew() {
    setSelectedId('__new__');
    setForm(emptyQ());
  }

  function setOption(lang: 'zh' | 'en', index: number, value: string) {
    setForm((f) => {
      const options = [...f[lang].options];
      options[index] = value;
      return { ...f, [lang]: { ...f[lang], options } };
    });
  }

  async function handleSave() {
    if (!form.zh.question.trim() || !form.en.question.trim()) {
      setToast({ type: 'err', text: '请填写中英文题干' });
      return;
    }
    if (form.zh.options.some((o) => !o.trim()) || form.en.options.some((o) => !o.trim())) {
      setToast({ type: 'err', text: '请填写全部四个选项' });
      return;
    }
    setBusy(true);
    try {
      if (isNew) {
        if (!catId) return;
        await createQuizQuestion({ categoryId: catId, ...form });
        setToast({ type: 'ok', text: '题目已新增' });
        await loadQuestions();
        setSelectedId(null);
        setForm(emptyQ());
      } else if (selectedId) {
        await updateQuizQuestion(selectedId, form);
        setToast({ type: 'ok', text: '已保存' });
        await loadQuestions();
      }
    } catch (e) {
      setToast({ type: 'err', text: e instanceof Error ? e.message : '保存失败' });
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive(row: QRow) {
    setBusy(true);
    try {
      await updateQuizQuestion(row.id, {
        zh: row.zh_json,
        en: row.en_json,
        correct: row.correct_index,
        is_active: !row.is_active,
      });
      await loadQuestions();
      setToast({ type: 'ok', text: row.is_active ? '已停用' : '已启用' });
    } catch (e) {
      setToast({ type: 'err', text: e instanceof Error ? e.message : '操作失败' });
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(row: QRow) {
    if (!confirm(`删除题目：\n${row.zh_json.question.slice(0, 80)}…`)) return;
    setBusy(true);
    try {
      await deleteQuizQuestion(row.id);
      if (selectedId === row.id) {
        setSelectedId(null);
        setForm(emptyQ());
      }
      await loadQuestions();
      setToast({ type: 'ok', text: '已删除' });
    } catch (e) {
      setToast({ type: 'err', text: e instanceof Error ? e.message : '删除失败' });
    } finally {
      setBusy(false);
    }
  }

  const activeCat = cats.find((c) => c.id === catId);

  return (
    <div className="quiz-editor-layout">
      {toast && (
        <div className={`quiz-editor-toast quiz-editor-toast--${toast.type}`} role="status">
          {toast.text}
        </div>
      )}

      <header className="quiz-editor-toolbar">
        <label className="quiz-editor-field quiz-editor-field--grow">
          <span className="quiz-editor-label">分类</span>
          <select
            value={catId}
            onChange={(e) => setCatId(e.target.value)}
            className="quiz-editor-select"
          >
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_zh} · {c.name_en}
              </option>
            ))}
          </select>
        </label>
        <label className="quiz-editor-field quiz-editor-field--grow">
          <span className="quiz-editor-label">搜索题目</span>
          <input
            type="search"
            className="quiz-editor-input"
            placeholder="题干关键词…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <button type="button" className="admin-btn" onClick={startNew} disabled={busy}>
          ＋ 新增题目
        </button>
      </header>

      <div className="quiz-editor-panels">
        <aside className="quiz-editor-list-panel">
          <div className="quiz-editor-list-head">
            <span>{activeCat?.name_zh ?? '题目'}</span>
            <span className="quiz-editor-count">{filtered.length} 题</span>
          </div>
          <ul className="quiz-editor-list">
            {filtered.length === 0 && <li className="quiz-editor-list-empty">暂无题目</li>}
            {filtered.map((row, idx) => (
              <li key={row.id}>
                <button
                  type="button"
                  className={`quiz-editor-list-item${selectedId === row.id ? ' is-selected' : ''}${!row.is_active ? ' is-inactive' : ''}`}
                  onClick={() => selectQuestion(row)}
                >
                  <span className="quiz-editor-list-num">{idx + 1}</span>
                  <span className="quiz-editor-list-text">{row.zh_json.question}</span>
                  {!row.is_active && <span className="quiz-editor-badge">停用</span>}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="quiz-editor-detail-panel">
          {!selectedId ? (
            <div className="quiz-editor-placeholder">
              <p>← 从左侧选择题目，或点击「新增题目」</p>
            </div>
          ) : (
            <>
              <div className="quiz-editor-detail-head">
                <h3>{isNew ? '新增题目' : '编辑题目'}</h3>
                {!isNew && selectedQ && (
                  <div className="quiz-editor-detail-actions">
                    <button
                      type="button"
                      className="quiz-editor-btn-ghost"
                      disabled={busy}
                      onClick={() => void toggleActive(selectedQ)}
                    >
                      {selectedQ.is_active ? '停用' : '启用'}
                    </button>
                    <button
                      type="button"
                      className="quiz-editor-btn-danger"
                      disabled={busy}
                      onClick={() => void handleDelete(selectedQ)}
                    >
                      删除
                    </button>
                  </div>
                )}
              </div>

              <div className="quiz-editor-columns">
                <div className="quiz-editor-col">
                  <h4>中文</h4>
                  <label className="quiz-editor-field">
                    <span className="quiz-editor-label">题干</span>
                    <textarea
                      className="quiz-editor-textarea"
                      rows={3}
                      value={form.zh.question}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, zh: { ...f.zh, question: e.target.value } }))
                      }
                    />
                  </label>
                  {OPTION_LABELS.map((label, i) => (
                    <label key={`zh-${i}`} className="quiz-editor-field quiz-editor-option-row">
                      <span className="quiz-editor-label">
                        <input
                          type="radio"
                          name="correct-answer"
                          checked={form.correct === i}
                          onChange={() => setForm((f) => ({ ...f, correct: i }))}
                        />
                        {label}
                      </span>
                      <input
                        className="quiz-editor-input"
                        value={form.zh.options[i]}
                        onChange={(e) => setOption('zh', i, e.target.value)}
                      />
                    </label>
                  ))}
                </div>

                <div className="quiz-editor-col">
                  <h4>English</h4>
                  <label className="quiz-editor-field">
                    <span className="quiz-editor-label">Question</span>
                    <textarea
                      className="quiz-editor-textarea"
                      rows={3}
                      value={form.en.question}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, en: { ...f.en, question: e.target.value } }))
                      }
                    />
                  </label>
                  {OPTION_LABELS.map((label, i) => (
                    <label key={`en-${i}`} className="quiz-editor-field quiz-editor-option-row">
                      <span className="quiz-editor-label">{label}</span>
                      <input
                        className="quiz-editor-input"
                        value={form.en.options[i]}
                        onChange={(e) => setOption('en', i, e.target.value)}
                      />
                    </label>
                  ))}
                </div>
              </div>

              <p className="quiz-editor-hint">
                正确答案：在左侧中文区勾选 A–D 单选框（中英共用同一正确答案）。
              </p>

              <footer className="quiz-editor-footer">
                <button
                  type="button"
                  className="admin-btn"
                  disabled={busy}
                  onClick={() => void handleSave()}
                >
                  {busy ? '保存中…' : isNew ? '创建题目' : '保存修改'}
                </button>
                {!isNew && (
                  <button
                    type="button"
                    className="quiz-editor-btn-ghost"
                    disabled={busy}
                    onClick={() => {
                      setSelectedId(null);
                      setForm(emptyQ());
                    }}
                  >
                    取消
                  </button>
                )}
              </footer>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
