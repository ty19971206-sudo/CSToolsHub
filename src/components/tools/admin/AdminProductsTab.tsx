import { useEffect, useState } from 'react';
import { defaultProducts } from '../../../lib/tools/gmcalc/defaultProducts';
import {
  getProductSpecCount,
  seedProductSpecsFromDefaults,
  upsertProductSpec,
} from '../../../lib/tools/gmcalc/supabase-products';
import type { ProductSpec } from '../../../lib/tools/gmcalc/types';

export default function AdminProductsTab() {
  const [count, setCount] = useState(0);
  const [msg, setMsg] = useState('');
  const [code, setCode] = useState('');
  const [spec, setSpec] = useState<ProductSpec | null>(null);

  async function refresh() {
    setCount(await getProductSpecCount());
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function onSeed() {
    setMsg('');
    try {
      await seedProductSpecsFromDefaults();
      setMsg(`已导入 ${defaultProducts.length} 条产品（内置 defaultProducts）`);
      await refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : String(e));
    }
  }

  function loadLocal() {
    const p = defaultProducts.find((x) => x.code === code);
    setSpec(p ?? null);
  }

  async function onPublish() {
    if (!spec) return;
    try {
      await upsertProductSpec(spec);
      setMsg(`已发布 ${spec.code}`);
      await refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <div>
      <p>数据库产品数：{count}（内置 {defaultProducts.length} 条）</p>
      <button type="button" className="admin-btn" onClick={() => void onSeed()}>
        从内置 defaultProducts 导入/更新全部
      </button>
      <div className="admin-editor-form">
        <label>
          产品 code
          <input value={code} onChange={(e) => setCode(e.target.value)} />
        </label>
        <button type="button" onClick={loadLocal}>
          从内置加载预览
        </button>
        {spec && (
          <>
            <pre className="admin-pre">{JSON.stringify(spec, null, 2)}</pre>
            <button type="button" className="admin-btn" onClick={() => void onPublish()}>
              发布此产品到 DB
            </button>
          </>
        )}
      </div>
      {msg && <p className="admin-msg">{msg}</p>}
    </div>
  );
}
