import { useEffect, useState } from 'react';
import { useLang } from '../../lib/lang-context';
import { parseMt5XlsxFile, type Mt5SlippageOrder } from '../../lib/tools/mt5tp';
import './tp-tools.css';

const translations = {
  zh: {
    titleText: 'MT5 TP',
    subtitle: '上传 XLSX 交易报表 · 提取 [tp] out 平仓单 · 根据对应原始开仓方向计算滑点',
    selectFileBtn: '选择文件',
    analyzeBtn: '🔍 提取止盈滑点订单',
    resetBtn: '↺ 重置',
    statTotal: '🏷️ 成交表总行数',
    statTp: '🎯 止盈订单 ([tp] out)',
    statSlippage: '⚡ 滑点订单 (TP≠平仓价)',
    statFavorable: '📈 有利滑点 (多赚)',
    statUnfavorable: '📉 不利滑点 (少赚)',
    copyBtn: '📋 复制滑点数据',
    emptyMsg: '⬆️ 上传您的 .xlsx 交易报表，点击「提取止盈滑点订单」',
    footer:
      '💡 方向修正：MT5 成交表中 [tp] 在 out 行，类型列与原始开仓方向相反。<br>🎯 买单原仓(sell·out)：滑点 = 平仓价 - TP；卖单原仓(buy·out)：滑点 = TP - 平仓价。',
    tableHeaders: [
      '成交编号',
      '时间',
      '品种',
      '平仓方向',
      '原仓方向',
      '手数',
      '平仓价(G)',
      '止盈价(TP)',
      '滑差点数',
      '盈亏(USD)',
      '滑点评估',
    ],
    favorableText: '✨ 有利滑点 (多赚)',
    unfavorableText: '⚠️ 不利滑点 (少赚)',
    copySuccess: '✅ 已复制 {count} 条滑点订单数据到剪贴板',
    noDataCopy: '暂无滑点数据可供复制',
    noTpOrders: '✅ 未找到任何 [tp] 止盈标记的 out 平仓订单。',
    noSlippageFound: '🔍 未检测到止盈滑点订单',
    noDealTable: '⚠️ 未在 xlsx 中找到「成交」表格区域。',
    parseError: '❌ 解析 xlsx 文件时出错',
    loading: '⏳ 正在解析...',
  },
  en: {
    titleText: 'MT5 TP',
    subtitle: "Upload XLSX · Locate '成交' table · Extract [tp] out orders",
    selectFileBtn: 'Choose File',
    analyzeBtn: '🔍 Extract TP Slippage',
    resetBtn: '↺ Reset',
    statTotal: '🏷️ Deal Table Rows',
    statTp: '🎯 TP Orders ([tp] out)',
    statSlippage: '⚡ Slippage (TP≠Close)',
    statFavorable: '📈 Favorable (Better)',
    statUnfavorable: '📉 Unfavorable (Worse)',
    copyBtn: '📋 Copy Slippage Data',
    emptyMsg: '⬆️ Upload .xlsx trade report and click Analyze',
    footer: '💡 Direction fix for MT5 out rows with [tp] in comment.',
    tableHeaders: [
      'Ticket',
      'Time',
      'Item',
      'Close Dir',
      'Orig Dir',
      'Volume',
      'Close Price(G)',
      'TP',
      'Slip Pts',
      'P&L(USD)',
      'Effect',
    ],
    favorableText: '✨ Favorable (Better)',
    unfavorableText: '⚠️ Unfavorable (Worse)',
    copySuccess: '✅ Copied {count} slippage orders to clipboard',
    noDataCopy: 'No slippage data to copy',
    noTpOrders: '✅ No [tp] out orders found.',
    noSlippageFound: '🔍 No slippage detected',
    noDealTable: "⚠️ Could not locate '成交' deal table.",
    parseError: '❌ Error parsing xlsx',
    loading: '⏳ Parsing...',
  },
} as const;

type SortCol = 'slipDiff' | 'profit' | null;

