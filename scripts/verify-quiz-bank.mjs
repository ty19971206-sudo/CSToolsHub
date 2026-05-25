import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Dynamic import of compiled bank is not available; count via regex on bank.ts
import fs from 'fs';
import path from 'path';

const bankPath = path.join(process.cwd(), 'src/lib/tools/quiz/bank.ts');
const src = fs.readFileSync(bankPath, 'utf8');
const categories = [
  'Industry Terminology',
  'Company Background',
  'Trading Knowledge',
  'Product Knowledge',
  'Trading Groups',
  'Trading Calculations',
  'Trading Software',
  'Simulation',
  'Account Opening Process',
  'Deposit and Withdrawal Process',
  'Daily Workflow',
  'Commission Settings',
];

const counts = {};
for (const cat of categories) {
  const re = new RegExp(`addQuestion\\(\\s*["']${cat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g');
  const m = src.match(re);
  counts[cat] = m ? m.length : 0;
}

console.log('Quiz bank question counts:');
for (const [k, v] of Object.entries(counts)) {
  console.log(`  ${k}: ${v}`);
}
console.log('Total:', Object.values(counts).reduce((a, b) => a + b, 0));
