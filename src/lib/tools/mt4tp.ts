export type Mt4Order = {
  ticket: string;
  openTime: string;
  type: string;
  volume: number;
  item: string;
  openPrice: number;
  sl: number;
  tp: number;
  closeTime: string;
  closePrice: number;
  commission: number;
  taxes: number;
  swap: number;
  profit: number;
};

export type Mt4SlippageOrder = Mt4Order & {
  slippagePoints: number;
  impactUSD: number;
  isFavorable: boolean;
};

export function robustParseNumber(value: unknown): number {
  if (value === undefined || value === null) return NaN;
  if (typeof value === 'number') return value;
  const str = String(value).trim().replace(/[\s,]/g, '');
  return parseFloat(str) || 0;
}

function getCleanText(cell: Element | null): string {
  if (!cell) return '';
  return (cell.textContent || '').replace(/\u00a0/g, ' ').trim();
}

function extractFullOrder(tdCells: NodeListOf<HTMLTableCellElement>): Mt4Order | null {
  if (tdCells.length < 12) return null;
  const ticketRaw = getCleanText(tdCells[0]);
  if (!ticketRaw || ticketRaw === 'Ticket' || ticketRaw === 'No transactions') return null;
  const typeRaw = getCleanText(tdCells[2]).toLowerCase();
  if (typeRaw === 'balance') return null;
  if (ticketRaw.includes('Deposit') || ticketRaw.includes('Withdrawal')) return null;

  const order: Mt4Order = {
    ticket: ticketRaw,
    openTime: getCleanText(tdCells[1]),
    type: typeRaw,
    volume: robustParseNumber(getCleanText(tdCells[3])),
    item: getCleanText(tdCells[4]),
    openPrice: robustParseNumber(getCleanText(tdCells[5])),
    sl: robustParseNumber(getCleanText(tdCells[6])),
    tp: robustParseNumber(getCleanText(tdCells[7])),
    closeTime: getCleanText(tdCells[8]),
    closePrice: robustParseNumber(getCleanText(tdCells[9])),
    commission: robustParseNumber(getCleanText(tdCells[10])),
    taxes: robustParseNumber(getCleanText(tdCells[11])),
    swap: tdCells[12] ? robustParseNumber(getCleanText(tdCells[12])) : 0,
    profit: tdCells[13] ? robustParseNumber(getCleanText(tdCells[13])) : 0,
  };
  if (order.volume === 0 && order.tp === 0 && order.closePrice === 0) return null;
  return order;
}

function isTpMarkerRow(rowElement: HTMLTableRowElement | null): boolean {
  if (!rowElement) return false;
  const cells = rowElement.querySelectorAll('td');
  for (const cell of cells) {
    const txt = getCleanText(cell);
    if (txt === '[tp]' || txt === '[TP]') return true;
  }
  return false;
}

export function getAllTakeProfitOrders(htmlDoc: Document): Mt4Order[] {
  const tables = htmlDoc.querySelectorAll('table');
  let targetTable: HTMLTableElement | null = null;
  for (const tbl of tables) {
    const text = tbl.innerText || '';
    if (text.includes('Closed Transactions') && text.includes('Ticket')) {
      targetTable = tbl;
      break;
    }
  }
  if (!targetTable) return [];

  const rows = targetTable.querySelectorAll('tr');
  const tpOrders: Mt4Order[] = [];
  for (let i = 0; i < rows.length; i++) {
    const curRow = rows[i];
    const cells = curRow.querySelectorAll('td');
    if (cells.length < 10) continue;
    const firstVal = getCleanText(cells[0]);
    const isTicket =
      !Number.isNaN(parseInt(firstVal, 10)) &&
      firstVal !== '' &&
      !firstVal.includes('Deposit') &&
      !firstVal.includes('Withdrawal');
    if (!isTicket) continue;
    const order = extractFullOrder(cells);
    if (!order || order.volume === 0) continue;
    const nextRow = i + 1 < rows.length ? rows[i + 1] : null;
    if (nextRow && isTpMarkerRow(nextRow)) {
      tpOrders.push(order);
      i++;
    }
  }
  return tpOrders;
}

export function filterSlippageOrders(tpOrders: Mt4Order[]): Mt4SlippageOrder[] {
  return tpOrders
    .filter((order) => {
      if (Number.isNaN(order.tp) || Number.isNaN(order.closePrice)) return false;
      return Math.abs(order.tp - order.closePrice) > 1e-8;
    })
    .map((order) => {
      const slipPoints =
        order.type === 'buy' ? order.closePrice - order.tp : order.tp - order.closePrice;
      const impactUsd = parseFloat((slipPoints * order.volume * 100).toFixed(2));
      return {
        ...order,
        slippagePoints: slipPoints,
        impactUSD: impactUsd,
        isFavorable: slipPoints > 0,
      };
    });
}

export async function parseMt4HtmFile(file: File): Promise<{
  tpOrders: Mt4Order[];
  slippage: Mt4SlippageOrder[];
}> {
  const content = await file.text();
  const doc = new DOMParser().parseFromString(content, 'text/html');
  if (!doc.body?.innerText.trim()) {
    throw new Error('INVALID_HTML');
  }
  const tpOrders = getAllTakeProfitOrders(doc);
  const slippage = filterSlippageOrders(tpOrders);
  return { tpOrders, slippage };
}
