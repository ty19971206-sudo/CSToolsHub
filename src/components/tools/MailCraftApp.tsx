import { useEffect, useRef, useState } from 'react';
import { getStoredLang } from '../../lib/i18n';
import { fetchProfile, isEditorOrAdmin } from '../../lib/profile';
import {
  fetchMailTemplates,
  upsertMailTemplate,
  type MailTemplateFields,
} from '../../lib/tools/mailcraft/supabase-mail';
import { isSupabaseConfigured } from '../../lib/supabase/client';
import './mailcraft/mailcraft.css';

declare global {
  interface Window {
    initMailCraft?: () => void;
    __MAILCRAFT_DB_TEMPLATES?: Record<string, MailTemplateFields>;
    __MAILCRAFT_CAN_EDIT_DB?: boolean;
    __mailcraftSaveTemplate?: (
      sceneId: string,
      payload: MailTemplateFields,
    ) => Promise<void>;
    getMailcraftBundledTemplatesForSeed?: () => Record<string, MailTemplateFields>;
  }
}

export default function MailCraftApp() {
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const initStarted = useRef(false);

  useEffect(() => {
    const syncLang = () => {
      const lang = getStoredLang();
      window.__ATCS_LANG = lang;
      return lang;
    };
    syncLang();
    const onLang = (e: Event) => {
      const detail = (e as CustomEvent<'zh' | 'en'>).detail;
      if (detail) window.__ATCS_LANG = detail;
    };
    window.addEventListener('atcs-lang-change', onLang);
    return () => window.removeEventListener('atcs-lang-change', onLang);
  }, []);

  useEffect(() => {
    if (initStarted.current) return;
    initStarted.current = true;

    const boot = async () => {
      const lang = getStoredLang();
      window.__ATCS_LANG = lang;

      if (isSupabaseConfigured()) {
        const templates = await fetchMailTemplates();
        if (templates) window.__MAILCRAFT_DB_TEMPLATES = templates;
        const profile = await fetchProfile();
        window.__MAILCRAFT_CAN_EDIT_DB = profile ? isEditorOrAdmin(profile.role) : false;
        window.__mailcraftSaveTemplate = async (sceneId, payload) => {
          await upsertMailTemplate(sceneId, payload);
          window.__MAILCRAFT_DB_TEMPLATES = {
            ...(window.__MAILCRAFT_DB_TEMPLATES ?? {}),
            [sceneId]: payload,
          };
        };
      }

      const finishInit = () => {
        window.dispatchEvent(new CustomEvent('atcs-lang-change', { detail: lang }));
        setReady(true);
      };

      const loadScript = () =>
        new Promise<void>((resolve, reject) => {
          if (window.initMailCraft) {
            window.initMailCraft();
            resolve();
            return;
          }
          const existing = document.querySelector('script[data-mailcraft-init]');
          if (existing) {
            existing.addEventListener('load', () => resolve());
            return;
          }
          const s = document.createElement('script');
          s.src = '/legacy/mailcraft-init.js';
          s.async = true;
          s.dataset.mailcraftInit = 'true';
          s.onload = () => {
            try {
              window.initMailCraft?.();
              resolve();
            } catch (err) {
              reject(err);
            }
          };
          s.onerror = () => reject(new Error('无法加载 MailCraft 脚本'));
          document.body.appendChild(s);
        });

      try {
        await loadScript();
        finishInit();
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : 'MailCraft 初始化失败');
      }
    };

    void boot();
  }, []);

  return (
    <div className="mailcraft-root">
      {loadError && (
        <div className="mailcraft-error" role="alert">
          {loadError}
        </div>
      )}
      {!ready && !loadError && (
        <div className="mailcraft-loading" aria-live="polite">
          正在加载 MailCraft…
        </div>
      )}
      <div
        className="main-container"
        style={{ visibility: ready && !loadError ? 'visible' : 'hidden' }}
      >
        <aside className="left-panel" id="leftPanel">
          <div>
            <div className="section-label">📋 选择回复场景</div>
            <div className="scene-grid" id="sceneGrid" />
          </div>
          <div>
            <div className="section-label">🧮 公式库与计算器</div>
            <div id="calcContainer" />
          </div>
        </aside>
        <aside className="mid-panel" id="midPanel">
          <div className="section-label">✏️ 填写参数</div>
          <div className="params-area" id="paramsArea" />
        </aside>
        <main className="right-panel" id="rightPanel">
          <div className="preview-header">
            <span className="section-label preview-label">📧 邮件预览（可手动编辑）</span>
            <div className="preview-actions">
              <span className="edit-indicator" id="editIndicator" style={{ display: 'none' }}>
                ⚠ 已手动修改
              </span>
              <button type="button" className="btn btn-ghost" id="editTemplateBtn">
                ✎ 编辑模板
              </button>
            </div>
          </div>
          <input
            type="text"
            className="preview-subject-input"
            id="previewSubject"
            placeholder="邮件主题将在此显示..."
          />
          <textarea
            className="preview-body-textarea"
            id="previewBody"
            placeholder="填写左侧参数后，预览自动更新。"
          />
          <div className="btn-row">
            <button type="button" className="btn btn-primary" id="copyBtn">
              📋 复制全文
            </button>
            <button type="button" className="btn btn-ghost" id="resetBtn">
              🔄 重置预览
            </button>
          </div>
        </main>
      </div>
      <div className="toast" id="toast" />
    </div>
  );
}
