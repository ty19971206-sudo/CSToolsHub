import type { ProductSpec } from './types';

const PRODUCTS_KEY = 'gmcalc_products_v1';

export function loadStoredProducts(): ProductSpec[] | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ProductSpec[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

export function saveStoredProducts(products: ProductSpec[]) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}
