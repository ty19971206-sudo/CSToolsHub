import { useEffect, useMemo, useState } from 'react';
import { fetchRecentAuditLogs, type AuditLogRow } from '../../../lib/tools/quiz/supabase-quiz';

const TIME_RANGES = [
  { id: 'all', zh: '全部时间', en: 'All time', days: null as number | null },
  { id: '1d', zh: '今天', en: 'Today', days: 1 },
  { id: '7d', zh: '近 7 天', en: 'Last 7 days', days: 7 },
  { id: '30d', zh: '近 30 天', en: 'Last 30 days', days: 30 },
  { id: '90d', zh: '近 90 天', en: 'Last 90 days', days: 90 },
] as const;

const FETCH_LIMIT = 300;

export default function AdminAuditTab() {
  const [rows, setRows] = useState<AuditLogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [userFilter, setUserFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('all');

  useEffect(() => {
    setLoading(true);
    void fetchRecentAuditLogs(FETCH_LIMIT)
      .then(setRows)
      .finally(() => setLoading(false));
  }, []);

  const userOptions = useMemo(() => {
    const map = new Map<string, string>();
    for (const r of rows) {
      if (!r.user_id) continue;
      const label = r.user_email?.trim() || r.user_id;
      map.set(r.user_id, label);
    }
    return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [rows]);

  const filtered = useMemo(() => {
    const range = TIME_RANGES.find((t) => t.id === timeFilter) ?? TIME_RANGES[0];
    const since =
      range.days === null
        ? null
        : (() => {
            const d = new Date();
            if (range.id === '1d') {
              d.setHours(0, 0, 0, 0);
            } else {
              d.setDate(d.getDate() - range.days);
            }
            return d;
          })();

    return rows.filter((r) => {
      if (userFilter !== 'all' && r.user_id !== userFilter) return false;
      if (since && new Date(r.created_at) < since) return false;
      return true;
    });
  }, [rows, userFilter, timeFilter]);

  return (
    <div className="admin-audit">
      <div className="admin-audit-filters">
        <label className="admin-audit-filter">
          <span>
            <span className="i18n-zh">筛选用户</span>
            <span className="i18n-en">User</span>
          </span>
          <select value={userFilter} onChange={(e) => setUserFilter(e.target.value)}>
            <option value="all">全部用户 / All users</option>
            {userOptions.map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="admin-audit-filter">
          <span>
            <span className="i18n-zh">筛选时间</span>
            <span className="i18n-en">Time</span>
          </span>
          <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
            {TIME_RANGES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.zh} / {t.en}
              </option>
            ))}
          </select>
        </label>
        <p className="admin-audit-count">
          <span className="i18n-zh">显示 {filtered.length} 条</span>
          <span className="i18n-en">{filtered.length} entries</span>
          {filtered.length < rows.length && (
            <span className="admin-audit-count-muted">
              {' '}
              (<span className="i18n-zh">共加载 {rows.length} 条</span>
              <span className="i18n-en">of {rows.length} loaded</span>)
            </span>
          )}
        </p>
      </div>

      {loading ? (
        <p>加载中…</p>
      ) : filtered.length === 0 ? (
        <p className="admin-audit-empty">暂无符合条件的记录</p>
      ) : (
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>时间</th>
                <th>用户</th>
                <th>操作</th>
                <th>详情</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.created_at).toLocaleString()}</td>
                  <td>{r.user_email ?? '—'}</td>
                  <td>{r.action}</td>
                  <td>
                    <code className="admin-audit-meta">{JSON.stringify(r.meta).slice(0, 120)}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
