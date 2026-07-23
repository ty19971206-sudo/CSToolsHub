import { useEffect, useMemo, useState } from 'react';
import { useLang } from '../../../lib/lang-context';
import {
  MAIL_SCENES,
  getMailScene,
  previewMailText,
} from '../../../lib/tools/mailcraft/mail-scenes';
import {
  fetchMailTemplates,
  seedMailTemplatesFromBundled,
  upsertMailTemplate,
  type MailTemplateFields,
} from '../../../lib/tools/mailcraft/supabase-mail';

type EditLang = 'zh' | 'en';

const copy = {
  zh: {
    howTitle: '如何使用',
    step1: '首次使用可点「从内置导入」写入默认中英文模板。',
    step2: '选择左侧场景，编辑主题与正文；变量用 {{变量名}}，与 MailCraft 一致。',
    step3: '保存后，客服在 MailCraft 打开同一场景即可使用数据库模板。',
    openMailcraft: '打开 MailCraft',
    import: '从内置导入模板',
    save: '保存到数据库',
    saved: '已保存',
    imported: '已从 MailCraft 内置场景导入',
    subject: '邮件主题',
    body: '邮件正文',
    preview: '预览（示例数据）',
    placeholders: '可用变量',
    noTemplate: '尚未保存模板，可先导入或手动填写后保存。',
    langZh: '中文',
    langEn: 'English',
  },
  en: {
    howTitle: 'How it works',
    step1: 'First time: click Import to load default EN/ZH templates.',
    step2: 'Pick a scene, edit subject/body. Use {{placeholders}} like MailCraft.',
    step3: 'After save, staff see DB templates when they open the same scene in MailCraft.',
    openMailcraft: 'Open MailCraft',
    import: 'Import built-in templates',
    save: 'Save to database',
    saved: 'Saved',
    imported: 'Imported from MailCraft built-ins',
    subject: 'Subject',
    body: 'Body',
    preview: 'Preview (sample data)',
    placeholders: 'Placeholders',
    noTemplate: 'No template saved yet. Import or edit, then save.',
    langZh: '中文',
    langEn: 'English',
  },
} as const;

