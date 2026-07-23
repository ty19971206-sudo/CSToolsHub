import { logAudit } from '../../audit';
import { getSupabase } from '../../supabase/client';
import { defaultProducts } from './defaultProducts';
import type { ProductSpec } from './types';

type DbRow = {
  code: string;
  name: string;
  contract_unit: number;
  contract_unit_raw: string;
  contract_unit_hint: string;
  quote_currency: string | null;
  max_leverage: number | null;
};

function rowToSpec(row: DbRow): ProductSpec {
  return {
    code: row.code,
    name: row.name,
    contractUnit: Number(row.contract_unit),
    contractUnitRaw: row.contract_unit_raw ?? '',
    contractUnitHint: row.contract_unit_hint ?? '',
    quoteCurrency: row.quote_currency,
    maxLeverage: row.max_leverage != null ? Number(row.max_leverage) : null,
  };
}

function specToRow(spec: ProductSpec): DbRow {
  return {
    code: spec.code,
    name: spec.name,
    contract_unit: spec.contractUnit,
    contract_unit_raw: spec.contractUnitRaw,
    contract_unit_hint: spec.contractUnitHint,
    quote_currency: spec.quoteCurrency,
    max_leverage: spec.maxLeverage,
  };
}

export async function fetchProductSpecs(): Promise<ProductSpec[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('product_specs')
    .select(
      'code, name, contract_unit, contract_unit_raw, contract_unit_hint, quote_currency, max_leverage',
    )
    .order('code');
  if (error || !data?.length) return null;
  return (data as DbRow[]).map(rowToSpec);
}

export async function seedProductSpecsFromDefaults() {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const rows = defaultProducts.map(specToRow);
  for (let i = 0; i < rows.length; i += 50) {
    const chunk = rows.slice(i, i + 50);
    const { error } = await supabase.from('product_specs').upsert(
      chunk.map((r) => ({ ...r, updated_at: new Date().toISOString() })),
      { onConflict: 'code' },
    );
    if (error) throw error;
  }
  await logAudit('product_specs.seed', { count: defaultProducts.length });
}

export async function upsertProductSpec(spec: ProductSpec) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.from('product_specs').upsert(
    { ...specToRow(spec), updated_at: new Date().toISOString() },
    { onConflict: 'code' },
  );
  if (error) throw error;
  await logAudit('product_specs.upsert', { code: spec.code });
}

export async function getProductSpecCount(): Promise<number> {
  const supabase = getSupabase();
  if (!supabase) return 0;
  const { count } = await supabase
    .from('product_specs')
    .select('code', { count: 'exact', head: true });
  return count ?? 0;
}
