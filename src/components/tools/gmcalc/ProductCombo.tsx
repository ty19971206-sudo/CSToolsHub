import { useDeferredValue, useEffect, useMemo, useRef, useState, startTransition } from 'react';
import { useLang } from '../../../lib/lang-context';
import { productComboLabel, productDisplayName } from '../../../lib/tools/gmcalc/productDisplay';
import type { ProductSpec } from '../../../lib/tools/gmcalc/types';

type Props = {
  products: ProductSpec[];
  value: string;
  disabled?: boolean;
  placeholder: string;
  onChange: (code: string) => void;
};

export default function ProductCombo({
  products,
  value,
  disabled,
  placeholder,
  onChange,
}: Props) {
  const { lang } = useLang();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = useState('');
  /** Filter text only while user is typing; empty = show full product list */
  const [listFilter, setListFilter] = useState('');
  const [open, setOpen] = useState(false);

  const selected = products.find((p) => p.code === value);

  useEffect(() => {
    if (selected) setInputText(productComboLabel(selected, lang));
    else if (!value) setInputText('');
  }, [value, selected, lang]);

  const deferredFilter = useDeferredValue(listFilter);
  const filtered = useMemo(() => {
    const q = deferredFilter.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => {
      const label = productComboLabel(p, lang).toLowerCase();
      const nameZh = p.name.toLowerCase();
      return (
        p.code.toLowerCase().includes(q) ||
        label.includes(q) ||
        nameZh.includes(q)
      );
    });
  }, [products, deferredFilter, lang]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setListFilter('');
      }
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  function pick(code: string) {
    const p = products.find((x) => x.code === code);
    onChange(code);
    if (p) setInputText(productComboLabel(p, lang));
    setListFilter('');
    setOpen(false);
  }

  function onInputChange(text: string) {
    setInputText(text);
    setOpen(true);
    startTransition(() => {
      setListFilter(text);
      const exact = products.find((p) => {
        const label = productComboLabel(p, lang).toLowerCase();
        const t = text.trim().toLowerCase();
        return p.code.toLowerCase() === t || label === t;
      });
      if (exact) onChange(exact.code);
      else if (!text.trim()) onChange('');
    });
  }

  return (
    <div className="product-combo" ref={wrapRef}>
      <input
        type="text"
        className="product-combo-input"
        disabled={disabled}
        placeholder={placeholder}
        value={inputText}
        onChange={(e) => onInputChange(e.target.value)}
        onFocus={() => {
          setListFilter('');
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && filtered[0]) {
            e.preventDefault();
            pick(filtered[0].code);
          }
          if (e.key === 'Escape') {
            setOpen(false);
            setListFilter('');
          }
        }}
        autoComplete="off"
      />
      {open && !disabled && filtered.length > 0 && (
        <ul className="product-combo-list" role="listbox">
          {filtered.map((p) => (
            <li key={p.code}>
              <button
                type="button"
                className={value === p.code ? 'active' : ''}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(p.code)}
              >
                <span className="combo-code">{p.code}</span>
                <span className="combo-name">{productDisplayName(p, lang)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