export default function AdminMailTab() {
  const { lang } = useLang();
  const t = copy[lang];
  const [templates, setTemplates] = useState<Record<string, MailTemplateFields>>({});
  const [sceneId, setSceneId] = useState(MAIL_SCENES[0].id);
  const [editLang, setEditLang] = useState<EditLang>('zh');
  const [form, setForm] = useState<MailTemplateFields>({
    subjectZh: '',
    subjectEn: '',
    bodyZh: '',
    bodyEn: '',
  });
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const scene = getMailScene(sceneId);

  async function load() {
    const data = await fetchMailTemplates();
    if (data) setTemplates(data);
    const cur = data?.[sceneId];
    if (cur) setForm(cur);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const cur = templates[sceneId];
    if (cur) setForm(cur);
    else setForm({ subjectZh: '', subjectEn: '', bodyZh: '', bodyEn: '' });
  }, [sceneId, templates]);

  const hasContent = Boolean(
    form.subjectZh || form.subjectEn || form.bodyZh || form.bodyEn,
  );

  const preview = useMemo(() => {
    const subject = editLang === 'zh' ? form.subjectZh : form.subjectEn;
    const body = editLang === 'zh' ? form.bodyZh : form.bodyEn;
    return {
      subject: previewMailText(subject),
      body: previewMailText(body),
    };
  }, [editLang, form]);

  async function onSeed() {
    setMsg('');
    setBusy(true);
    const loadScript = () =>
      new Promise<void>((resolve, reject) => {
        if (window.getMailcraftBundledTemplatesForSeed) {
          resolve();
          return;
        }
        const s = document.createElement('script');
        s.src = '/legacy/mailcraft-init.js';
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('load mailcraft failed'));
        document.body.appendChild(s);
      });
    try {
      await loadScript();
      const bundled = window.getMailcraftBundledTemplatesForSeed?.();
      if (!bundled) throw new Error('no bundled templates');
      await seedMailTemplatesFromBundled(bundled);
      setMsg(t.imported);
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function onSave() {
    setBusy(true);
    setMsg('');
    try {
      await upsertMailTemplate(sceneId, form);
      setMsg(t.saved);
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  const subjectKey = editLang === 'zh' ? 'subjectZh' : 'subjectEn';
  const bodyKey = editLang === 'zh' ? 'bodyZh' : 'bodyEn';

  return (
    <div className="admin-mail">
      <div className="admin-mail-intro">
        <h3 className="admin-mail-intro-title">{t.howTitle}</h3>
        <ol className="admin-mail-steps">
          <li>{t.step1}</li>
          <li>{t.step2}</li>
          <li>{t.step3}</li>
        </ol>
        <div className="admin-mail-toolbar">
          <button
            type="button"
            className="admin-btn admin-btn--secondary"
            disabled={busy}
            onClick={() => void onSeed()}
          >
            {t.import}
          </button>
          <a className="admin-btn admin-btn--ghost" href="/tools/mailcraft/">
            {t.openMailcraft} →
          </a>
        </div>
      </div>

      <div className="admin-mail-layout">
        <aside className="admin-mail-scenes" aria-label="Scenes">
          {MAIL_SCENES.map((s) => {
            const saved = Boolean(templates[s.id]);
            return (
              <button
                key={s.id}
                type="button"
                className={`admin-mail-scene-card${sceneId === s.id ? ' is-active' : ''}`}
                onClick={() => setSceneId(s.id)}
              >
                <span className="admin-mail-scene-icon" aria-hidden="true">
                  {s.icon}
                </span>
                <span className="admin-mail-scene-name">
                  {lang === 'zh' ? s.nameZh : s.nameEn}
                </span>
                <span className="admin-mail-scene-desc">
                  {lang === 'zh' ? s.descZh : s.descEn}
                </span>
                {saved && <span className="admin-mail-scene-badge">✓</span>}
              </button>
            );
          })}
        </aside>

        <div className="admin-mail-editor">
          {scene && (
            <p className="admin-mail-scene-hint">{lang === 'zh' ? scene.descZh : scene.descEn}</p>
          )}

          {!hasContent && <p className="admin-mail-empty">{t.noTemplate}</p>}

          <div className="admin-mail-lang-tabs">
            <button
              type="button"
              className={`admin-mail-lang-tab${editLang === 'zh' ? ' is-active' : ''}`}
              onClick={() => setEditLang('zh')}
            >
              {t.langZh}
            </button>
            <button
              type="button"
              className={`admin-mail-lang-tab${editLang === 'en' ? ' is-active' : ''}`}
              onClick={() => setEditLang('en')}
            >
              {t.langEn}
            </button>
          </div>

          <label className="admin-mail-field">
            <span>{t.subject}</span>
            <input
              type="text"
              value={form[subjectKey]}
              onChange={(e) => setForm((f) => ({ ...f, [subjectKey]: e.target.value }))}
            />
          </label>
          <label className="admin-mail-field">
            <span>{t.body}</span>
            <textarea
              rows={12}
              value={form[bodyKey]}
              onChange={(e) => setForm((f) => ({ ...f, [bodyKey]: e.target.value }))}
            />
          </label>

          {scene && (
            <div className="admin-mail-placeholders">
              <span className="admin-mail-placeholders-label">{t.placeholders}</span>
              <div className="admin-mail-placeholder-chips">
                {scene.placeholders.map((p) => (
                  <code key={p} className="admin-mail-chip">{`{{${p}}}`}</code>
                ))}
              </div>
            </div>
          )}

          <div className="admin-mail-actions">
            <button
              type="button"
              className="admin-btn"
              disabled={busy}
              onClick={() => void onSave()}
            >
              {t.save}
            </button>
            {msg && (
              <p className={`admin-msg${msg.includes('失败') || msg.includes('Error') ? ' admin-msg--err' : ''}`}>
                {msg}
              </p>
            )}
          </div>
        </div>

        <aside className="admin-mail-preview">
          <h4>{t.preview}</h4>
          <div className="admin-mail-preview-card">
            <p className="admin-mail-preview-subject">{preview.subject || '—'}</p>
            <pre className="admin-mail-preview-body">{preview.body || '—'}</pre>
          </div>
        </aside>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    getMailcraftBundledTemplatesForSeed?: () => Record<string, MailTemplateFields>;
  }
}
