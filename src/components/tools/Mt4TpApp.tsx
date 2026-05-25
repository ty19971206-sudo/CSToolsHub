import { useEffect, useState } from 'react';
import { useLang } from '../../lib/lang-context';
import { parseMt4HtmFile, type Mt4SlippageOrder } from '../../lib/tools/mt4tp';
import './tp-tools.css';

const translations = {
  zh: {
    titleText: 'MT4 TP',
    subtitle:
      '上传 HTM 交易报表 · 提取所有 [tp] 标记订单 · 自动列出止盈价与实际平仓价不匹配的订单',
    selectFileBtn: '选择文件',
    analyzeBtn: '🔍 提取止盈滑点订单',
    statTotal: '🏷️ 止盈订单总数',
    statSlippage: '⚡ 滑点订单 (TP≠Close)',
    statFavorable: '📈 有利滑点 (多赚)',
    statUnfavorable: '📉 不利滑点 (少赚)',
    copyBtn: '📋 复制滑点数据',
    emptyMsg:
      '⬆️ 上传您的 .htm 交易报表，点击分析<br>系统将精准识别所有带止盈标记的订单，展示滑点明细',
    footer:
      '💡 滑点差值 = 多单：平仓价 - 止盈价；空单：止盈价 - 平仓价 (正值 = 优于预期，额外盈利)<br>📐 滑点影响(USD) = 滑点差值 × 手数 × 100',
    tableHeaders: [
      '订单号',
      '开仓时间',
      '类型',
      '手数',
      '品种',
      '开仓价',
      '止盈价(T/P)',
      '实际平仓价',
      '滑差点数',
      '盈亏(USD)',
      '滑点评估',
    ],
    favorableText: '✨ 有利滑点 (超预期盈利)',
    unfavorableText: '⚠️ 不利滑点 (不及预期)',
    copySuccess: '✅ 已复制 {count} 条滑点订单数据到剪贴板',
    noDataCopy: '暂无滑点数据可供复制',
    noTpOrders: '✅ 未在报表中找到任何 [tp] 止盈标记订单。',
    noSlippageFound: '🔍 未检测到止盈滑点订单',
  },
  en: {
    titleText: 'MT4 TP',
    subtitle: 'Upload HTM trade report · Extract all [tp] orders · Auto-list orders where T/P ≠ Close Price',
    selectFileBtn: 'Choose File',
    analyzeBtn: '🔍 Extract TP Slippage Orders',
    statTotal: '🏷️ Total TP Orders',
    statSlippage: '⚡ Slippage Orders (TP≠Close)',
    statFavorable: '📈 Favorable Slippage',
    statUnfavorable: '📉 Unfavorable Slippage',
    copyBtn: '📋 Copy Slippage Data',
    emptyMsg: '⬆️ Upload .htm trade report and click Analyze',
    footer: '💡 Slippage pts = for Buy: ClosePrice - TP; for Sell: TP - ClosePrice',
    tableHeaders: [
      'Ticket',
      'Open Time',
      'Type',
      'Volume',
      'Item',
      'Open Price',
      'TP (T/P)',
      'Close Price',
      'Slippage Pts',
      'P&L',
      'Slippage Effect',
    ],
    favorableText: '✨ Favorable (better than TP)',
    unfavorableText: '⚠️ Unfavorable (worse than TP)',
    copySuccess: '✅ Copied {count} slippage orders to clipboard',
    noDataCopy: 'No slippage data to copy',
    noTpOrders: '✅ No [tp] take-profit orders found in the report.',
    noSlippageFound: '🔍 No slippage orders detected',
  },
} as const;

type SortCol = 'slippage' | 'profit' | null;

