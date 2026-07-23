import { useEffect, useState } from 'react';
import { fetchProfile, isEditorOrAdmin } from '../../../lib/profile';
import { isSupabaseConfigured } from '../../../lib/supabase/client';
import AdminQuizImportTab from './AdminQuizImportTab';
import AdminQuizEditorTab from './AdminQuizEditorTab';
import AdminQuizDashboardTab from './AdminQuizDashboardTab';
import AdminMailTab from './AdminMailTab';
import AdminProductsTab from './AdminProductsTab';
import AdminAuditTab from './AdminAuditTab';
import AdminUsersTab from './AdminUsersTab';
import '../admin-quiz.css';

type Tab = 'import' | 'questions' | 'dashboard' | 'mail' | 'products' | 'users' | 'audit';

type TabDef = {
  id: Tab;
  zh: string;
  en: string;
  descZh: string;
  descEn: string;
  adminOnly?: boolean;
};

const TABS: TabDef[] = [
  {
    id: 'import',
    zh: '题库导入',
    en: 'Import',
    descZh: '从本地题库同步分类与题目到数据库',
    descEn: 'Sync local quiz bank categories and questions to the database',
  },
  {
    id: 'questions',
    zh: '题目编辑',
    en: 'Questions',
    descZh: '浏览、编辑与维护测验题目',
    descEn: 'Browse, edit, and maintain quiz questions',
  },
  {
    id: 'dashboard',
    zh: '测验看板',
    en: 'Dashboard',
    descZh: '查看分类统计与测验数据概览',
    descEn: 'Category stats and quiz data overview',
  },
  {
    id: 'mail',
    zh: '邮件模板',
    en: 'Mail',
    descZh: '管理 MailCraft 邮件模板与变量',
    descEn: 'Manage MailCraft templates and variables',
  },
  {
    id: 'products',
    zh: '产品表',
    en: 'Products',
    descZh: '维护 GM 计算器产品规格',
    descEn: 'Maintain GM calculator product specs',
  },
  {
    id: 'users',
    zh: '用户管理',
    en: 'Users',
    descZh: '创建账号与调整用户角色',
    descEn: 'Create accounts and manage user roles',
    adminOnly: true,
  },
  {
    id: 'audit',
    zh: '操作日志',
    en: 'Audit',
    descZh: '查看后台操作审计记录',
    descEn: 'Review admin audit trail',
  },
];

type Props = { initialTab?: Tab };

function roleLabel(role: string | null): string {
  if (role === 'admin') return 'Admin';
  if (role === 'editor') return 'Editor';
  return role ?? '—';
}

export default function AdminHubApp({ initialTab = 'import' }: Props) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }
    void fetchProfile().then((p) => {
      setRole(p?.role ?? 'user');
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (tab === 'users' && role !== 'admin') setTab('import');
  }, [role, tab]);

  if (!isSupabaseConfigured()) {
    return (
      <div className="admin-quiz-page admin-state-page">
        <div className="admin-state-card">
          <h2>未配置 Supabase</h2>
          <p>请配置 Supabase 环境变量后刷新页面。</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-quiz-page admin-state-page">
        <div className="admin-state-card admin-loading" aria-busy="true">
          <span className="admin-spinner" aria-hidden="true" />
          <p>加载中…</p>
        </div>
      </div>
    );
  }

  if (!isEditorOrAdmin(role)) {
    return (
      <div className="admin-quiz-page admin-state-page">
        <div className="admin-state-card admin-state-card--denied">
          <h2>无访问权限</h2>
          <p>需要 editor 或 admin 角色才能使用管理后台。</p>
        </div>
      </div>
    );
  }

  const visibleTabs = TABS.filter((t) => !t.adminOnly || role === 'admin');
  const current = visibleTabs.find((t) => t.id === tab) ?? visibleTabs[0];

  return (
    <div className="admin-quiz-page admin-hub">
      <div className="admin-shell">
        <aside className="admin-sidebar" aria-label="Admin navigation">
          <div className="admin-sidebar-brand">
            <span className="admin-sidebar-mark logo-icon" aria-hidden="true">
              AT
            </span>
            <div>
              <span className="admin-sidebar-title">
                <span className="i18n-zh">管理后台</span>
                <span className="i18n-en">Admin</span>
              </span>
              <span className="admin-sidebar-sub">
                <span className="i18n-zh">ATCS Tools</span>
                <span className="i18n-en">ATCS Tools</span>
              </span>
            </div>
          </div>

          <nav className="admin-sidebar-nav">
            {visibleTabs.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`admin-nav-item${tab === t.id ? ' is-active' : ''}`}
                onClick={() => setTab(t.id)}
                aria-current={tab === t.id ? 'page' : undefined}
              >
                <span className="admin-nav-label">
                  <span className="i18n-zh">{t.zh}</span>
                  <span className="i18n-en">{t.en}</span>
                </span>
              </button>
            ))}
          </nav>

          <div className="admin-sidebar-foot">
            <span className="admin-role-badge">{roleLabel(role)}</span>
          </div>
        </aside>

        <div className="admin-main">
          <header className="admin-page-header">
            <div>
              <p className="admin-page-eyebrow">
                <span className="i18n-zh">管理后台</span>
                <span className="i18n-en">Admin Console</span>
              </p>
              <h1 className="admin-page-title">
                <span className="i18n-zh">{current.zh}</span>
                <span className="i18n-en">{current.en}</span>
              </h1>
              <p className="admin-page-desc">
                <span className="i18n-zh">{current.descZh}</span>
                <span className="i18n-en">{current.descEn}</span>
              </p>
            </div>
          </header>

          <div className="admin-tab-panel" role="region" aria-label={current.zh}>
            {tab === 'import' && <AdminQuizImportTab />}
            {tab === 'questions' && <AdminQuizEditorTab />}
            {tab === 'dashboard' && <AdminQuizDashboardTab />}
            {tab === 'mail' && <AdminMailTab />}
            {tab === 'products' && <AdminProductsTab />}
            {tab === 'users' && role === 'admin' && <AdminUsersTab />}
            {tab === 'audit' && <AdminAuditTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
