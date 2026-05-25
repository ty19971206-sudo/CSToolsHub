import * as XLSX from 'xlsx';

export type Mt5DealRow = {
  ticket: string;
  time: string;
  item: string;
  type: string;
  direction: string;
  volume: number;
  price: number;
  profit: number;
  comment: string;
};

export type Mt5SlippageOrder = Mt5DealRow & {
  tpPrice: number;
  origDir: string;
  slipDiff: number;
  isFavorable: boolean;
  isSlippage: boolean;
};

export function robustParseNumber(value: unknown): number {
  if (value === undefined || value === null) return NaN;
  if (typeof value === 'number') return value;
  const str = String(value).trim().replace(/[\s,]/g, '');
  return parseFloat(str) || 0;
}

function getCleanText(cell: unknown): string {
  if (cell === undefined || cell === null) return '';
  return String(cell).replace(/\u00a0/g, ' ').trim();
}

export function extractTpFromComment(comment: string): number | null {
  if (!comment) return null;
  const match = String(comment).trim().match(/\[tp\s+([\d.]+)\]/i);
  return match?.[1] ? robustParseNumber(match[1]) : null;
}

type DealTableInfo = {
  dataStartIndex: number;
  dataEndIndex: number;
  colMap: Record<string, number>;
};

export function locateDealTable(rows: unknown[][]): DealTableInfo | null {
  if (!rows?.length) return null;
  let dealMarkerIndex = -1;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row?.length) continue;
    const firstCell = getCleanText(row[0]);
    if (firstCell === '成交' || firstCell.includes('成交')) {
      dealMarkerIndex = i;
      break;
    }
  }
  if (dealMarkerIndex < 0) return null;

  let headerRowIndex = -1;
  for (let i = dealMarkerIndex + 1; i < Math.min(dealMarkerIndex + 10, rows.length); i++) {
    const row = rows[i];
    if (!row || row.length < 5) continue;
    if (getCleanText(row[0]) === '时间' && getCleanText(row[1]) === '成交') {
      headerRowIndex = i;
      break;
    }
  }
  if (headerRowIndex < 0) return null;

  const headerRow = rows[headerRowIndex] as unknown[];
  const colMap: Record<string, number> = {};
  for (let j = 0; j < headerRow.length; j++) colMap[getCleanText(headerRow[j])] = j;

  const required = ['时间', '成交', '类型', '趋势', '价格', '注释'];
  for (const c of required) {
    if (!(c in colMap)) {
      let found = false;
      for (const key of Object.keys(colMap)) {
        if (key.includes(c) || c.includes(key)) {
          colMap[c] = colMap[key];
          found = true;
          break;
        }
      }
      if (!found) return null;
    }
  }

  const dataStart = headerRowIndex + 1;
  let dataEnd = dataStart;
  for (let i = dataStart; i < rows.length; i++) {
    const row = rows[i];
    if (!row?.length) {
      dataEnd = i;
      break;
    }
    const fc = getCleanText(row[0]);
    if (fc === '' || fc === '结果' || fc === '结余:' || fc === '总净盈利:') {
      dataEnd = i;
      break;
    }
    if (!/\d{4}\.\d{2}\.\d{2}/.test(fc) && i > dataStart + 5) {
      dataEnd = i;
      break;
    }
    dataEnd = i + 1;
  }

  return { dataStartIndex: dataStart, dataEndIndex: dataEnd, colMap };
}

function parseDealRow(row: unknown[], colMap: Record<string, number>): Mt5DealRow | null {
  const ticket = getCleanText(row[colMap['成交'] ?? 1]);
  const timeVal = getCleanText(row[colMap['时间'] ?? 0]);
  const item = getCleanText(row[colMap['交易品种'] ?? 2]);
  const typeVal = getCleanText(row[colMap['类型'] ?? 3]);
  const direction = getCleanText(row[colMap['趋势'] ?? 4]);
  const volume = robustParseNumber(row[colMap['交易量'] ?? 5]);
  const price = robustParseNumber(row[colMap['价格'] ?? 6]);
  const profit = robustParseNumber(row[colMap['盈利'] ?? 11]);
  const comment = getCleanText(row[colMap['注释'] ?? 13]);

  if (!ticket || Number.isNaN(parseInt(ticket, 10))) return null;

  return {
    ticket,
    time: timeVal,
    item,
    type: typeVal.toLowerCase(),
    direction: direction.toLowerCase(),
    volume,
    price,
    profit,
    comment,
  };
}

export function analyzeXlsxRows(rows: unknown[][]): {
  dealRows: Mt5DealRow[];
  tpOrders: (Mt5DealRow & { tpPrice: number; isSlippage: boolean })[];
  slippageOrders: Mt5SlippageOrder[];
} {
  const dealInfo = locateDealTable(rows);
  if (!dealInfo) throw new Error('NO_DEAL_TABLE');

  const { dataStartIndex, dataEndIndex, colMap } = dealInfo;
  const dealRows: Mt5DealRow[] = [];
  const tpOrders: (Mt5DealRow & { tpPrice: number; isSlippage: boolean })[] = [];

  for (let i = dataStartIndex; i < dataEndIndex; i++) {
    const row = rows[i];
    if (!row || (row as unknown[]).length < 5) continue;
    const parsed = parseDealRow(row as unknown[], colMap);
    if (!parsed) continue;
    if (parsed.direction !== 'out') continue;
    dealRows.push(parsed);

    const tpPrice = extractTpFromComment(parsed.comment);
    if (tpPrice !== null && !Number.isNaN(tpPrice)) {
      tpOrders.push({
        ...parsed,
        tpPrice,
        isSlippage: Math.abs(parsed.price - tpPrice) > 1e-8,
      });
    }
  }

  const slippageOrders: Mt5SlippageOrder[] = tpOrders
    .filter((o) => o.isSlippage)
    .map((order) => {
      let origDir: string;
      let slipDiff: number;
      if (order.type === 'sell') {
        origDir = 'buy';
        slipDiff = order.price - order.tpPrice;
      } else if (order.type === 'buy') {
        origDir = 'sell';
        slipDiff = order.tpPrice - order.price;
      } else {
        origDir = order.type;
        slipDiff = Math.abs(order.price - order.tpPrice);
      }
      return { ...order, origDir, slipDiff, isFavorable: slipDiff > 0 };
    });

  return { dealRows, tpOrders, slippageOrders };
}

export async function parseMt5XlsxFile(file: File) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' }) as unknown[][];
  if (!rows?.length) throw new Error('EMPTY_FILE');
  return analyzeXlsxRows(rows);
}
