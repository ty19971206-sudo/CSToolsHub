export type SymbolKind = 'usdQuote' | 'usdBase' | 'metal' | 'index' | 'other';

const INDEX_CODES = new Set([
  'CHI50',
  'HK50',
  'HKCH50',
  'AUS200',
  'EU50',
  'ESP35',
  'FRA40',
  'GER30',
  'IT40',
  'JP225',
  'UK100',
  'US30',
  'NAS100',
  'SPX500',
  'US2000',
  'USDX',
]);

/** Classify symbol for margin / P&L currency conventions */
export function classifySymbol(code: string): SymbolKind {
  const c = code.toUpperCase().replace(/\..*$/, '');
  if (c.length === 6 && c.startsWith('USD')) return 'usdBase';
  if (c.length === 6 && c.endsWith('USD')) return 'usdQuote';
  if (c.startsWith('XAU') || c.startsWith('XAG') || c.includes('GOLD') || c === 'RKGCNH') {
    return 'metal';
  }
  if (c.startsWith('USOIL') || c.startsWith('UKOIL') || c.includes('NGAS') || c.startsWith('HG_')) {
    return 'metal';
  }
  const indexKey = c.replace(/_MMMYY$/, '');
  if (INDEX_CODES.has(indexKey) || INDEX_CODES.has(c)) {
    return 'index';
  }
  return 'other';
}

export function getBaseQuote(code: string): { base: string; quote: string } | null {
  const c = code.toUpperCase().replace(/\..*$/, '');
  if (c.length >= 6) return { base: c.slice(0, 3), quote: c.slice(3, 6) };
  return null;
}
