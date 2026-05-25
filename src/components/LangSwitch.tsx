import { useLang } from '../lib/lang-context';
import type { Lang } from '../lib/i18n';

export default function LangSwitch() {
  const { lang, setLang } = useLang();

  return (
    <div className="global-lang-switch">
      {(['zh', 'en'] as Lang[]).map((code) => (
        <button
          key={code}
          type="button"
          className={`lang-global-btn${lang === code ? ' active' : ''}`}
          onClick={() => setLang(code)}
        >
          {code === 'zh' ? '中文' : 'EN'}
        </button>
      ))}
    </div>
  );
}
