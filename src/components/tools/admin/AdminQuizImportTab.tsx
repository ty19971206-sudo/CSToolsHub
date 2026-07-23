import { useEffect, useState } from 'react';
import { buildQuizBank } from '../../../lib/tools/quiz/bank';
import { getQuizCategoryStats, seedQuizFromLocalBank } from '../../../lib/tools/quiz/supabase-quiz';
import { navTranslations } from '../../../lib/i18n';
import type { QuizCategoryKey } from '../../../lib/tools/quiz/types';

type Stat = { id: string; slug: string; name_zh: string; name_en: string; count: number };

export default function AdminQuizImportTab() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const localBank = buildQuizBank();
  const localCounts = navTranslations.en.quizCategories.map((c) => ({
    slug: c.slug,
    key: c.key as QuizCategoryKey,
    count: localBank[c.key as QuizCategoryKey]?.length ?? 0,
  }));

  async function load() {
    const s = await getQuizCategoryStats();
    setStats(s);
  }

  useEffect(() => {
    void load();
  }, []);

  async function onImport() {
    if (!confirm('将从本地 bank.ts 导入/覆盖数据库中的全部 Quiz 题目，确定继续？')) return;
    setLoading(true);
    setMessage('');
    try {
      await seedQuizFromLocalBank();
      setMessage('导入成功');
      await load();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <p>从本地 `bank.ts` 一键导入到 Supabase（会覆盖各分类现有题目）。</p>
      <button type="button" className="admin-btn" disabled={loading} onClick={onImport}>
        {loading ? '导入中…' : '从本地题库导入到数据库'}
      </button>
      {message && <p className="admin-msg">{message}</p>}
      <div className="admin-table-scroll">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Slug</th>
            <th>中文名</th>
            <th>DB 题目数</th>
            <th>本地题目数</th>
          </tr>
        </thead>
        <tbody>
          {localCounts.map((lc) => {
            const row = stats.find((s) => s.slug === lc.slug);
            return (
              <tr key={lc.slug}>
                <td>{lc.slug}</td>
                <td>{row?.name_zh ?? '—'}</td>
                <td>{row?.count ?? 0}</td>
                <td>{lc.count}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
}
