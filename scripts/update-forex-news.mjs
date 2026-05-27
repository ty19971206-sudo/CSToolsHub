/**
 * Fetch major FX/macro headlines from public RSS feeds and update homepage news data.
 * Run: node scripts/update-forex-news.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outPath = path.join(root, 'src/data/forex-news.json');
const DEEPLX_URL = process.env.DEEPLX_URL || '';

const FEEDS = [
  'https://www.forexlive.com/feed/news',
  'https://www.ecb.europa.eu/rss/press.html',
  'https://www.federalreserve.gov/feeds/press_monetary.xml',
];

const KEYWORDS = [
  'forex',
  'fx',
  'margin',
  'leverage',
  'rate',
  'interest',
  'fed',
  'ecb',
  'boj',
  'inflation',
  'cpi',
  'nfp',
  'usd',
  'eur',
  'jpy',
  'central bank',
  'policy',
  'non-farm',
];

function decodeXml(text) {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function stripHtml(text) {
  return text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function pickTag(block, tag) {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return m ? decodeXml(m[1]) : '';
}

function parseItems(xml) {
  const blocks = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];
  return blocks.map((block) => {
    const title = stripHtml(pickTag(block, 'title'));
    const link = stripHtml(pickTag(block, 'link'));
    const pubDate = stripHtml(pickTag(block, 'pubDate') || pickTag(block, 'published'));
    const source = stripHtml(
      pickTag(block, 'source') || pickTag(block, 'dc:creator') || pickTag(block, 'author')
    );
    const description = stripHtml(pickTag(block, 'description') || pickTag(block, 'content:encoded'));
    return { title, link, pubDate, source, description };
  });
}

function toISODate(value) {
  const d = new Date(value);
  return Number.isNaN(d.valueOf()) ? new Date().toISOString() : d.toISOString();
}

function scoreText(text) {
  const low = text.toLowerCase();
  return KEYWORDS.reduce((acc, k) => (low.includes(k) ? acc + 1 : acc), 0);
}

function impactSummary(title) {
  const low = title.toLowerCase();
  if (/(fed|ecb|boj|central bank|rate|policy)/.test(low)) {
    return {
      zh: '央行政策预期变化可能提升主要货币对波动，杠杆仓位的保证金与回撤压力上升。',
      en: 'Shifts in central-bank expectations may increase major-pair volatility and raise margin/drawdown pressure on leveraged positions.',
    };
  }
  if (/(cpi|inflation|nfp|jobs|payroll)/.test(low)) {
    return {
      zh: '关键宏观数据超预期时，点差与滑点风险通常放大，建议降低仓位并控制杠杆。',
      en: 'When macro data surprises, spread/slippage risk often widens; consider smaller position size and tighter leverage control.',
    };
  }
  return { zh: '', en: '' };
}

function makeSummary(description, title) {
  const base = description && description.length > 20 ? description : title;
  return base.replace(/\s+/g, ' ').trim();
}

function detectLang(text) {
  return /[\u4e00-\u9fff]/.test(text) ? 'ZH' : 'EN';
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const DEEPLX_CHUNK = 1200;

async function deeplxTranslate(text, targetLang) {
  if (!DEEPLX_URL || !text?.trim()) return null;
  const payload = {
    text,
    source_lang: 'auto',
    target_lang: targetLang,
  };
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const res = await fetch(DEEPLX_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`DeepLX ${res.status}`);
      const data = await res.json();
      const out = (data?.data || data?.translation || data?.text || '').toString().trim();
      if (out && out !== text) return out;
      if (out) return out;
      throw new Error('DeepLX empty response');
    } catch (err) {
      lastErr = err;
      await sleep(400 * (attempt + 1));
    }
  }
  throw lastErr;
}

async function deeplxTranslateLong(text, targetLang) {
  if (!text?.trim()) return null;
  if (text.length <= DEEPLX_CHUNK) return deeplxTranslate(text, targetLang);

  const parts = [];
  let rest = text;
  while (rest.length > 0) {
    let chunk = rest.slice(0, DEEPLX_CHUNK);
    if (rest.length > DEEPLX_CHUNK) {
      const sentenceEnd = Math.max(chunk.lastIndexOf('. '), chunk.lastIndexOf('。'));
      if (sentenceEnd > DEEPLX_CHUNK * 0.4) chunk = chunk.slice(0, sentenceEnd + 1);
    }
    const translated = (await deeplxTranslate(chunk.trim(), targetLang)) || chunk.trim();
    parts.push(translated);
    rest = rest.slice(chunk.length).trim();
  }
  return parts.join(' ');
}

async function fetchFeed(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'ATCS-NewsBot/1.0 (+https://cstools-hub.netlify.app)',
      Accept: 'application/rss+xml, application/xml, text/xml, */*',
    },
  });
  if (!res.ok) throw new Error(`Fetch failed ${res.status} for ${url}`);
  return res.text();
}

function readExisting() {
  try {
    return JSON.parse(fs.readFileSync(outPath, 'utf8'));
  } catch {
    return { updatedAt: new Date().toISOString(), items: [] };
  }
}

async function main() {
  const existing = readExisting();
  const candidates = [];

  for (const url of FEEDS) {
    try {
      const xml = await fetchFeed(url);
      const items = parseItems(xml);
      for (const item of items) {
        const score = scoreText(`${item.title} ${item.description}`);
        if (!item.title || !item.link || score < 1) continue;
        const impact = impactSummary(item.title);
        const summary = makeSummary(item.description, item.title);
        const impactZh = impact.zh;
        const impactEn = impact.en;

        let summaryZh = detectLang(summary) === 'ZH' ? summary : null;
        let summaryEn = detectLang(summary) === 'EN' ? summary : null;

        // Optional DeepLX translation (if DEEPLX_URL is provided)
        if (DEEPLX_URL) {
          try {
            if (!summaryZh) summaryZh = await deeplxTranslateLong(summary, 'ZH');
            if (!summaryEn) summaryEn = await deeplxTranslateLong(summary, 'EN');
          } catch (e) {
            console.warn('[news] DeepLX translate failed, fallback to original summary');
            console.warn(String(e));
          }
        }

        candidates.push({
          title: item.title,
          url: item.link,
          source: item.source || new URL(url).hostname,
          publishedAt: toISODate(item.pubDate),
          summary,
          summaryZh: summaryZh || summary,
          summaryEn: summaryEn || summary,
          impactZh,
          impactEn,
          score,
        });
      }
    } catch (err) {
      console.warn(`[news] feed error: ${url}`);
      console.warn(String(err));
    }
  }

  const unique = [];
  const seen = new Set();
  for (const row of candidates) {
    const key = row.url.split('?')[0];
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(row);
  }

  unique.sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score;
    return new Date(b.publishedAt).valueOf() - new Date(a.publishedAt).valueOf();
  });

  const top = unique.slice(0, 3).map(({ score, ...rest }) => rest);

  const next =
    top.length > 0
      ? { updatedAt: new Date().toISOString(), items: top }
      : {
          updatedAt: existing.updatedAt || new Date().toISOString(),
          items: existing.items || [],
        };

  fs.writeFileSync(outPath, `${JSON.stringify(next, null, 2)}\n`);
  console.log(`[news] wrote ${next.items.length} items to ${path.relative(root, outPath)}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
