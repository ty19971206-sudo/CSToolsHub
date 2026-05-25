import { useEffect, useRef, useState } from 'react';
import { getStoredLang } from '../../lib/i18n';
import './mailcraft/mailcraft.css';

declare global {
  interface Window {
    initMailCraft?: () => void;
  }
}

export default function MailCraftApp() {
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const initStarted = useRef(false);

  useEffect(() => {
    window.__ATCS_LANG = getStoredLang();
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

    const boot = () => {
      if (window.initMailCraft) {
        window.initMailCraft();
        setReady(true);
        return;
      }
      const existing = document.querySelector('script[data-mailcraft-init]');
      if (existing) return;

      const s = document.createElement('script');
      s.src = '/legacy/mailcraft-init.js';
      s.async = true;
      s.dataset.mailcraftInit = 'true';
      s.onload = () => {
        try {
          window.initMailCraft?.();
          setReady(true);
        } catch (err) {
          setLoadError(err instanceof Error ? err.message : 'MailCraft 初始化失败');
        }
      };
      s.onerror = () => setLoadError('无法加载 MailCraft 脚本，请刷新页面重试');
      document.body.appendChild(s);
    };

    const id = requestAnimationFrame(boot);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="mailcraft-root">
      <div className="mailcraft-toolbar">
        <span className="shortcut-hint">Ctrl+Enter 快速复制</span>
      </div>
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
