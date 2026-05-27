import type { ProductSpec } from './types';
import { parseContractUnitRaw } from './contractUnit';
import { normalizeCurrency } from './fx';

function parseLeverageCell(raw: string): number | null {
  const s = String(raw || '').trim();
  if (!s || /^NA$/i.test(s) || s === '不适用') return null;
  const m = s.match(/1\s*:\s*(\d+)/i);
  return m ? parseInt(m[1], 10) : null;
}

function parseCurrencyCell(raw: string): string | null {
  const s = String(raw || '').trim();
  if (!s || s === '不适用') return null;
  const map: Record<string, string> = {
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
  if (/^[A-Za-z]{3}$/.test(s)) return s.toUpperCase();
  return normalizeCurrency(s);
}

function colIndex(headers: string[], aliases: string[]): number {
  const norm = (h: string) => h.replace(/\s/g, '').toLowerCase();
  const hs = headers.map(norm);
  for (const a of aliases) {
    const i = hs.findIndex((h) => h.includes(norm(a)) || norm(a).includes(h));
    if (i >= 0) return i;
  }
  return -1;
}

function rowToProduct(cells: string[]): ProductSpec | null {
  if (cells.length < 4) return null;
  const code = cells[0]?.trim();
  if (!code || code === '产品') return null;
  const name = cells[1]?.trim() ?? code;
  const contractUnitRaw = cells.length >= 5 ? cells[4] : cells[3];
  const currencyRaw = cells.length >= 7 ? cells[6] : cells[5];
  const maxLevRaw = cells.length >= 8 ? cells[7] : cells[6];
  const cu = parseContractUnitRaw(contractUnitRaw ?? '');
  if (cu.value <= 0) return null;
  return {
    code,
    name,
    contractUnit: cu.value,
    contractUnitRaw: cu.unitRaw,
    contractUnitHint: cu.unit,
    quoteCurrency: parseCurrencyCell(currencyRaw ?? ''),
    maxLeverage: parseLeverageCell(maxLevRaw ?? ''),
  };
}

/** Parse markdown table rows from ATFX_GM_Spec style content */
export function parseMarkdownSpec(text: string): ProductSpec[] {
  const products: ProductSpec[] = [];
  const seen = new Set<string>();
  for (const line of text.split(/\r?\n/)) {
    if (!line.startsWith('|') || line.includes('---')) continue;
    const cells = line
      .split('|')
      .map((c) => c.trim())
      .filter((_, i, arr) => i > 0 && i < arr.length - 1);
    if (cells.length < 8) continue;
    const p = rowToProduct(cells);
    if (p && !seen.has(p.code)) {
      seen.add(p.code);
      products.push(p);
    }
  }
  return products;
}

/** Parse CSV/TSV pasted text with header row */
export function parseTableSpec(text: string): ProductSpec[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];

  const delim = lines[0].includes('\t') ? '\t' : lines[0].includes(';') ? ';' : ',';
  const headers = lines[0].split(delim).map((h) => h.trim());
  const iCode = colIndex(headers, ['产品', '产品代码', 'symbol', 'code']);
  const iName = colIndex(headers, ['名称', 'name']);
  const iUnit = colIndex(headers, ['合约单位', 'contract']);
  const iCcy = colIndex(headers, ['货币', 'currency', '计价']);
  const iLev = colIndex(headers, ['最高杠杆', 'leverage', 'max']);

  const products: ProductSpec[] = [];
  const seen = new Set<string>();

  for (let r = 1; r < lines.length; r++) {
    const cells = lines[r].split(delim).map((c) => c.trim());
    const code = iCode >= 0 ? cells[iCode] : cells[0];
    if (!code) continue;
    const cu = parseContractUnitRaw(iUnit >= 0 ? cells[iUnit] : '');
    if (cu.value <= 0) continue;
    const p: ProductSpec = {
      code,
      name: iName >= 0 ? cells[iName] ?? code : code,
      contractUnit: cu.value,
      contractUnitRaw: cu.unitRaw,
      contractUnitHint: cu.unit,
      quoteCurrency: parseCurrencyCell(iCcy >= 0 ? cells[iCcy] : ''),
      maxLeverage: parseLeverageCell(iLev >= 0 ? cells[iLev] : ''),
    };
    if (!seen.has(p.code)) {
      seen.add(p.code);
      products.push(p);
    }
  }
  return products;
}

/** Parse 2D array from xlsx sheet */
export function parseSheetRows(rows: unknown[][]): ProductSpec[] {
  if (rows.length < 2) return [];
  const headers = (rows[0] as unknown[]).map((c) => String(c ?? '').trim());
  const iCode = colIndex(headers, ['产品', '产品代码', 'symbol']);
  const iName = colIndex(headers, ['名称', 'name']);
  const iUnit = colIndex(headers, ['合约单位', 'contract']);
  const iCcy = colIndex(headers, ['货币', 'currency']);
  const iLev = colIndex(headers, ['最高杠杆', 'leverage']);

  const products: ProductSpec[] = [];
  const seen = new Set<string>();
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r] as unknown[];
    const cells = row.map((c) => String(c ?? '').trim());
    const code = iCode >= 0 ? cells[iCode] : cells[0];
    if (!code) continue;
    const cu = parseContractUnitRaw(iUnit >= 0 ? cells[iUnit] : '');
    if (cu.value <= 0) continue;
    const p: ProductSpec = {
      code,
      name: iName >= 0 ? cells[iName] ?? code : code,
      contractUnit: cu.value,
      contractUnitRaw: cu.unitRaw,
      contractUnitHint: cu.unit,
      quoteCurrency: parseCurrencyCell(iCcy >= 0 ? cells[iCcy] : ''),
      maxLeverage: parseLeverageCell(iLev >= 0 ? cells[iLev] : ''),
    };
    if (!seen.has(p.code)) {
      seen.add(p.code);
      products.push(p);
    }
  }
  return products;
}
