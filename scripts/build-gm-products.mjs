/**
 * Generates src/lib/tools/gmcalc/defaultProducts.ts from ATFX_GM_Spec.md
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const md = fs.readFileSync(path.join(root, 'ATFX_GM_Spec.md'), 'utf8');

function parseLeverage(raw) {
  const s = String(raw || '').trim();
  if (!s || /^NA$/i.test(s) || s === '不适用') return null;
  const m = s.match(/1\s*:\s*(\d+)/i);
  return m ? parseInt(m[1], 10) : null;
}

function parseContractUnit(raw) {
  const nums = String(raw || '').replace(/,/g, '').match(/[\d.]+/g);
  const value = nums ? parseFloat(nums.join('')) : 0;
  const unit = String(raw || '').replace(/[\d,.\s]/g, '').trim() || '';
  return { value, unitRaw: String(raw || '').trim(), unit };
}

function parseCurrency(raw) {
  const s = String(raw || '').trim();
  if (!s || s === '不适用') return null;
  const map = {
    美元: 'USD',
    欧元: 'EUR',
    英镑: 'GBP',
    港元: 'HKD',
    人民币: 'CNH',
    澳元: 'AUD',
    日元: 'JPY',
  };
  for (const [k, v] of Object.entries(map)) {
    if (s.includes(k)) return v;
  }
  if (/^[A-Z]{3}$/.test(s)) return s;
  return s;
}

const products = [];
for (const line of md.split('\n')) {
  if (!line.startsWith('|') || line.includes('---') || line.includes('产品')) continue;
  const cells = line
    .split('|')
    .map((c) => c.trim())
    .filter((_, i, arr) => i > 0 && i < arr.length - 1);
  if (cells.length < 8) continue;
  const [code, name, , , contractUnitRaw, , currencyRaw, maxLevRaw] = cells;
  if (!code || code === '产品') continue;
  const cu = parseContractUnit(contractUnitRaw);
  products.push({
    code,
    name,
    contractUnit: cu.value,
    contractUnitRaw: cu.unitRaw,
    contractUnitHint: cu.unit,
    quoteCurrency: parseCurrency(currencyRaw),
    maxLeverage: parseLeverage(maxLevRaw),
  });
}

const out = `/** Auto-generated from ATFX_GM_Spec.md — run: node scripts/build-gm-products.mjs */
import type { ProductSpec } from './types';

export const defaultProducts: ProductSpec[] = ${JSON.stringify(products, null, 2)} as ProductSpec[];
`;

fs.writeFileSync(path.join(root, 'src/lib/tools/gmcalc/defaultProducts.ts'), out);
console.log(`Wrote ${products.length} products`);
