/** Parse contract unit text e.g. "100,000 欧元" → numeric value + unit hint */
export function parseContractUnitRaw(raw: string): {
  value: number;
  unitRaw: string;
  unit: string;
} {
  const s = String(raw || '').trim();
  const nums = s.replace(/,/g, '').match(/[\d.]+/g);
  const value = nums ? parseFloat(nums.join('')) : 0;
  const unit = s.replace(/[\d,.\s]/g, '').trim();
  return { value, unitRaw: s, unit };
}
