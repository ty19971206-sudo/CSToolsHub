import { useEffect, useState } from 'react';
import {
  fetchQuizCategories,
  fetchQuizCategoryStatsAdmin,
  fetchWeakQuestions,
  type CategoryStatsAdmin,
} from '../../../lib/tools/quiz/supabase-quiz';

export default function AdminQuizDashboardTab() {
  const [stats, setStats] = useState<CategoryStatsAdmin[]>([]);
  const [catId, setCatId] = useState('');
  const [weak, setWeak] = useState<{ question_id: string; wrong_count: number }[]>([]);

  useEffect(() => {
    void fetchQuizCategoryStatsAdmin().then(setStats);
    void fetchQuizCategories().then((c) => {
      if (c[0]) setCatId(c[0].id);
    });
  }, []);

  useEffect(() => {
    if (!catId) return;
    void fetchWeakQuestions(catId, 10).then(setWeak);
  }, [catId]);

  return (
    <div>
      <h2 className="admin-section-title">分类统计</h2>
      <div className="admin-table-scroll">
      <table className="admin-table">
        <thead>
          <tr>
            <th>分类</th>
            <th>尝试次数</th>
            <th>平均分</th>
            <th>及格率</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((s) => (
            <tr key={s.category_id}>
              <td>
                {s.name_zh} ({s.slug})
              </td>
              <td>{s.attempt_count}</td>
              <td>{(Number(s.avg_score) * 100).toFixed(1)}%</td>
              <td>{(Number(s.pass_rate) * 100).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <h2 className="admin-section-title">错题 Top</h2>
      <label>
        分类
        <select value={catId} onChange={(e) => setCatId(e.target.value)}>
          {stats.map((s) => (
            <option key={s.category_id} value={s.category_id}>
              {s.name_zh}
            </option>
          ))}
        </select>
      </label>
      <div className="admin-table-scroll">
      <table className="admin-table">
        <thead>
          <tr>
            <th>题目 ID</th>
            <th>错误次数</th>
          </tr>
        </thead>
        <tbody>
          {weak.map((w) => (
            <tr key={w.question_id}>
              <td>{w.question_id}</td>
              <td>{w.wrong_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
