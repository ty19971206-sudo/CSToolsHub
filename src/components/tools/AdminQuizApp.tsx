import { useEffect, useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '../../lib/supabase/client';
import { getQuizCategoryStats, seedQuizFromLocalBank } from '../../lib/tools/quiz/supabase-quiz';
import { buildQuizBank } from '../../lib/tools/quiz/bank';
import { navTranslations } from '../../lib/i18n';
import type { QuizCategoryKey } from '../../lib/tools/quiz/types';
import './admin-quiz.css';

type Stat = { id: string; slug: string; name_zh: string; name_en: string; count: number };

export default function AdminQuizApp() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  const localBank = buildQuizBank();
  const localCounts = navTranslations.en.quizCategories.map((c) => ({
    slug: c.slug,
    key: c.key as QuizCategoryKey,
    count: localBank[c.key as QuizCategoryKey]?.length ?? 0,
  }));

  async function load() {
    if (!isSupabaseConfigured()) return;
    const supabase = getSupabase();
    if (!supabase) return;
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.user.id)
      .maybeSingle();
    setRole(profile?.role ?? 'user');
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

  if (!isSupabaseConfigured()) {
    return (
      <div className="admin-quiz-page">
        <p>请配置 Supabase 环境变量后使用管理功能。</p>
      </div>
    );
  }

  if (role && role !== 'admin' && role !== 'editor') {
    return (
      <div className="admin-quiz-page">
        <p>需要 editor 或 admin 角色才能访问题库管理。</p>
      </div>
    );
  }

  return (
    <div className="admin-quiz-page">
      <h1>Quiz 题库管理</h1>
      <p>从本地 `bank.ts` 一键导入到 Supabase，或查看各分类题目数量。</p>
      <button type="button" className="admin-btn" disabled={loading} onClick={onImport}>
        {loading ? '导入中…' : '从本地题库导入到数据库'}
      </button>
      {message && <p className="admin-msg">{message}</p>}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Slug</th>
            <th>名称</th>
            <th>本地题数</th>
            <th>数据库题数</th>
          </tr>
        </thead>
        <tbody>
          {localCounts.map((lc) => {
            const db = stats.find((s) => s.slug === lc.slug);
            return (
              <tr key={lc.slug}>
                <td>{lc.slug}</td>
                <td>{lc.key}</td>
                <td>{lc.count}</td>
                <td>{db?.count ?? '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
