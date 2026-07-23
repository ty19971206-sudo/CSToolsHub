import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createUserAsAdmin,
  fetchAllProfiles,
  updateUserAsAdmin,
  updateUserRole,
  type ProfileRow,
} from '../../../lib/admin-users';
import type { UserProfile } from '../../../lib/profile';

const ROLES: UserProfile['role'][] = ['user', 'editor', 'admin'];

type UserDraft = { email: string; display_name: string };

export default function AdminUsersTab() {
  const [rows, setRows] = useState<ProfileRow[]>([]);
  const [drafts, setDrafts] = useState<Record<string, UserDraft>>({});
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [newRole, setNewRole] = useState<UserProfile['role']>('user');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchAllProfiles();
      setRows(list);
      setDrafts(
        Object.fromEntries(
          list.map((r) => [
            r.id,
            { email: r.email ?? '', display_name: r.display_name ?? '' },
          ]),
        ),
      );
    } catch (e) {
      setMsg(e instanceof Error ? e.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const dirtyIds = useMemo(() => {
    const ids: string[] = [];
    for (const row of rows) {
      const d = drafts[row.id];
      if (!d) continue;
      if (d.email !== (row.email ?? '') || d.display_name !== (row.display_name ?? '')) {
        ids.push(row.id);
      }
    }
    return ids;
  }, [rows, drafts]);

  function setDraft(userId: string, patch: Partial<UserDraft>) {
    setDrafts((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], ...patch },
    }));
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg('');
    try {
      await createUserAsAdmin({
        email: email.trim(),
        password,
        role: newRole,
        displayName: displayName.trim() || undefined,
      });
      setMsg('用户已创建，可直接登录');
      setEmail('');
      setPassword('');
      setDisplayName('');
      setNewRole('user');
      await load();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : '创建失败');
    } finally {
      setBusy(false);
    }
  }

  async function onSaveProfile(userId: string) {
    const draft = drafts[userId];
    const row = rows.find((r) => r.id === userId);
    if (!draft || !row) return;

    const emailChanged = draft.email.trim() !== (row.email ?? '').trim();
    const nameChanged = draft.display_name.trim() !== (row.display_name ?? '').trim();
    if (!emailChanged && !nameChanged) return;

    if (emailChanged && !draft.email.trim()) {
      setMsg('Email 不能为空');
      return;
    }

    setSavingId(userId);
    setMsg('');
    try {
      await updateUserAsAdmin({
        userId,
        ...(emailChanged ? { email: draft.email.trim() } : {}),
        ...(nameChanged ? { displayName: draft.display_name.trim() } : {}),
      });
      setMsg('用户信息已更新');
      await load();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : '更新失败');
    } finally {
      setSavingId(null);
    }
  }

  async function onRoleChange(userId: string, role: UserProfile['role']) {
    setBusy(true);
    setMsg('');
    try {
      await updateUserRole(userId, role);
      setMsg('权限已更新');
      await load();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : '更新失败');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-users">
      <p className="admin-users-note">
        仅 <strong>admin</strong> 可管理用户。新建/修改邮箱需 Netlify 部署并配置{' '}
        <code>SUPABASE_SERVICE_ROLE_KEY</code>（本地请用 <code>npx netlify dev</code>）。
      </p>

      <form className="admin-users-create" onSubmit={onCreate}>
        <h3>新增用户</h3>
        <div className="admin-users-form-grid">
          <label>
            Email
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            密码（至少 6 位）
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label>
            显示名称（可选）
            <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </label>
          <label>
            角色
            <select value={newRole} onChange={(e) => setNewRole(e.target.value as UserProfile['role'])}>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button type="submit" className="admin-btn" disabled={busy}>
          {busy ? '创建中…' : '创建账号'}
        </button>
      </form>

      {msg && <p className={`admin-msg${msg.includes('失败') ? ' admin-msg--err' : ''}`}>{msg}</p>}

      <h3>用户列表</h3>
      {loading ? (
        <p>加载中…</p>
      ) : (
        <div className="admin-table-scroll">
          <table className="admin-table admin-users-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>名称</th>
                <th>角色</th>
                <th>注册时间</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const draft = drafts[row.id] ?? { email: '', display_name: '' };
                const isDirty = dirtyIds.includes(row.id);
                const isSaving = savingId === row.id;
                return (
                  <tr key={row.id} className={isDirty ? 'admin-users-row--dirty' : ''}>
                    <td>
                      <input
                        type="email"
                        className="admin-users-inline-input"
                        value={draft.email}
                        disabled={isSaving || busy}
                        onChange={(e) => setDraft(row.id, { email: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="admin-users-inline-input"
                        value={draft.display_name}
                        disabled={isSaving || busy}
                        onChange={(e) => setDraft(row.id, { display_name: e.target.value })}
                      />
                    </td>
                    <td>
                      <select
                        value={row.role}
                        disabled={busy || isSaving}
                        onChange={(e) =>
                          void onRoleChange(row.id, e.target.value as UserProfile['role'])
                        }
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{row.created_at ? new Date(row.created_at).toLocaleString() : '—'}</td>
                    <td className="admin-users-actions-cell">
                      <button
                        type="button"
                        className="admin-btn admin-btn--compact"
                        disabled={!isDirty || isSaving || busy}
                        onClick={() => void onSaveProfile(row.id)}
                      >
                        {isSaving ? '保存中…' : '保存'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