export default function Mt4TpApp() {
  const { lang } = useLang();
  const t = translations[lang];
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [orders, setOrders] = useState<Mt4SlippageOrder[]>([]);
  const [display, setDisplay] = useState<Mt4SlippageOrder[]>([]);
  const [sortCol, setSortCol] = useState<SortCol>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [emptyKey, setEmptyKey] = useState<'emptyMsg' | 'noTpOrders' | 'noSlippageFound' | null>(
    'emptyMsg',
  );

  useEffect(() => {
    applySort(orders, sortCol, sortDir);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  function applySort(data: Mt4SlippageOrder[], col: SortCol, dir: 'asc' | 'desc') {
    const next = [...data];
    if (col === 'slippage') {
      next.sort((a, b) =>
        dir === 'desc' ? b.slippagePoints - a.slippagePoints : a.slippagePoints - b.slippagePoints,
      );
    } else if (col === 'profit') {
      next.sort((a, b) => (dir === 'desc' ? b.profit - a.profit : a.profit - b.profit));
    }
    setDisplay(next);
  }

  async function analyze() {
    if (!file) {
      alert(lang === 'zh' ? '请先上传 HTM 交易报表' : 'Please upload HTM file first');
      return;
    }
    try {
      const { tpOrders, slippage } = await parseMt4HtmFile(file);
      setOrders(slippage);
      if (!tpOrders.length) {
        setEmptyKey('noTpOrders');
        setDisplay([]);
        return;
      }
      if (!slippage.length) {
        setEmptyKey('noSlippageFound');
        setDisplay([]);
        return;
      }
      setEmptyKey(null);
      setSortCol(null);
      applySort(slippage, null, 'desc');
    } catch {
      alert(lang === 'zh' ? '无法解析 HTML 内容' : 'Failed to parse HTML');
    }
  }

  function toggleSort(col: 'slippage' | 'profit') {
    let nextCol: SortCol = col;
    let nextDir: 'asc' | 'desc' = 'desc';
    if (sortCol === col) {
      if (sortDir === 'desc') nextDir = 'asc';
      else {
        nextCol = null;
        nextDir = 'desc';
      }
    }
    setSortCol(nextCol);
    setSortDir(nextDir);
    applySort(orders, nextCol, nextDir);
  }

  async function copyData() {
    if (!display.length) {
      alert(t.noDataCopy);
      return;
    }
    const tsv = [
      t.tableHeaders.join('\t'),
      ...display.map((ord) =>
        [
          ord.ticket,
          ord.openTime || '',
          ord.type.toUpperCase(),
          ord.volume,
          ord.item,
          ord.openPrice.toFixed(2),
          ord.tp.toFixed(2),
          ord.closePrice.toFixed(2),
          ord.slippagePoints.toFixed(4),
          ord.profit.toFixed(2),
          ord.isFavorable ? 'Favorable' : 'Unfavorable',
        ].join('\t'),
      ),
    ].join('\n');
    await navigator.clipboard.writeText(tsv);
    alert(t.copySuccess.replace('{count}', String(display.length)));
  }

  const favorable = display.filter((o) => o.isFavorable).length;

  return (
    <div className="tp-page">
      <div className="tool-card">
        <p className="subtitle" dangerouslySetInnerHTML={{ __html: t.subtitle }} />
        <div className="file-upload-area">
          <label className="fake-file-input">
            <span>📂</span>
            <span>{t.selectFileBtn}</span>
            <span className="file-name">{fileName}</span>
            <input
              type="file"
              accept=".htm,.html,text/html"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                setFile(f || null);
                setFileName(f?.name || '');
              }}
            />
          </label>
          <button type="button" className="btn btn-primary" onClick={analyze}>
            {t.analyzeBtn}
          </button>
        </div>
        {display.length > 0 && (
          <div className="stats-row">
            <div className="stat-badge">
              {t.statSlippage} <strong>{display.length}</strong>
            </div>
            <div className="stat-badge">
              {t.statFavorable} <strong>{favorable}</strong>
            </div>
            <div className="stat-badge">
              {t.statUnfavorable} <strong>{display.length - favorable}</strong>
            </div>
            <button type="button" className="btn btn-copy" onClick={copyData}>
              {t.copyBtn}
            </button>
          </div>
        )}
        {emptyKey ? (
          <div className="empty-state" dangerouslySetInnerHTML={{ __html: t[emptyKey] }} />
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  {t.tableHeaders.map((h, idx) => (
                    <th
                      key={h}
                      className={idx === 8 || idx === 9 ? 'sortable' : ''}
                      onClick={
                        idx === 8
                          ? () => toggleSort('slippage')
                          : idx === 9
                            ? () => toggleSort('profit')
                            : undefined
                      }
                    >
                      {h}
                      {idx === 8 && sortCol === 'slippage' ? (sortDir === 'desc' ? ' ▼' : ' ▲') : ''}
                      {idx === 9 && sortCol === 'profit' ? (sortDir === 'desc' ? ' ▼' : ' ▲') : ''}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {display.map((ord) => (
                  <tr key={ord.ticket}>
                    <td>{ord.ticket}</td>
                    <td>{ord.openTime || '-'}</td>
                    <td>{ord.type.toUpperCase()}</td>
                    <td>{ord.volume}</td>
                    <td>{ord.item}</td>
                    <td>{ord.openPrice.toFixed(2)}</td>
                    <td>
                      <strong>{ord.tp.toFixed(2)}</strong>
                    </td>
                    <td className="close-cell">{ord.closePrice.toFixed(2)}</td>
                    <td style={{ color: ord.isFavorable ? '#19794d' : '#c23d2b', fontWeight: 700 }}>
                      {ord.slippagePoints.toFixed(4)}
                    </td>
                    <td>{ord.profit.toFixed(2)}</td>
                    <td>{ord.isFavorable ? t.favorableText : t.unfavorableText}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="footer-note" dangerouslySetInnerHTML={{ __html: t.footer }} />
      </div>
    </div>
  );
}