export default function Mt5TpApp() {
  const { lang } = useLang();
  const t = translations[lang];
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dealRows, setDealRows] = useState(0);
  const [tpCount, setTpCount] = useState(0);
  const [orders, setOrders] = useState<Mt5SlippageOrder[]>([]);
  const [display, setDisplay] = useState<Mt5SlippageOrder[]>([]);
  const [sortCol, setSortCol] = useState<SortCol>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [emptyKey, setEmptyKey] = useState<'emptyMsg' | 'noTpOrders' | 'noSlippageFound' | 'noDealTable' | 'parseError' | null>('emptyMsg');
  const [errorDetail, setErrorDetail] = useState('');

  function applySort(data: Mt5SlippageOrder[], col: SortCol, dir: 'asc' | 'desc') {
    const next = [...data];
    if (col === 'slipDiff') {
      next.sort((a, b) => (dir === 'desc' ? b.slipDiff - a.slipDiff : a.slipDiff - b.slipDiff));
    } else if (col === 'profit') {
      next.sort((a, b) => (dir === 'desc' ? b.profit - a.profit : a.profit - b.profit));
    }
    setDisplay(next);
  }

  async function analyze() {
    if (!file) {
      alert(lang === 'zh' ? '请先上传 XLSX 交易报表' : 'Please upload XLSX first');
      return;
    }
    setLoading(true);
    try {
      const result = await parseMt5XlsxFile(file);
      setDealRows(result.dealRows.length);
      setTpCount(result.tpOrders.length);
      setOrders(result.slippageOrders);
      if (!result.tpOrders.length) {
        setEmptyKey('noTpOrders');
        setDisplay([]);
        return;
      }
      if (!result.slippageOrders.length) {
        setEmptyKey('noSlippageFound');
        setDisplay([]);
        return;
      }
      setEmptyKey(null);
      setSortCol(null);
      applySort(result.slippageOrders, null, 'desc');
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setEmptyKey(msg === 'NO_DEAL_TABLE' ? 'noDealTable' : 'parseError');
      setErrorDetail(msg);
      setDisplay([]);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setFile(null);
    setFileName('');
    setOrders([]);
    setDisplay([]);
    setDealRows(0);
    setTpCount(0);
    setEmptyKey('emptyMsg');
    setErrorDetail('');
  }

  function toggleSort(col: 'slipDiff' | 'profit') {
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
          ord.time || '',
          ord.item,
          ord.type.toUpperCase(),
          ord.origDir.toUpperCase(),
          ord.volume,
          ord.price.toFixed(2),
          ord.tpPrice.toFixed(2),
          (ord.slipDiff > 0 ? '+' : '') + ord.slipDiff.toFixed(4),
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
      <div
        className="tool-card"
        onDragOver={(e) => e.preventDefault()}
        onDrop={async (e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (!f?.name.endsWith('.xlsx')) return;
          setFile(f);
          setFileName(f.name);
          setLoading(true);
          try {
            const result = await parseMt5XlsxFile(f);
            setDealRows(result.dealRows.length);
            setTpCount(result.tpOrders.length);
            setOrders(result.slippageOrders);
            if (!result.tpOrders.length) {
              setEmptyKey('noTpOrders');
              setDisplay([]);
              return;
            }
            if (!result.slippageOrders.length) {
              setEmptyKey('noSlippageFound');
              setDisplay([]);
              return;
            }
            setEmptyKey(null);
            applySort(result.slippageOrders, null, 'desc');
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setEmptyKey(msg === 'NO_DEAL_TABLE' ? 'noDealTable' : 'parseError');
            setErrorDetail(msg);
          } finally {
            setLoading(false);
          }
        }}
      >
        <p className="subtitle" dangerouslySetInnerHTML={{ __html: t.subtitle }} />
        <div className="file-upload-area">
          <label className="fake-file-input">
            <span>📂</span>
            <span>{t.selectFileBtn}</span>
            <span className="file-name">{fileName}</span>
            <input
              type="file"
              accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                setFile(f || null);
                setFileName(f?.name || '');
              }}
            />
          </label>
          <button type="button" className="btn btn-primary" disabled={loading} onClick={analyze}>
            {loading ? t.loading : t.analyzeBtn}
          </button>
          <button type="button" className="btn btn-reset" onClick={reset}>
            {t.resetBtn}
          </button>
        </div>
        {(display.length > 0 || tpCount > 0) && emptyKey === null && (
          <div className="stats-row">
            <div className="stat-badge">
              {t.statTotal} <strong>{dealRows}</strong>
            </div>
            <div className="stat-badge">
              {t.statTp} <strong>{tpCount}</strong>
            </div>
            <div className="stat-badge">
              {t.statSlippage} <strong>{display.length}</strong>
            </div>
            <div className="stat-badge">
              {t.statFavorable} <strong>{favorable}</strong>
            </div>
            <div className="stat-badge">
              {t.statUnfavorable} <strong>{display.length - favorable}</strong>
            </div>
            {display.length > 0 && (
              <button type="button" className="btn btn-copy" onClick={copyData}>
                {t.copyBtn}
              </button>
            )}
          </div>
        )}
        {emptyKey ? (
          <div className="empty-state">
            <span dangerouslySetInnerHTML={{ __html: t[emptyKey] }} />
            {errorDetail && emptyKey === 'parseError' && <small>{errorDetail}</small>}
          </div>
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
                          ? () => toggleSort('slipDiff')
                          : idx === 9
                            ? () => toggleSort('profit')
                            : undefined
                      }
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {display.map((ord) => (
                  <tr key={ord.ticket}>
                    <td>{ord.ticket}</td>
                    <td>{ord.time || '-'}</td>
                    <td>{ord.item}</td>
                    <td>{ord.type.toUpperCase()}</td>
                    <td>
                      <strong>{ord.origDir.toUpperCase()}</strong>
                    </td>
                    <td>{ord.volume}</td>
                    <td className="close-cell">{ord.price.toFixed(2)}</td>
                    <td>
                      <strong>{ord.tpPrice.toFixed(2)}</strong>
                    </td>
                    <td style={{ color: ord.slipDiff > 0 ? '#19794d' : '#c23d2b', fontWeight: 700 }}>
                      {(ord.slipDiff > 0 ? '+' : '') + ord.slipDiff.toFixed(4)}
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
