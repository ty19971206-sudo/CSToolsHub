// Auto-extracted from legacy quiz.html
import type { QuizBank, QuizCategoryKey } from './types';

export function buildQuizBank(): QuizBank {
  const quizBank: QuizBank = {};


  // --------------------------------------------------------------
  // 类别名称映射 (中/英)
  // --------------------------------------------------------------
  // --------------------------------------------------------------
  // 题库结构: 按类别存储
  // --------------------------------------------------------------
  function addQuestion(
    category: QuizCategoryKey,
    zhQ: string,
    zhOpts: string[],
    enQ: string,
    enOpts: string[],
    correctIdx: number,
  ) {
      if (!quizBank[category]) quizBank[category] = [];
      quizBank[category].push({
          zh: { question: zhQ, options: zhOpts },
          en: { question: enQ, options: enOpts },
          correct: correctIdx
      });
  }

(function initIndustryTerminology() {
      const cat = "Industry Terminology";
      addQuestion(cat, "保证金的意思", ["交易时需缴纳的抵押资金","无风险交易额度","银行隔夜拆借利率","政府征收的交易印花税"],
                  "What does \"Margin\" mean?", ["Collateral funds required to open a trade","Risk-free trading allowance","Overnight interbank offered rate","Government-imposed transaction stamp duty"], 0);
      addQuestion(cat, "杠杆在保证金交易中的意思", ["降低交易成本的手段","利用借入资金放大交易规模及盈亏的机制","固定每笔交易手续费的规则","限制最大持仓时间的规定"],
                  "What does \"Leverage\" mean in margin trading?", ["A means of reducing transaction costs","A mechanism that uses borrowed funds to amplify position size and profit/loss","A rule that fixes the commission per trade","A restriction on maximum holding period"], 1);
      addQuestion(cat, "强制平仓的意思", ["交易者主动清仓离场","券商因保证金不足而强行了结客户头寸","节假日自动暂停交易","将盈利自动提取至银行账户"],
                  "What does \"Forced Liquidation\" mean?", ["A trader voluntarily closing all positions","The broker forcibly closing a client's positions due to insufficient margin","Automatic trading suspension during holidays","Withdrawing profits automatically to a bank account"], 1);
      addQuestion(cat, "追加保证金通知（Margin Call）的意思", ["券商的促销活动邀请","系统提示账户资金不足以维持当前持仓的风险警告","交易成功的确认短信","申请提高信用额度的回执"],
                  "What does \"Margin Call\" mean?", ["A promotional activity invitation from the broker","A risk warning that account funds are insufficient to maintain current positions","A confirmation SMS of a successful trade","A receipt for applying for a credit limit increase"], 1);
      addQuestion(cat, "点差的意思", ["同一品种在不同交易所的价格差异","买入价与卖出价之间的差额","隔夜持仓产生的利息差","当日最高价与最低价的差值"],
                  "What does \"Spread\" mean?", ["The price difference of the same instrument on different exchanges","The difference between the bid price and ask price","The interest difference incurred from holding positions overnight","The difference between the daily high and low price"], 1);
      addQuestion(cat, "多头头寸的意思", ["看跌并卖出某种资产","借入资产后立即抛售","看涨并买入某种资产所持有的仓位","同时持有买入和卖出订单"],
                  "What does \"Long Position\" mean?", ["A position that profits from a price decline by selling an asset","A position created by borrowing an asset and immediately selling it","A position taken with the expectation that the asset price will rise by buying it","Holding both buy and sell orders simultaneously"], 2);
      addQuestion(cat, "空头头寸的意思", ["预期价格上涨而买入的仓位","预期价格下跌而卖出所持有的仓位","持有现金不进行任何交易","对冲同一品种的多头风险"],
                  "What does \"Short Position\" mean?", ["A position taken with the expectation that the price will rise by buying","A position taken with the expectation that the price will fall by selling","Holding cash without making any trades","Hedging the risk of a long position in the same instrument"], 1);
      addQuestion(cat, "止损单的意思", ["在指定更优价格入场的订单","为限制持仓最大亏损而预设平仓的指令","自动提取账户盈利的指令","提高交易杠杆倍数的工具"],
                  "What does \"Stop Loss Order\" mean?", ["An order to enter the market at a specified better price","An order preset to close a position to limit the maximum loss","An order to automatically withdraw account profits","A tool to increase the trading leverage ratio"], 1);
      addQuestion(cat, "止盈单的意思", ["在盈利达到预设目标时自动平仓的指令","限制开仓最大手数的设置","摊平持仓成本的方法","按时间顺序逐笔成交的规则"],
                  "What does \"Take Profit Order\" mean?", ["An order to automatically close a position when profit reaches a preset target","A setting that limits the maximum number of lots to open","A method of averaging down the position cost","A rule for executing transactions sequentially by time"], 0);
      addQuestion(cat, "限价单的意思", ["按当前市价立即成交的订单","指定价格或更优价格成交的挂单","仅在收盘后生效的订单","无条件全部成交的订单"],
                  "What does \"Limit Order\" mean?", ["An order that is executed immediately at the current market price","A pending order to execute at a specified price or a better price","An order that only becomes effective after market close","An order that is filled unconditionally in full"], 1);
      addQuestion(cat, "市价单的意思", ["指定价格且可能不成交的订单","以当前市场最优价格立即成交的订单","仅限机构投资者使用的指令","必须先冻结保证金才可发出的指令"],
                  "What does \"Market Order\" mean?", ["An order that specifies a price and may not be filled","An order to buy or sell immediately at the best available current market price","An order type restricted to institutional investors only","An order that can only be placed after freezing margin"], 1);
      addQuestion(cat, "追踪止损的意思", ["止损价位随行情朝有利方向移动而同步调整的止损方式","每天手动调整止损位置的策略","对多个订单同时设置同一止损","仅在价格突破关键点位时触发的止损"],
                  "What does \"Trailing Stop\" mean?", ["A stop-loss method where the stop level moves in favor of the position as the market moves","A strategy of manually adjusting the stop-loss level daily","Setting the same stop-loss level for multiple orders simultaneously","A stop that only triggers when the price breaks through a key level"], 0);
      addQuestion(cat, "爆仓的意思", ["账户资金翻倍","因亏损过大导致账户资金归零或净值为负","因违规被监管机构冻结账户","市场突然休市无法交易"],
                  "What does \"Blow Up / Account Blowout\" mean?", ["The account funds doubling","The account funds becoming zero or negative due to extreme losses","The account being frozen by regulators for rule violations","The market suddenly closing making trading impossible"], 1);
      addQuestion(cat, "可用预付款的意思", ["账户总资金加上浮动盈亏","已用于开仓被冻结的资金","账户净值中尚未被占用的、可用于新开仓的预付款资金","券商提供的信用贷款总额"],
                  "What does \"Free Margin\" mean?", ["Total account funds plus floating profit/loss","Funds already used and frozen for opening positions","Funds within the account equity not yet used and available for opening new positions","The total credit line provided by the broker"], 2);
      addQuestion(cat, "已用预付款的意思", ["历史累计入金金额","因持有头寸而被冻结占用的预付款资金","已实现盈利部分","隔夜利息累计金额"],
                  "What does \"Used Margin\" mean?", ["Total historical deposit amount","Funds that are frozen and occupied due to holding positions","The realized profit portion","Total accumulated overnight interest"], 1);
      addQuestion(cat, "账户净值的意思", ["余额加上当前浮动盈亏后的价值","初始入金金额","已用预付款与可用预付款之和减去手续费","当日平仓盈亏"],
                  "What does \"Equity\" mean?", ["The account balance plus current floating profit/loss","The initial deposit amount","The sum of used margin and free margin minus commissions","The profit or loss of the day's closed positions"], 0);
      addQuestion(cat, "保证金比例的意思", ["余额与已用保证金的比率","净值与已用保证金的比率，用以衡量账户风险水平","可用预付款与净值的比率","浮动盈亏与余额的比率"],
                  "What does \"Margin Ratio\" mean?", ["The ratio of balance to used margin","The ratio of equity to used margin, used to measure account risk level","The ratio of free margin to equity","The ratio of floating P/L to balance"], 1);
      addQuestion(cat, "预付款比例的意思", ["已用预付款与余额的比值","净值与已用预付款的比率，其数值越低账户风险越高","可用预付款与持仓手数的比值","浮动盈亏与净值的比值"],
                  "What does \"Margin Level\" mean?", ["The ratio of used margin to balance","The ratio of equity to used margin; a lower percentage indicates higher account risk","The ratio of free margin to number of lots held","The ratio of floating P/L to equity"], 1);
      addQuestion(cat, "隔夜利息（库存费）的意思", ["持仓过夜时因货币利率差异支付或获得的利息","每日交易产生的手续费","账户余额在银行产生的活期利息","合约展期收取的固定服务费"],
                  "What does \"Swap / Overnight Interest\" mean?", ["The interest paid or earned when holding a position overnight due to currency interest rate differences","The commission charged for daily trading","The demand deposit interest generated by the account balance in the bank","A fixed service fee charged for contract rollover"], 0);
      addQuestion(cat, "点值的意思", ["每个最小报价单位变动所对应的盈亏金额","允许交易的最低手数","当日最大波动幅度","券商收取的每笔佣金"],
                  "What does \"Pip Value\" mean?", ["The amount of profit or loss generated by a one-unit change in the smallest price increment","The minimum number of lots allowed to trade","The maximum daily fluctuation range","The commission charged per transaction by the broker"], 0);
      addQuestion(cat, "手数的意思", ["账户风险等级","表示交易数量的标准单位","杠杆的倍数","订单的优先级别"],
                  "What does \"Lot\" mean?", ["The risk level of a trading account","A standard unit representing a specific trading quantity","The multiple of leverage used","The priority level of an order"], 1);
      addQuestion(cat, "点的意思", ["交易所收取的交易费用单位","汇率报价中最小的变动单位","隔夜利息的计算基准","每手交易的固定金额"],
                  "What does \"Pip\" mean?", ["A unit of transaction fee charged by the exchange","The smallest incremental unit of change in an exchange rate quote","The calculation basis for overnight interest","The fixed monetary amount per lot traded"], 1);
      addQuestion(cat, "滑点的意思", ["报价停滞不动的现象","订单实际成交价格与预期价格出现偏差的现象","点差突然收窄的情况","杠杆倍数临时调整"],
                  "What does \"Slippage\" mean?", ["A phenomenon where the price quote freezes","The difference between the expected price of a trade and the actual executed price","A situation where the spread suddenly narrows","A temporary adjustment of the leverage multiple"], 1);
      addQuestion(cat, "流动性的意思", ["市场能够快速成交且不显著影响价格的能力","账户可随时出入金的便利程度","单一品种的波动率大小","券商能够提供的最大杠杆上限"],
                  "What does \"Liquidity\" mean?", ["The ability of a market to facilitate quick transactions without significantly affecting the price","The ease of depositing and withdrawing funds from an account","The volatility level of a single instrument","The maximum leverage a broker can provide"], 0);
      addQuestion(cat, "做市商的意思", ["仅提供行情分析报告的机构","同时报出买卖价并为市场提供流动性的交易商","监管客户资金安全的机构","只负责清算不参与报价的机构"],
                  "What does \"Market Maker\" mean?", ["An institution that only provides market analysis reports","A dealer that simultaneously quotes both buy and sell prices, providing liquidity to the market","An institution that supervises the safety of client funds","An institution only responsible for clearing and not involved in quoting"], 1);
      addQuestion(cat, "ECN模式的意思", ["通过电子通讯网络直接撮合交易者订单的模式","所有订单均与券商对赌的模式","只能在固定时间段交易的模式","完全免手续费的模式"],
                  "What does \"ECN Model\" mean?", ["A model that directly matches orders between traders through an electronic communication network","A model where all orders are taken by the broker as a counterparty","A model that allows trading only during fixed time windows","A model that is completely commission-free"], 0);
      addQuestion(cat, "STP模式的意思", ["券商将客户订单直接传送至流动性提供商的模式","券商手动处理每一笔订单的模式","仅支持股票交易的模式","所有订单必须在30秒内成交的模式"],
                  "What does \"STP Model\" mean?", ["A model where the broker directly transmits client orders to liquidity providers","A model where the broker manually processes each order","A model that supports only stock trading","A model where all orders must be executed within 30 seconds"], 0);
      addQuestion(cat, "浮动盈亏的意思", ["已平仓部分的最终盈亏","未平仓头寸按当前市场价格计算的账面盈亏","当日手续费总和","账户余额的利息收入"],
                  "What does \"Floating P/L\" mean?", ["The final profit or loss of closed positions","The unrealized profit or loss of open positions calculated based on current market prices","The total commissions for the day","The interest income from the account balance"], 1);
      addQuestion(cat, "已实现盈亏的意思", ["持仓中尚未平仓的账面利润","平仓后确定的实际盈亏金额","扣除隔夜利息前的账面利润","仅指空头头寸的利润"],
                  "What does \"Realized P/L\" mean?", ["The book profit of positions not yet closed","The actual profit or loss determined after a position is closed","The book profit before deducting overnight interest","Profit only from short positions"], 1);
      addQuestion(cat, "对冲的意思", ["加大单一方向仓位以博取更大利润","同时建立方向相反的头寸以降低风险的操作","将资金分散至不同券商","不使用任何杠杆进行交易"],
                  "What does \"Hedging\" mean?", ["Increasing position size in a single direction to pursue larger profits","The act of simultaneously opening opposite positions to reduce risk exposure","Diversifying funds across different brokers","Trading without using any leverage"], 1);
      addQuestion(cat, "锁仓的意思", ["一键清空所有持仓","对同一品种开立数量相同、方向相反的头寸以锁定盈亏","将止损与止盈设置在同一价位","暂停所有自动交易程序"],
                  "What does \"Locking Position\" mean?", ["Closing all positions with one click","Opening positions of the same volume but opposite direction in the same instrument to lock in profit/loss","Setting the stop loss and take profit at the same price level","Pausing all automated trading programs"], 1);
      addQuestion(cat, "止损买入单的意思", ["价格跌破指定价位时触发的买入挂单","价格涨破指定价位时触发的买入挂单","无论价格涨跌都立即买入的指令","仅当有对应卖出单时才买入的指令"],
                  "What does \"Buy Stop Order\" mean?", ["A pending buy order triggered when the price falls below a specified level","A pending buy order triggered when the price rises above a specified level","An order to buy immediately regardless of price movement","An order to buy only when there is a corresponding sell order"], 1);
      addQuestion(cat, "剥头皮交易的意思", ["长期持有头寸以获取趋势利润","利用基本面分析进行波段操作","超短线交易，持仓时间极短以获取微小价差","仅交易与头皮商品相关的品种"],
                  "What does \"Scalping\" mean?", ["Holding positions for the long term to capture trend profits","Using fundamental analysis for swing trading","An ultra-short-term trading style where positions are held for a very short time to capture small price differentials","Trading only instruments related to commodity scalps"], 2);
      addQuestion(cat, "支撑位的意思", ["价格下跌时可能遇到买盘支撑从而使跌势放缓的价位区域","价格上涨时可能遭遇卖压的价位区域","交易量最大的价格位置","日内开盘价所在位置"],
                  "What does \"Support Level\" mean?", ["A price area where a downtrend may pause due to a concentration of buying interest","A price area where an uptrend may encounter selling pressure","The price level with the highest trading volume","The daily opening price level"], 0);
      addQuestion(cat, "阻力位的意思", ["价格下跌时可能企稳的区间","价格上涨时可能遇到卖盘压力从而使涨势受阻的价位区域","止损单集中设置的位置","过去10日均线的位置"],
                  "What does \"Resistance Level\" mean?", ["An area where a downtrend might stabilize","A price area where an uptrend may pause due to a concentration of selling pressure","The level where stop orders are clustered","The position of the 10-day moving average"], 1);
      addQuestion(cat, "非农数据的意思", ["中国制造业采购经理指数","反映美国非农业部门就业人数变化的月度数据","欧元区消费者信心指数","日本央行短观报告"],
                  "What does \"Nonfarm Payrolls\" mean?", ["China's Manufacturing Purchasing Managers' Index","Monthly data reflecting the change in the number of employed people in the US non-agricultural sector","Eurozone Consumer Confidence Index","Bank of Japan's Tankan report"], 1);
      addQuestion(cat, "央行利率决议的意思", ["中央银行关于基准利率调整的公告","商业银行设定的存贷款利率","隔夜拆借利率的每日报价","通货膨胀数据的发布"],
                  "What does \"Central Bank Interest Rate Decision\" mean?", ["The announcement by a central bank regarding adjustments to its benchmark interest rate","The deposit and lending rates set by commercial banks","The daily quote for the overnight lending rate","The release of inflation data"], 0);
      addQuestion(cat, "避险货币的意思", ["利率较高的货币","在全球风险情绪恶化时倾向于升值或保持稳定的货币","受国际制裁国家的货币","与黄金价格完全反向的货币"],
                  "What does \"Safe-Haven Currency\" mean?", ["A currency with a high interest rate","A currency that tends to appreciate or remain stable during periods of global risk aversion","The currency of a country under international sanctions","A currency that has a perfect inverse correlation with gold"], 1);
      addQuestion(cat, "直盘货币对的意思", ["包含美元的货币对","任意两种非美货币组成的货币对","仅限欧元相关的货币对","只在特定交易所上市的货币对"],
                  "What does \"Major Currency Pair\" (containing USD) mean?", ["A currency pair that includes the US Dollar","A pair consisting of any two non-US Dollar currencies","A pair exclusively involving the Euro","A pair only listed on specific exchanges"], 0);
      addQuestion(cat, "交叉盘货币对的意思", ["必定包含美元的货币对","两种非美货币直接兑换的货币对","固定汇率制度下的货币对","不产生隔夜利息的货币对"],
                  "What does \"Cross Currency Pair\" mean?", ["A pair that must include the US Dollar","A currency pair that directly quotes two non-USD currencies against each other","A pair under a fixed exchange rate regime","A pair that generates no overnight interest"], 1);
      addQuestion(cat, "主要货币对的意思", ["点差极大且成交缓慢的货币对","流动性高、交易量活跃且点差较小的货币对","只能在工作日特定时段交易的货币对","不设涨跌幅限制也不受监管的货币对"],
                  "What does \"Major Currency Pairs\" mean?", ["Pairs with very large spreads and slow execution","Pairs with high liquidity, active trading volume, and typically low spreads","Pairs that can only be traded during specific sessions on weekdays","Pairs that have no price limits and are unregulated"], 1);
      addQuestion(cat, "AB仓的意思", 
                  ["在不同券商/同券商不同账号分别开立多头和空头仓位以对冲风险",
                   "同一账户内同时持有相同品种、相同数量的多空仓位",
                   "利用两个不同交易账户进行套利交易",
                   "将资金分成两部分分别进行长线短线操作"],
                  "What does \"A/B Position\" mean?",
                  ["Opening long and short positions with different brokers or across different accounts with the same broker to hedge against risk",
                   "Holding both long and short positions of the same instrument and same volume within the same account",
                   "Arbitrage trading using two different trading accounts",
                   "Splitting funds into two parts for long-term and short-term trading"], 0);
      addQuestion(cat, "套息交易的意思", ["借入高息货币投资低息货币","借入低息货币并投资于高息货币以赚取利差","通过频繁交易获取手续费返还","同时买卖同一种货币对锁定价差"],
                  "What does \"Carry Trade\" mean?", ["Borrowing a high-interest-rate currency to invest in a low-interest-rate currency","Borrowing a low-interest-rate currency to invest in a high-interest-rate currency to profit from the interest rate differential","Obtaining commission rebates through frequent trading","Simultaneously buying and selling the same currency pair to lock in the spread"], 1);
      addQuestion(cat, "EA（智能交易系统）的意思", ["分析师发布的市场评论","可自动按预设逻辑执行交易的程序","券商内部的风控部门","监管机构的缩写"],
                  "What does \"EA (Expert Advisor)\" mean?", ["Market commentary published by an analyst","A program that automatically executes trades based on a preset logic","The risk management department within a brokerage","An abbreviation for a regulatory body"], 1);
      addQuestion(cat, "成交量的意思", ["一定时期内交易的合约或手数总量","价格变动的幅度","未平仓合约的数量","订单簿的厚度"],
                  "What does \"Volume\" mean?", ["The total number of contracts or lots traded within a specific period","The magnitude of price change","The number of open contracts","The depth of the order book"], 0);
      addQuestion(cat, "VPS在保证金交易中的意思", ["用于查看实时新闻资讯的软件","可保持交易平台24小时稳定在线运行的虚拟专用服务器","加密交易账户密码的工具","替代身份验证的系统"],
                  "What does \"VPS\" mean in the context of margin trading?", ["Software for viewing real-time news","A Virtual Private Server that can keep a trading platform running stably online 24/7","A tool for encrypting trading account passwords","A system that replaces identity verification"], 1);
      addQuestion(cat, "头寸规模的意思", ["仅指账户余额的大小","交易头寸的大小，通常以手数表示的交易数量","止损距离的远近","券商提供的赠金优惠"],
                  "What does \"Position Size\" mean?", ["Refers only to the account balance size","The magnitude of a trading position, usually expressed as the number of lots","The distance of the stop-loss level","The bonus offered by a broker"], 1);
      addQuestion(cat, "交易日志的意思", ["满足监管申报要求的表格","记录每笔交易详情以供复盘分析的文档","作为报税的唯一凭证","公开分享给其他投资者的信号"],
                  "What does \"Trading Journal\" mean?", ["A form to meet regulatory reporting requirements","A document used to record the details of every trade for review and performance analysis","The sole certificate for tax reporting","Trading signals publicly shared with other investors"], 1);
      addQuestion(cat, "隔离账户的意思", ["客户资金与券商自有资金分开存放的账户","用于缴纳保证金的专用账户","只能交易特定品种的账户","与他人资金合并管理的账户"],
                  "What does \"Segregated Account\" mean?", ["An account where client funds are kept strictly separate from the broker's own operating funds","A dedicated account used only to meet margin requirements","An account restricted to trading specific instruments only","An account where funds are pooled and managed together with other clients' money"], 0);
      addQuestion(cat, "负余额保护政策的意思", ["账户亏损不会超过入金金额，净值不会小于零的保护机制","允许客户无限期拖欠保证金的政策","盈利超过一定数额后不再增加的规定","将负利息自动转为正利息的规则"],
                  "What does \"Negative Balance Protection\" mean?", ["A policy that ensures an account's equity cannot fall below zero and losses cannot exceed the deposit","A policy that allows clients to defer margin payments indefinitely","A rule that caps profits once they exceed a certain amount","A mechanism that automatically converts negative interest into positive interest"], 0);
  })();

  // ========== 2. 其他类别占位题库 ==========
  function addPlaceholderCategory(category: QuizCategoryKey, displayName: string) {
      if (!quizBank[category]) quizBank[category] = [];
      for (let i = 1; i <= 10; i++) {
          addQuestion(category, 
              `【待补充】${displayName} 示例题目 ${i}`, 
              ["选项A","选项B","选项C","选项D"],
              `[To be added] ${displayName} sample question ${i}`,
              ["Option A","Option B","Option C","Option D"],
              0);
      }
  }
      // ========== Company Background 公司背景（50题）==========
      addQuestion("Company Background",
          "ATFX品牌正式成立于哪一年？",
          ["2014年","2015年","2017年","2018年"],
          "In which year was the ATFX brand officially established?",
          ["2014","2015","2017","2018"],
          2
      );
      addQuestion("Company Background",
          "Jeffrey Siu在ATFX担任什么职位？",
          ["首席战略官","首席运营官","首席商务官","首席技术官"],
          "What position does Jeffrey Siu hold at ATFX?",
          ["Chief Strategy Officer","Chief Operating Officer","Chief Commercial Officer","Chief Technology Officer"],
          1
      );
      addQuestion("Company Background",
          "Drew Niv在加入ATFX之前曾共同创立并担任CEO长达19年的公司是哪家？",
          ["GAIN Capital","FXCM（福汇）","OANDA","Saxo Bank"],
          "Which company did Drew Niv co-found and serve as CEO for 19 years before joining ATFX?",
          ["GAIN Capital","FXCM","OANDA","Saxo Bank"],
          1
      );
      addQuestion("Company Background",
          "ATFX的创始人兼集团主席是谁？",
          ["Simon Naish","Joe Li (Hiu Keung Li)","Nick Twidale","Zhang Wei Qiang"],
          "Who is the founder and Group Chairman of ATFX?",
          ["Simon Naish","Joe Li (Hiu Keung Li)","Nick Twidale","Zhang Wei Qiang"],
          1
      );
      addQuestion("Company Background",
          "Siju Daniel在ATFX担任什么职位？",
          ["首席战略官","首席运营官","首席商务官","首席技术官"],
          "What position does Siju Daniel hold at ATFX?",
          ["Chief Strategy Officer","Chief Operating Officer","Chief Commercial Officer","Chief Technology Officer"],
          2
      );
      addQuestion("Company Background",
          "ATFX目前在全球拥有约多少名员工？",
          ["300人","500人","700人","1000人"],
          "Approximately how many employees does ATFX have globally?",
          ["300","500","700","1,000"],
          2
      );
      addQuestion("Company Background",
          "ATFX的全球总部位于哪个城市？",
          ["纽约","香港","伦敦","悉尼"],
          "Where is ATFX's global headquarters located?",
          ["New York","Hong Kong","London","Sydney"],
          2
      );
      addQuestion("Company Background",
          "Hormoz Faryar在ATFX担任什么职位？",
          ["中东北非地区机构销售董事总经理","首席商务官","全球交易与风险管理主管","拉美机构销售总经理"],
          "What position does Hormoz Faryar hold at ATFX?",
          ["Managing Director of Institutional Sales (MENA-Dubai)","Chief Commercial Officer","Head of Global Trading & Risk Management","Managing Director of Institutional Sales (LATAM)"],
          0
      );
      addQuestion("Company Background",
          "Wei Qiang Zhang在ATFX担任什么职位？",
          ["集团主席","ATFX英国及ATFX Connect董事总经理","首席战略官","中东与北非首席执行官"],
          "What position does Wei Qiang Zhang hold at ATFX?",
          ["Group Chairman","Managing Director of ATFX UK and ATFX Connect","Chief Strategy Officer","CEO of MENA"],
          1
      );
      addQuestion("Company Background",
          "ATFX的机构业务平台ATFX Connect是哪一年正式推出的？",
          ["2017年","2019年","2021年","2023年"],
          "In which year was ATFX Connect, the institutional business platform, officially launched?",
          ["2017","2019","2021","2023"],
          1
      );
      addQuestion("Company Background",
          "ATFX Connect是ATFX集团旗下的什么业务品牌？",
          ["零售经纪业务","机构业务","投资银行业务","资产管理业务"],
          "What type of business brand is ATFX Connect under ATFX Group?",
          ["Retail brokerage","Institutional business","Investment banking","Asset management"],
          1
      );
      addQuestion("Company Background",
          "ATFX Connect推出的专有技术生态系统被命名为什么？",
          ["TradeX","ConnectX","LiquidityX","PrimeX"],
          "What is the name of the proprietary technology ecosystem launched by ATFX Connect?",
          ["TradeX","ConnectX","LiquidityX","PrimeX"],
          1
      );
      addQuestion("Company Background",
          "Khaldoun Sharaiha在ATFX担任什么职位？",
          ["黎凡特董事总经理","东南亚董事总经理","中东与北非首席执行官","澳大利亚主管"],
          "What position does Khaldoun Sharaiha hold at ATFX?",
          ["Managing Director of Levant","Managing Director of Southeast Asia","CEO of MENA","Head of Australia"],
          2
      );
      addQuestion("Company Background",
          "Aditya Singh在ATFX担任什么职位？",
          ["机构业务总监","国际业务发展总监","全球交易与风险管理主管","拉美机构销售总经理"],
          "What position does Aditya Singh hold at ATFX?",
          ["Director of Institutional Operations","International Business Development Director","Head of Global Trading & Risk Management","Managing Director of Institutional Sales (LATAM)"],
          1
      );
      addQuestion("Company Background",
          "ATFX目前持有多少个监管机构颁发的牌照？",
          ["5个","7个","9个","12个"],
          "How many regulatory licenses does ATFX currently hold?",
          ["5","7","9","12"],
          2
      );
      addQuestion("Company Background",
          "ATFX在英国FCA的牌照号码是多少？",
          ["44816","760555","285/15","BUM667"],
          "What is ATFX's FCA license number in the United Kingdom?",
          ["44816","760555","285/15","BUM667"],
          1
      );
      addQuestion("Company Background",
          "ATFX英国实体（AT Global Markets (UK) Ltd）获得FCA授权是在哪一年？",
          ["2015年","2016年","2017年","2018年"],
          "In which year did ATFX's UK entity (AT Global Markets (UK) Ltd) obtain FCA authorization?",
          ["2015","2016","2017","2018"],
          2
      );
      addQuestion("Company Background",
          "ATFX在塞浦路斯CySEC的牌照号码是多少？",
          ["760555","285/15","C118023331","SD093"],
          "What is ATFX's CySEC license number in Cyprus?",
          ["760555","285/15","C118023331","SD093"],
          1
      );
      addQuestion("Company Background",
          "ATFX通过塞浦路斯实体获得CySEC牌照是在哪一年？",
          ["2014年","2015年","2016年","2017年"],
          "In which year did ATFX obtain its CySEC license through its Cyprus entity?",
          ["2014","2015","2016","2017"],
          1
      );
      addQuestion("Company Background",
          "ATFX在澳大利亚ASIC的牌照号码是多少？",
          ["FSP 44816","760555","AFSL 418036","BUM667"],
          "What is ATFX's ASIC license number in Australia?",
          ["FSP 44816","760555","AFSL 418036","BUM667"],
          2
      );
      addQuestion("Company Background",
          "ATFX在香港SFC的中央编号是什么？",
          ["760555","AFSL 418036","285/15","BUM667"],
          "What is ATFX's central entity number with the Hong Kong SFC?",
          ["760555","AFSL 418036","285/15","BUM667"],
          3
      );
      addQuestion("Company Background",
          "ATFX香港实体获得SFC牌照是在哪一年？",
          ["2015年","2016年","2017年","2018年"],
          "In which year did ATFX's Hong Kong entity obtain its SFC license?",
          ["2015","2016","2017","2018"],
          2
      );
      addQuestion("Company Background",
          "ATFX在南非FSCA的牌照号码是多少？",
          ["FSP 44816","760555","AFSL 418036","20200000078"],
          "What is ATFX's FSCA license number in South Africa?",
          ["FSP 44816","760555","AFSL 418036","20200000078"],
          0
      );
      addQuestion("Company Background",
          "ATFX南非FSCA牌照是在哪一年通过收购获得的？",
          ["2021年","2022年","2023年","2024年"],
          "In which year did ATFX obtain its South African FSCA license through an acquisition?",
          ["2021","2022","2023","2024"],
          2
      );
      addQuestion("Company Background",
          "ATFX在阿联酋持有的SCA牌照属于哪一类别？",
          ["第一类","第三类","第四类","第五类"],
          "Which category of SCA license does ATFX hold in the UAE?",
          ["Category 1","Category 3","Category 4","Category 5"],
          3
      );
      addQuestion("Company Background",
          "ATFX在阿联酋的受监管实体注册在哪个金融中心？",
          ["阿布扎比全球市场（ADGM）","迪拜国际金融中心（DIFC）","迪拜多种商品中心（DMCC）","杰贝阿里自由贸易区（JAFZA）"],
          "In which financial center is ATFX's regulated entity in the UAE registered?",
          ["Abu Dhabi Global Market (ADGM)","Dubai International Financial Centre (DIFC)","Dubai Multi Commodities Centre (DMCC)","Jebel Ali Free Zone (JAFZA)"],
          1
      );
      addQuestion("Company Background",
          "ATFX在柬埔寨持有的牌照由哪个机构颁发？",
          ["柬埔寨国家银行","柬埔寨证券监管局（SERC）","柬埔寨商务部","柬埔寨金融管理局"],
          "Which regulatory body issued ATFX's license in Cambodia?",
          ["National Bank of Cambodia","Securities and Exchange Regulator of Cambodia (SERC)","Ministry of Commerce of Cambodia","Cambodia Monetary Authority"],
          1
      );
      addQuestion("Company Background",
          "ATFX在塞舌尔获得的FSA牌照号码是什么？",
          ["SD093","FSP 44816","20200000078","BUM667"],
          "What is the FSA license number obtained by ATFX in Seychelles?",
          ["SD093","FSP 44816","20200000078","BUM667"],
          0
      );
      addQuestion("Company Background",
          "ATFX在毛里求斯获得的牌照由哪个机构颁发？",
          ["毛里求斯金融服务委员会（FSC）","毛里求斯银行","毛里求斯证券交易委员会","毛里求斯金融管理局"],
          "Which authority issued the license obtained by ATFX in Mauritius?",
          ["Financial Services Commission (FSC) of Mauritius","Bank of Mauritius","Stock Exchange Commission of Mauritius","Mauritius Monetary Authority"],
          0
      );
      addQuestion("Company Background",
          "ATFX的英国实体客户可享受FSCS（金融服务补偿计划）最高多少金额的金融补偿？",
          ["50,000英镑","85,000英镑","100,000英镑","150,000英镑"],
          "Up to what amount can ATFX's UK entity clients receive financial compensation under the FSCS (Financial Services Compensation Scheme)?",
          ["£50,000","£85,000","£100,000","£150,000"],
          1
      );
      addQuestion("Company Background",
          "ATFX在2023年收购了哪家公司的澳大利亚业务？",
          ["嘉盛集团（GAIN Capital）","乐天证券澳大利亚（Rakuten Securities Australia）","IG集团澳大利亚","福汇澳大利亚（FXCM Australia）"],
          "Which company's Australian operations did ATFX acquire in 2023?",
          ["GAIN Capital","Rakuten Securities Australia","IG Group Australia","FXCM Australia"],
          1
      );
      addQuestion("Company Background",
          "乐天证券澳大利亚完成更名后，更改为以下哪个实体名称？",
          ["ATFX Australia Ltd","AT Global Markets (Australia) Pty Ltd","ATFX Pacific Pty Ltd","AT Markets Australia Pty Ltd"],
          "After completing the renaming, what entity name did Rakuten Securities Australia adopt?",
          ["ATFX Australia Ltd","AT Global Markets (Australia) Pty Ltd","ATFX Pacific Pty Ltd","AT Markets Australia Pty Ltd"],
          1
      );
      addQuestion("Company Background",
          "2023年，ATFX为获得南非FSCA牌照收购了哪家持牌经纪商？",
          ["IG South Africa","Plus500 South Africa","Khwezi Financial Services","FXCM South Africa"],
          "Which licensed broker did ATFX acquire in 2023 to obtain its South African FSCA license?",
          ["IG South Africa","Plus500 South Africa","Khwezi Financial Services","FXCM South Africa"],
          2
      );
      addQuestion("Company Background",
          "ATFX悉尼办事处正式开业是在哪一年？",
          ["2022年","2023年","2024年","2025年"],
          "In which year did the ATFX Sydney office officially open?",
          ["2022","2023","2024","2025"],
          2
      );
      addQuestion("Company Background",
          "2021年，ATFX成为哪支英超球队的官方在线交易伙伴？",
          ["曼联","阿森纳","狼队（Wolverhampton Wanderers）","切尔西"],
          "In 2021, ATFX became the official online trading partner of which Premier League football club?",
          ["Manchester United","Arsenal","Wolverhampton Wanderers","Chelsea"],
          2
      );
      addQuestion("Company Background",
          "Mohammed Khan在ATFX Connect担任什么职位？",
          ["董事总经理","首席运营官","业务发展主管","机构业务运营总监"],
          "What position does Mohammed Khan hold at ATFX Connect?",
          ["Managing Director","Chief Operating Officer","Head of Business Development","Director of Institutional Operations"],
          1
      );
      addQuestion("Company Background",
          "ATFX Connect与以下哪家银行合作加强其主经纪商服务？",
          ["汇丰银行（HSBC）","渣打银行（Standard Chartered Bank）","花旗银行（Citibank）","摩根大通（JPMorgan Chase）"],
          "Which bank has ATFX Connect partnered with to strengthen its prime brokerage services?",
          ["HSBC","Standard Chartered Bank","Citibank","JPMorgan Chase"],
          1
      );
      addQuestion("Company Background",
          "ATFX在拉丁美洲最早设立的办事处位于哪个国家？",
          ["巴西","阿根廷","哥伦比亚","墨西哥"],
          "In which country did ATFX first establish an office in Latin America?",
          ["Brazil","Argentina","Colombia","Mexico"],
          3
      );
      addQuestion("Company Background",
          "ATFX在2021年获得了哪个重量级商业媒体的认可？",
          ["财富杂志","彭博商业周刊","福布斯","经济学人"],
          "Which prestigious business media recognized ATFX in 2021?",
          ["Fortune","Bloomberg Businessweek","Forbes","The Economist"],
          2
      );
      addQuestion("Company Background",
          "2024年，ATFX引入了哪项数字资产托管合作以提升客户资产安全？",
          ["与Fireblocks的合作","与Zodia Custody的合作","与Coinbase Custody的合作","与BitGo的合作"],
          "Which digital asset custody partnership did ATFX introduce in 2024 to enhance client asset security?",
          ["Partnership with Fireblocks","Partnership with Zodia Custody","Partnership with Coinbase Custody","Partnership with BitGo"],
          1
      );
      addQuestion("Company Background",
          "ATFX机构业务平台ATFX Connect的董事总经理是谁？",
          ["Joe Li","Hormoz Faryar","Zhang Wei Qiang","Siju Daniel"],
          "Who is the Managing Director of ATFX's institutional business platform, ATFX Connect?",
          ["Joe Li","Hormoz Faryar","Zhang Wei Qiang","Siju Daniel"],
          2
      );
      addQuestion("Company Background",
          "Line Ho Young Peteri在ATFX担任什么职位？",
          ["全球交易与风险管理主管","全球战略合作与联盟业务副总裁","拉美机构销售总经理","中东北非地区合规主管"],
          "What position does Line Ho Young Peteri hold at ATFX?",
          ["Head of Global Trading & Risk Management","VP of Global Strategic Partnerships & Alliances","Managing Director of Institutional Sales (LATAM)","Head of Compliance – MENA"],
          1
      );
      addQuestion("Company Background",
          "Paresh Patel在ATFX担任什么职位？",
          ["全球交易与风险管理主管","机构业务运营总监","中东与北非首席执行官","首席商务官"],
          "What position does Paresh Patel hold at ATFX?",
          ["Head of Global Trading & Risk Management","Director of Institutional Operations","CEO of MENA","Chief Commercial Officer"],
          1
      );
      addQuestion("Company Background",
          "ATFX在2025年提出的全新战略愿景“耀眼光谱，引领未来”的官方英文表述是什么？",
          ["Illuminate the Future Spectrum","Shaping the Future of Trading","Beyond Excellence Beyond Borders","Empowering Traders Worldwide"],
          "What is the official English expression of ATFX's new strategic vision \"Illuminate the Future Spectrum\" proposed in 2025?",
          ["Illuminate the Future Spectrum","Shaping the Future of Trading","Beyond Excellence Beyond Borders","Empowering Traders Worldwide"],
          0
      );
      addQuestion("Company Background",
          "ATFX Connect的流动性池主要来源于哪些机构？",
          ["零售客户订单","一级银行和非银行提供商","交易所竞价","内部做市"],
          "Where does ATFX Connect's liquidity pool mainly come from?",
          ["Retail client orders","Tier 1 banks and non-bank providers","Exchange auctions","Internal market making"],
          1
      );
      addQuestion("Company Background",
          "ATFX于哪一年投资了机构级电子外汇交易平台Spark Systems？",
          ["2022年","2023年","2024年","2025年"],
          "In which year did ATFX invest in Spark Systems, an institutional-grade electronic forex trading platform?",
          ["2022","2023","2024","2025"],
          2
      );
      addQuestion("Company Background",
          "Michael Mirarchi在ATFX担任什么职位？",
          ["全球战略合作与联盟业务副总裁","拉美机构销售总经理","机构业务运营总监","中东北非地区合规主管"],
          "What position does Michael Mirarchi hold at ATFX?",
          ["VP of Global Strategic Partnerships & Alliances","Managing Director of Institutional Sales (LATAM)","Director of Institutional Operations","Head of Compliance – MENA"],
          1
      );
      addQuestion("Company Background",
          "ConnectX生态系统融合了以下哪些前沿技术？",
          ["大数据、区块链和人工智能","云计算、物联网和5G","虚拟现实、增强现实和元宇宙","量子计算、边缘计算和深度学习"],
          "Which cutting-edge technologies are integrated into the ConnectX ecosystem?",
          ["Big data, blockchain, and artificial intelligence","Cloud computing, IoT, and 5G","Virtual reality, augmented reality, and metaverse","Quantum computing, edge computing, and deep learning"],
          0
      );
      addQuestion("Company Background",
          "ATFX通过伦敦劳合社为AT Global Markets LLC的客户提供最高多少金额的客户资金保险？",
          ["50万美元","85万美元","100万美元","150万美元"],
          "What is the maximum amount of client fund insurance provided by ATFX to AT Global Markets LLC clients through Lloyd's of London?",
          ["USD 500,000","USD 850,000","USD 1,000,000","USD 1,500,000"],
          2
      );
      addQuestion("Company Background",
          "ATFX英国实体将客户资金隔离存放于以下哪家银行？",
          ["汇丰银行","渣打银行","巴克莱银行","劳埃德银行"],
          "In which bank does ATFX's UK entity hold segregated client funds?",
          ["HSBC","Standard Chartered","Barclays","Lloyds"],
          2
      );
  // ========== Trading Knowledge 交易知识（50题）==========
  addQuestion("Trading Knowledge",
      "经纪商设置“维持保证金”要求的根本目的是什么？",
      ["确保客户有足够资金支付佣金","确保账户有足够资金抵御不利波动，降低穿仓风险","限制客户的交易频率","为客户提供更高的融资额度"],
      "What is the fundamental purpose of a broker setting a \"maintenance margin\" requirement?",
      ["To ensure clients have enough funds for commissions","To ensure the account has sufficient funds to withstand adverse movements and reduce the risk of excess loss","To limit the frequency of client trading","To provide clients with a higher financing limit"],
      1
  );
  addQuestion("Trading Knowledge",
      "保证金交易与实盘交易最根本的区别在于？",
      ["只能做多不能做空","交易时间受限","杠杆的存在，使小额资金能控制大额名义价值","使用的交易软件不同"],
      "What is the most fundamental difference between margin trading and physical delivery trading?",
      ["Only long positions are allowed","Trading hours are restricted","The existence of leverage, allowing small capital to control large notional value","The trading software is different"],
      2
  );
  addQuestion("Trading Knowledge",
      "在保证金制度下，交易者的最大亏损可能达到多少？",
      ["仅限于投入的保证金","永远等于手续费","可能超过本金，除非有负余额保护","被固定为账户余额的10%"],
      "In a margin system, how much can a trader's maximum loss potentially reach?",
      ["Only the margin deposited","Always equals the commission fee","Could exceed the principal unless negative balance protection is in place","Fixed at 10% of the account balance"],
      2
  );
  addQuestion("Trading Knowledge",
      "当经纪商在强制平仓时采用“从亏损最大仓位开始平仓”的方式，其主要目的是什么？",
      ["惩罚交易者的失误","快速降低账户的整体风险暴露","为了赚取更多手续费","随机挑选一个仓位平仓"],
      "When a broker uses the method of closing the most losing positions first during a forced liquidation, what is its main purpose?",
      ["To punish the trader for mistakes","To quickly reduce the overall risk exposure of the account","To earn more commissions","To randomly pick a position to close"],
      1
  );
  addQuestion("Trading Knowledge",
      "为什么监管机构通常会对零售外汇交易设置最高杠杆上限？",
      ["增加经纪商的收入","保护经验不足的投资者免受过度杠杆带来的巨大亏损风险","限制市场流动性","降低市场的波动性"],
      "Why do regulators typically impose a maximum leverage cap on retail forex trading?",
      ["To increase brokers' revenue","To protect inexperienced investors from the risk of huge losses caused by excessive leverage","To restrict market liquidity","To reduce market volatility"],
      1
  );
  addQuestion("Trading Knowledge",
      "外汇保证金交易中的“双向交易”机制是指？",
      ["交易者之间互相买卖","必须同时建立多头和空头仓位","无论市场涨跌，均有机会通过做多或做空获利","只能同时买入两种货币"],
      "What does the \"two-way trading\" mechanism mean in forex margin trading?",
      ["Traders buy from and sell to each other","Both long and short positions must be established at the same time","There are opportunities to profit by going long or short regardless of market direction","Only two currencies can be bought simultaneously"],
      2
  );
  addQuestion("Trading Knowledge",
      "当市场出现剧烈波动导致价格“跳空”时，止损单会怎样执行？",
      ["止损单将自动取消","交易会被暂停","可能在跳空后的下一个有效价格成交，出现滑点","一定会按设定的止损价成交"],
      "When the market experiences a sharp price \"gap\" due to extreme volatility, how is a stop-loss order executed?",
      ["The stop-loss order will be automatically cancelled","Trading will be suspended","It may be filled at the next available valid price after the gap, resulting in slippage","It will definitely be filled at the set stop-loss price"],
      2
  );
  addQuestion("Trading Knowledge",
      "经纪商提供的“杠杆”本质上是什么？",
      ["一种无风险的赠金","经纪商借给交易者用于放大交易规模的资金","监管机构强制要求的风险准备金","一种降低点差的优惠券"],
      "What is the \"leverage\" provided by a broker essentially?",
      ["A risk-free bonus","Funds borrowed by the broker to the trader to amplify trading size","A risk reserve mandated by regulators","A coupon for reducing spreads"],
      1
  );
  addQuestion("Trading Knowledge",
      "为什么较高杠杆可能导致账户更快被强制平仓？",
      ["因为交易速度变慢","因为隔夜利息增加","因为轻微的市场反向波动就会造成较大比例的净值亏损","因为点差变大"],
      "Why can higher leverage lead to an account being stopped out faster?",
      ["Because trading speed becomes slower","Because overnight interest increases","Because a slight adverse market move can cause a larger percentage loss in equity","Because the spread widens"],
      2
  );
  addQuestion("Trading Knowledge",
      "在保证金交易中，“净值”大于“余额”通常表明什么？",
      ["账户已被限制交易","当前持有的所有仓位总体处于盈利状态","账户从未进行过交易","当前持有的所有仓位总体处于亏损状态"],
      "In margin trading, what does it usually indicate when \"Equity\" is greater than \"Balance\"?",
      ["The account has been restricted from trading","All currently held positions are in an overall profit state","The account has never traded","All currently held positions are in an overall loss state"],
      1
  );
  addQuestion("Trading Knowledge",
      "当账户触发追加保证金通知时，交易者可以采取的正确行动是？",
      ["继续开立更多新头寸","更换更高杠杆的账户类型","追加资金或减少/平掉部分现有头寸","重置交易账户密码"],
      "What is the correct action a trader can take when a margin call is triggered?",
      ["Continue to open more new positions","Switch to a higher leverage account type","Add more funds or reduce/close some existing positions","Reset the trading account password"],
      2
  );
  addQuestion("Trading Knowledge",
      "周末或长假前，经纪商通常会提高保证金要求，主要原因是什么？",
      ["为了在假期期间进行系统维护","鼓励交易者持仓过节","规避市场休市期间可能发生重大行情导致的风险","降低交易平台的服务器负载"],
      "Before weekends or long holidays, why do brokers typically increase margin requirements?",
      ["To perform system maintenance during the holiday","To encourage traders to hold positions over the holiday","To mitigate the risk of significant market movements occurring while the market is closed","To reduce the load on trading platform servers"],
      2
  );
  addQuestion("Trading Knowledge",
      "交易者的交易策略不变，若经纪商降低了该品种的杠杆，交易者开立相同名义价值头寸所需的保证金将如何变化？",
      ["减少","保持不变","增加","变为零"],
      "If a broker reduces the leverage for an instrument while a trader's strategy remains unchanged, how will the margin required to open a position of the same notional value change?",
      ["Decrease","Remain unchanged","Increase","Become zero"],
      2
  );
  addQuestion("Trading Knowledge",
      "当预付款比例降至100%时，通常会发生什么？",
      ["触发盈利提示","触发追加保证金通知","自动提高杠杆","无法开仓"],
      "What typically happens when the margin ratio drops to 100%?",
      ["A profit alert is triggered","A margin call is triggered","Leverage is automatically increased","No new positions can be opened"],
      1
  );
  addQuestion("Trading Knowledge",
      "机构提供杠杆的主要风险控制措施是？",
      ["限制每日交易次数","强制平仓机制","提供交易信号服务","提供24小时客服"],
      "What is the primary risk control measure institutions use for providing leverage?",
      ["Limiting the number of daily trades","Forced liquidation mechanism","Providing trading signal services","Providing 24-hour customer service"],
      1
  );
  addQuestion("Trading Knowledge",
      "当账户处于“锁仓”状态时，其“已用保证金”通常是怎样计算的？",
      ["只需单边头寸的保证金","完全不需要保证金","双边头寸保证金之和","双边头寸保证金中较多的一边"],
      "When an account is in a \"locked\" state, how is its \"used margin\" typically calculated?",
      ["Only the margin for one side of the position","No margin is required at all","The sum of margins for both positions","The larger margin of the two positions"],
      0
  );
  addQuestion("Trading Knowledge",
      "为什么经纪商会对不同交易品种设置不同的保证金要求？",
      ["所有品种的保证金要求必须保持一致","完全随机设置","根据品种的历史波动性和流动性不同进行差异化风险管理","根据交易者的喜好设置"],
      "Why do brokers set different margin requirements for different trading instruments?",
      ["All instruments must have the same margin requirement","Set completely at random","Differentiated risk management based on the historical volatility and liquidity of each instrument","Set according to traders' preferences"],
      2
  );
  addQuestion("Trading Knowledge",
      "负余额保护机制主要保护的是谁的利益？",
      ["监管机构","经纪商","交易者","流动性提供商"],
      "Whose interests does the negative balance protection mechanism primarily protect?",
      ["Regulators","Brokers","Traders","Liquidity providers"],
      2
  );
  addQuestion("Trading Knowledge",
      "在重大新闻公布前后，部分经纪商会临时调整杠杆或保证金要求，这主要是为了？",
      ["方便客户获得更多盈利","减少服务器带宽压力","在潜在极端波动期间管理风险","遵循法定节假日安排"],
      "Why do some brokers temporarily adjust leverage or margin requirements before and after major news announcements?",
      ["To make it easier for clients to gain more profit","To reduce server bandwidth pressure","To manage risk during periods of potential extreme volatility","To follow statutory holiday schedules"],
      2
  );
  addQuestion("Trading Knowledge",
      "交叉盘货币对（如GBP/JPY）的保证金计算通常与直盘货币对（如EUR/USD）有何不同？",
      ["风险比包含美元的货币对低","完全不需要保证金","计算原理相同，但计算过程中涉及更多汇率转换","只能通过股票账户交易"],
      "How does the margin calculation for cross currency pairs (e.g., GBP/JPY) typically differ from major pairs (e.g., EUR/USD)?",
      ["The risk is lower than pairs containing the US Dollar","No margin is required at all","The calculation principle is the same, but involves more exchange rate conversions","They can only be traded through stock accounts"],
      2
  );
  addQuestion("Trading Knowledge",
      "一位交易者账户净值已接近强制平仓水平，他选择入金增加本金，此举对预付款比例的直接影响是什么？",
      ["自动将全部仓位平仓","立即提高预付款比例，暂时解除平仓风险","无任何影响","降低预付款比例"],
      "A trader's account equity is approaching the forced stop-out level. What is the direct impact of depositing additional funds on the margin ratio?",
      ["Automatically closes all positions","Immediately increases the margin ratio, temporarily relieving stop-out risk","No impact at all","Decreases the margin ratio"],
      1
  );
  addQuestion("Trading Knowledge",
      "跟单交易平台中，跟单者的保证金不足时会发生什么？",
      ["跟单者账户被立即注销","跟单开仓失败或按比例缩小跟单规模","自动使用信号提供者的资金","系统会自动为跟单者入金"],
      "In a copy trading platform, what happens when a follower has insufficient margin?",
      ["The follower's account is immediately terminated","The copy trade fails to open or the copied volume is scaled down proportionally","The signal provider's funds are automatically used","The system automatically deposits funds for the follower"],
      1
  );
  addQuestion("Trading Knowledge",
      "外汇保证金交易的5天24小时机制主要得益于什么？",
      ["自动化程序取代了人工交易","单一交易所的连续运作","全球各主要金融中心跨时区接力交易","各国央行的统一监管要求"],
      "What primarily enables the 24-hour, 5-day-a-week mechanism in forex margin trading?",
      ["Automated programs replacing manual trading","Continuous operation of a single exchange","Cross-time-zone relay trading across major global financial centers","Unified regulatory requirements of central banks worldwide"],
      2
  );
  addQuestion("Trading Knowledge",
      "经纪商将客户保证金与公司运营资金隔离存放，主要保障了什么？",
      ["提升公司信用评级","确保客户资金安全，避免因公司经营问题被挪用","降低公司的运营成本","加快交易成交速度"],
      "What is the main protection achieved by a broker segregating client margin from its own operating funds?",
      ["Improving the company's credit rating","Ensuring the safety of client funds and preventing them from being misappropriated due to company operational issues","Reducing the company's operating costs","Speeding up trade execution"],
      1
  );
  addQuestion("Trading Knowledge",
      "如果经纪商要求的最低初始保证金是1%，这意味着什么？",
      ["经纪商收取1%的手续费","开仓时需缴纳合约总价值的1%作为保证金","交易者账户中必须有1美元","每次交易盈利不会超过1%"],
      "If a broker requires a minimum initial margin of 1%, what does this mean?",
      ["The broker charges a 1% commission","1% of the total contract value must be deposited as margin to open a position","The trader must have $1 in their account","Profit per trade will not exceed 1%"],
      1
  );
  addQuestion("Trading Knowledge",
      "保证金交易中的“合约规格”主要定义了什么？",
      ["客户出金的时间限制","每一标准手所代表的标的资产数量或价值","经纪商的联系方式","交易平台的版本号"],
      "What does the \"Contract Specifications\" primarily define in margin trading?",
      ["The time limit for client withdrawals","The quantity or value of the underlying asset represented by one standard lot","The broker's contact information","The version number of the trading platform"],
      1
  );
  addQuestion("Trading Knowledge",
      "当交易账户发生“穿仓”时，意味着什么？",
      ["账户盈利创历史新高","持仓数量超过了账户限制","亏损额超过了账户内的所有本金，净值为负","账户净值刚刚触及初始入金"],
      "What does it mean when an account experiences an \"excess loss\"?",
      ["The account profit has reached a historical high","The number of positions held exceeds the account limit","The loss has exceeded all the principal in the account, resulting in negative equity","The account equity has just reached the initial deposit"],
      2
  );
  addQuestion("Trading Knowledge",
      "预付款比例为500%意味着什么？",
      ["账户处于高风险状态","可用预付款非常充裕，账户抗风险能力强","已触发强制平仓","必须立刻追加资金"],
      "What does a margin ratio of 500% indicate?",
      ["The account is in a high-risk state","The free margin is very ample, and the account has strong risk resistance","A forced stop-out has been triggered","Funds must be added immediately"],
      1
  );
  addQuestion("Trading Knowledge",
      "经纪商提高某一特定品种的保证金要求，通常是对什么的反应？",
      ["该品种交易量过低","该品种交易成本下降","该品种近期或预期波动性增加","该品种即将到期交割"],
      "Raising the margin requirement for a specific instrument is usually a broker's response to what?",
      ["Too low trading volume for the instrument","Decreased transaction costs for the instrument","Increased recent or expected volatility in the instrument","The instrument is about to expire for delivery"],
      2
  );
  addQuestion("Trading Knowledge",
      "市价订单与挂单（限价单）相比，其最大的风险是什么？",
      ["可能无法成交","可能以不利价格成交，出现滑点","需要支付更高手续费","只能在特定时间使用"],
      "Compared to pending orders (limit orders), what is the biggest risk of a market order?",
      ["It may not be filled","It may be filled at an unfavorable price, resulting in slippage","Higher commissions may be charged","It can only be used during specific hours"],
      1
  );
  addQuestion("Trading Knowledge",
      "套息交易策略的核心盈利来源是什么？",
      ["频繁进出赚取返佣","预测央行利率决议结果","获取两种货币之间的利率差异","捕捉短期价格波动"],
      "What is the core profit source of a carry trade strategy?",
      ["Frequent trading to earn rebates","Predicting the outcome of central bank interest rate decisions","Earning the interest rate differential between two currencies","Capturing short-term price fluctuations"],
      2
  );
  addQuestion("Trading Knowledge",
      "保证金交易中的货币对，其报价方式通常涉及哪两种货币？",
      ["基础货币与计价货币","在岸货币与离岸货币","数字货币与法定货币","储备货币与商品货币"],
      "In margin trading, what are the two currencies typically involved in quoting a currency pair?",
      ["Base currency and quote currency","Onshore currency and offshore currency","Digital currency and fiat currency","Reserve currency and commodity currency"],
      0
  );
  addQuestion("Trading Knowledge",
      "如果经纪商提供“负余额保护”政策，当市场极端波动导致账户净值为负时，会如何处理？",
      ["交易者需在规定期限内补足欠款","交易者必须用另一个账户的资金抵债","经纪商会将账户净值重置为零，承担超额亏损","账户将被移交给催收机构"],
      "If a broker offers a \"negative balance protection\" policy, what happens when extreme market volatility causes the account equity to go negative?",
      ["The trader must repay the owed amount within a specified period","The trader must use funds from another account to cover the debt","The broker will reset the account equity to zero and bear the excess loss","The account will be handed over to a collection agency"],
      2
  );
  addQuestion("Trading Knowledge",
      "订单类型中，止损单与限价单的根本区别在于？",
      ["止损单是平仓指令，限价单是开仓指令","止损单用于盈利，限价单用于亏损","止损单在价格突破指定价位后触发，限价单在价格触及或穿越指定价位时成交","没有任何区别"],
      "What is the fundamental difference between a stop order and a limit order?",
      ["A stop order is for closing positions, a limit order is for opening","A stop order is for profit, a limit order is for loss","A stop order is triggered when the price breaks through a specified level, while a limit order is executed when the price reaches or passes through a specified level","There is no difference"],
      2
  );
  addQuestion("Trading Knowledge",
      "交易量大的货币对（如EUR/USD）相比交易量小的货币对，保证金要求通常？",
      ["完全相同","更高","更低","没有规律"],
      "How do margin requirements for highly liquid pairs (e.g., EUR/USD) typically compare to those for less liquid pairs?",
      ["Exactly the same","Higher","Lower","No pattern"],
      2
  );
  addQuestion("Trading Knowledge",
      "当交易者说“做空EUR/USD”时，他的操作是？",
      ["卖出欧元，买入美元","同时买入欧元和美元","买入欧元，卖出美元","向经纪商借贷欧元"],
      "What operation is a trader performing when saying \"shorting EUR/USD\"?",
      ["Selling Euro and buying US Dollar","Buying both Euro and US Dollar simultaneously","Buying Euro and selling US Dollar","Borrowing Euro from the broker"],
      0
  );
  addQuestion("Trading Knowledge",
      "对保证金交易者来说，使用止损单最重要的作用是？",
      ["替代交易者进行市场分析","保证每次交易都能盈利","限制单笔交易的潜在最大亏损","增加盈利的概率"],
      "For a margin trader, what is the most important role of using a stop-loss order?",
      ["To replace the trader's market analysis","To guarantee profit on every trade","To limit the potential maximum loss of a single trade","To increase the probability of profit"],
      2
  );
  addQuestion("Trading Knowledge",
      "如果交易者发现其订单成交的价格与下单时看到的价格有差异，这最可能是什么现象？",
      ["交易平台系统错误","滑点","点差扩大","隔夜利息收取"],
      "If a trader finds that the executed price of an order differs from the price seen when placing it, what phenomenon is this most likely?",
      ["Trading platform system error","Slippage","Spread widening","Overnight interest charges"],
      1
  );
  addQuestion("Trading Knowledge",
      "“追加保证金预警”的预付款比例通常设定在什么水平？",
      ["永远为0%","等于强制平仓比例","远高于强制平仓比例之上","低于强制平仓比例"],
      "At what level is the margin call warning margin ratio usually set?",
      ["Always at 0%","Equal to the forced stop-out level","Substantially above the forced stop-out level","Below the forced stop-out level"],
      2
  );
  addQuestion("Trading Knowledge",
      "判断“已用预付款”高低的核心依据是什么？",
      ["与交易次数的关系","与持仓时长的对比","其与账户净值的比例，占用越高风险越大","与账户总入金金额的对比"],
      "What is the core basis for judging whether \"used margin\" is high or low?",
      ["Its relationship with the number of trades","Comparison with the holding period","Its proportion to the account equity; the higher the proportion, the greater the risk","Comparison with the total deposit amount"],
      2
  );
  addQuestion("Trading Knowledge",
      "外汇保证金交易中，为什么说“风险源于杠杆”？",
      ["因为杠杆会增加点差","因为杠杆会减慢交易速度","因为杠杆会按相同倍数放大潜在亏损","因为杠杆会收取额外手续费"],
      "In forex margin trading, why is it said that \"risk originates from leverage\"?",
      ["Because leverage increases spreads","Because leverage slows down trading speed","Because leverage amplifies potential losses by the same multiple","Because leverage charges additional fees"],
      2
  );
  addQuestion("Trading Knowledge",
      "经纪商在极端行情下可能会扩大点差，这主要是为了什么？",
      ["降低服务器能耗","管理自身在急剧波动市场中的做市风险","提升客户交易体验","吸引更多新客户"],
      "Why might a broker widen spreads during extreme market conditions?",
      ["To reduce server energy consumption","To manage its own market-making risk in a sharply fluctuating market","To enhance the client's trading experience","To attract more new clients"],
      1
  );
  addQuestion("Trading Knowledge",
      "“可用预付款”的最大用途是什么？",
      ["只能用于提取现金","自动转换为信用积分","用于开立新头寸或承受现有头寸的浮动亏损","支付经纪商的年费"],
      "What is the primary use of \"free margin\"?",
      ["Only used for cash withdrawals","Automatically converted into credit points","Opening new positions or absorbing floating losses from existing positions","Paying the broker's annual fee"],
      2
  );
  addQuestion("Trading Knowledge",
      "为什么交易者在持仓过夜时可能需要支付或获得隔夜利息？",
      ["为了补偿市场流动性的变化","因为交易涉及两种货币，其背后的经济体利率不同","作为对经纪商服务的小费","这是政府征收的持有税"],
      "Why might a trader pay or receive swap when holding a position overnight?",
      ["To compensate for changes in market liquidity","Because the trade involves two currencies with different underlying economic interest rates","As a tip for broker services","It is a holding tax imposed by the government"],
      1
  );
  addQuestion("Trading Knowledge",
      "当交易者使用“限价卖出单”时，他期望的成交价格是？",
      ["第二天开盘价","高于当前市价的某个价位","与当前市价完全一致","低于当前市价的某个价位"],
      "When a trader uses a \"Sell Limit Order,\" at what price does he expect to be filled?",
      ["At the next day's opening price","At a price above the current market price","At the exact current market price","At a price below the current market price"],
      1
  );
  addQuestion("Trading Knowledge",
      "“追踪止损”机制的核心是什么？",
      ["将止损价设置在盈亏平衡点","根据交易量自动调整止损距离","在市场朝有利方向移动时，自动将止损价同向移动以锁定利润","让止损价与现价始终保持固定点数距离"],
      "What is the core mechanism of a \"trailing stop\"?",
      ["Setting the stop-loss at the breakeven point","Automatically adjusting the stop distance based on trading volume","Automatically moving the stop-loss level in the favorable direction as the market moves to lock in profits","Keeping a fixed pip distance between the stop-loss and current price at all times"],
      2
  );
  addQuestion("Trading Knowledge",
      "为什么说保证金交易是“双刃剑”？",
      ["因为它可以同时进行多空交易","因为它必须24小时盯着屏幕","因为杠杆既能放大盈利也能放大亏损","因为它需要同时使用鼠标和键盘操作"],
      "Why is margin trading considered a \"double-edged sword\"?",
      ["Because it allows simultaneous long and short trading","Because you must watch the screen 24 hours a day","Because leverage can amplify both profits and losses","Because it requires using both a mouse and keyboard"],
      2
  );
  addQuestion("Trading Knowledge",
      "对经纪商而言，客户的“已用保证金”属于什么性质的资金？",
      ["是需要支付给上级清算机构的费用","是客户履约的担保金，被冻结，不可用于新开仓","是经纪商的直接收入","是可以自由支配的运营资金"],
      "For a broker, what is the nature of a client's \"used margin\"?",
      ["Fees payable to upstream clearing institutions","Collateral for the client's performance, frozen and unavailable for new positions","Direct income for the broker","Operating funds that can be freely used"],
      1
  );
  addQuestion("Trading Knowledge",
      "当市场流动性不足时，以下哪种情况最容易发生？",
      ["杠杆倍数自动提高","订单执行滑点增大","点差收窄","隔夜利息为零"],
      "When market liquidity is insufficient, which of the following is most likely to occur?",
      ["Leverage multiples automatically increase","Order execution slippage increases","Spreads narrow","Overnight interest becomes zero"],
      1
  );
  addQuestion("Trading Knowledge",
      "保证金交易者“风险偏好”主要体现在哪个交易参数的设置上？",
      ["使用哪种图表类型","选择哪个交易平台","所使用的实际杠杆倍数或头寸规模","选择哪种货币对"],
      "Which trading parameter setting primarily reflects a margin trader's \"risk appetite\"?",
      ["Which chart type is used","Which trading platform is chosen","The actual leverage multiple used or position size","Which currency pair is chosen"],
      2
  );

  // ========== Product Knowledge 产品知识（50题）==========
  addQuestion("Product Knowledge",
      "ATFX平台采用哪种交易模式？",
      ["做市商模式","STP直通式交易模式","ECN模式","混合模式"],
      "Which trading mode does the ATFX platform adopt?",
      ["Market maker mode","STP direct-through trading mode","ECN mode","Hybrid mode"],
      1
  );
  addQuestion("Product Knowledge",
      "ATFX平台的点差是固定的还是浮动的？",
      ["固定","浮动","有时固定有时浮动","不产生点差"],
      "Is the spread on the ATFX platform fixed or floating?",
      ["Fixed","Floating","Sometimes fixed sometimes floating","No spread"],
      1
  );
  addQuestion("Product Knowledge",
      "中国地区锁仓保证金是多少？",
      ["锁仓订单保证金总数的30%","锁仓订单保证金总数的50%","锁仓订单保证金总数的100%","不收取保证金"],
      "What is the margin for hedged positions in China Market?",
      ["30% of total margin of hedged orders","50% of total margin of hedged orders","100% of total margin of hedged orders","No margin required"],
      1
  );
  addQuestion("Product Knowledge",
      "强制平仓比例是多少？",
      ["20%","30%","50%","100%"],
      "What is the forced liquidation ratio?",
      ["20%","30%","50%","100%"],
      1
  );
  addQuestion("Product Knowledge",
      "期货原油产品是否有库存费？",
      ["有","没有，但有到期日","有，但很低","没有，也没有到期日"],
      "Does the futures crude oil product have swap fees?",
      ["Yes","No, but it has an expiry date","Yes, but very low","No, and no expiry date"],
      1
  );
  addQuestion("Product Knowledge",
      "货币对产品的库存费在哪一天收取3天费用？",
      ["周一","周二","周三","周五"],
      "On which day are 3 days of swap fees charged for currency pairs?",
      ["Monday","Tuesday","Wednesday","Friday"],
      2
  );
  addQuestion("Product Knowledge",
      "指数产品的库存费在哪一天收取3天费用？",
      ["周一","周二","周三","周五"],
      "On which day are 3 days of swap fees charged for index products?",
      ["Monday","Tuesday","Wednesday","Friday"],
      3
  );
  addQuestion("Product Knowledge",
      "股票CFD和ETF的库存费计算公式中，时间跨度通常是以一年多少天作为基数除数来计算的？",
      ["365天","366天","360天","260天"],
      "According to product knowledge, in the swap fee calculation formula for Stock CFDs and ETFs, how many days a year is typically used as the base divisor?",
      ["365 days","366 days","360 days","260 days"],
      2
  );
  addQuestion("Product Knowledge",
      "什么是点差？",
      ["买价","卖价","买价和卖价的差价","手续费"],
      "What is spread?",
      ["Bid price","Ask price","The difference between ask price and bid price","Commission fee"],
      2
  );
  addQuestion("Product Knowledge",
      "若当前北京时间为周三上午 10:00，且平台正处于夏令时，请问此时的服务器时间是多少？",
      ["周三 03:00","周三 04:00","周三 05:00","周三 15:00"],
      "If the current Beijing time is Wednesday 10:00 AM and the platform is in Daylight Saving Time (GMT+3), what is the current server time?",
      ["Wednesday 03:00","Wednesday 04:00","Wednesday 05:00","Wednesday 15:00"],
      2
  );
  addQuestion("Product Knowledge",
      "以下哪个指令属于追涨行为（做多）？",
      ["Buy Limit","Buy Stop","Sell Limit","Sell Stop"],
      "Which of the following orders is a chasing-the-rally behavior (going long)?",
      ["Buy Limit","Buy Stop","Sell Limit","Sell Stop"],
      1
  );
  addQuestion("Product Knowledge",
      "Buy Limit指令是在什么价格挂单买入？",
      ["高于现价","低于现价","等于现价","任意价格"],
      "At what price does a Buy Limit order place a buy order?",
      ["Above current price","Below current price","Equal to current price","Any price"],
      1
  );
  addQuestion("Product Knowledge",
      "Sell Limit指令是在什么价格挂单卖出？",
      ["高于现价","低于现价","等于现价","任意价格"],
      "At what price does a Sell Limit order place a sell order?",
      ["Above current price","Below current price","Equal to current price","Any price"],
      0
  );
  addQuestion("Product Knowledge",
      "Sell Stop指令属于什么行为？",
      ["追涨","杀跌","反弹卖出","回调买入"],
      "What type of behavior is a Sell Stop order?",
      ["Chasing the rally","Killing the fall","Selling on rebound","Buying on pullback"],
      1
  );
  addQuestion("Product Knowledge",
      "买入停损限价单（Buy Stop Limit）适用于哪种情况？",
      ["希望在更低价格买入","确认上涨趋势后于更优价格买入","立即买入","在高于现价卖出"],
      "What is the Buy Stop Limit order suitable for?",
      ["Want to buy at a lower price","Buy at a better price after confirming an upward trend","Buy immediately","Sell above current price"],
      1
  );
  addQuestion("Product Knowledge",
      "关于挂单交易的实际成交价格，以下哪项描述是正确的？",
      ["必然与请求价格完全一致","可能与请求价格有一定差异","由客户自主在成交时决定","绝不会发生滑点"],
      "Which of the following descriptions about the actual execution price of pending orders is correct?",
      ["Must be exactly the same as the requested price","May have a certain difference from the requested price","Determined by the client at execution","Slippage will never occur"],
      1
  );
  addQuestion("Product Knowledge",
      "在MT4平台中，查看产品规格的正确鼠标操作是？",
      ["在图表上双击左键","在市场报价窗口对应产品处点击右键并选择“规格”","在终端窗口点击右键","在菜单栏点击文件"],
      "In the MT4 platform, what is the correct mouse operation to view product specifications?",
      ["Double-click left button on the chart","Right-click the product in the Market Watch window and select 'Specification'","Right-click in the Terminal window","Click File in the menu bar"],
      1
  );
  addQuestion("Product Knowledge",
      "以下关于库存费（持仓过夜利息）正负符号的说法，正确的是？",
      ["符号为正时客户需要支付利息","符号为负时客户可以获得利息","符号为负时客户需支付利息，正值时获得利息","无论是正值还是负值客户都必须支付利息"],
      "Which statement about the positive or negative signs of swap fees (overnight interest) is correct?",
      ["Positive sign means clients need to pay interest","Negative sign means clients receive interest","Negative sign means clients need to pay interest, positive sign means receive interest","Clients must pay interest whether it is positive or negative"],
      2
  );
  addQuestion("Product Knowledge",
      "若当前北京时间为周五晚上 21:00，且平台正处于冬令时（GMT+2），请问此时的服务器时间是多少？",
      ["周五 15:00","周五 16:00","周五 17:00","周六 03:00"],
      "If the current Beijing time is Friday 09:00 PM and the platform is in Winter Time (GMT+2), what is the current server time?",
      ["Friday 15:00","Friday 16:00","Friday 17:00","Saturday 03:00"],
      0
  );
  addQuestion("Product Knowledge",
      "在MT4软件中，可以在哪里直接查看已建仓订单当前产生的库存费金额，而无需手动计算？",
      ["市场报价窗口","交易品种属性详情","终端窗口中的交易订单列表","历史图表数据"],
      "In MT4 software, where can you directly view the current swap fee amount generated by an open position without manual calculation?",
      ["Market Watch window","Product specifications details","The trading order list in Terminal window","Historical chart data"],
      2
  );
  addQuestion("Product Knowledge",
      "在外汇与贵金属持仓过夜结算中，平台是在每天的哪一个服务器系统时间（MT4 时间）执行库存费扣除或发放的？",
      ["中午 12:00","下午 18:00","午夜 00:00","凌晨 04:00"],
      "In overnight swap settlements, at what platform server time (MT4 time) does the system execute swap deductions or credits?",
      ["12:00 PM","18:00 PM","00:00 AM midnight","04:00 AM"],
      2
  );
  addQuestion("Product Knowledge",
      "为什么货币对、贵金属等产品在周三持仓过夜到周四会收取3天库存费？",
      ["因为周三的交易量最大","因为按照市场规格，周三收取的费用包含了周六和周日的库存费","因为周四平台系统维护","因为周三是国际银行结算日"],
      "Why are 3 days of swap fees charged for products like currency pairs and precious metals when holding positions overnight from Wednesday to Thursday?",
      ["Because Wednesday has the largest trading volume","Because according to market conventions, fees charged on Wednesday include swap fees for Saturday and Sunday","Because the platform system is maintained on Thursday","Because Wednesday is the international bank settlement day"],
      1
  );
  addQuestion("Product Knowledge",
      "对于大部分主流指数产品（如HK50、CHI50等），在哪一天持仓过夜会收取3天库存费？",
      ["周一","周三","周五","周六"],
      "For most major index products (such as HK50, CHI50, etc.), on which day of overnight holding will 3 days of swap fees be charged?",
      ["Monday","Wednesday","Friday","Saturday"],
      2
  );
  addQuestion("Product Knowledge",
      "若某一产品的过夜利息数值在系统规格中显示为“正数”，从账户资金流向的角度来看，这代表了什么？",
      ["客户需要向平台支付额外的手续费","客户的账户将获得这笔持仓利息收入","账户资金将被冻结直到平仓","该笔订单的点差会被动扩大"],
      "If the swap value of a product is displayed as a positive number in the system, what does it represent regarding account funds?",
      ["Clients need to pay extra commission","The client's account will receive this swap interest income","Account funds will be frozen until closing","The order spread will widen passively"],
      1
  );
  addQuestion("Product Knowledge",
      "根据规则，原油产品（如期货原油US/UK）的保证金收取的独特特点是什么？",
      ["根据账户杠杆大小而改变","属于固定保证金，且没有杠杆之分","每天根据收盘价浮动计算","完全不收取保证金"],
      "According to the rules, what is the unique characteristic of the margin charged for crude oil products (such as futures crude oil US/UK)?",
      ["Changes according to account leverage size","It is a fixed margin and has no distinction of leverage","Calculated floatingly based on the closing price every day","No margin required at all"],
      1
  );
  addQuestion("Product Knowledge",
      "关于智能交易系统（EA），下列说法正确的是？",
      ["EA可以完全替代人工判断，保证100%盈利","EA是基于特定逻辑和算法的自动化交易工具","ATFX平台禁止使用任何形式的EA","使用EA交易不需要网络连接"],
      "Regarding Expert Advisors (EA), which of the following statements is correct?",
      ["EA can completely replace human judgment and guarantee 100% profit","EA is an automated trading tool based on specific logic and algorithms","The ATFX platform prohibits the use of any form of EA","Trading with EA does not require an internet connection"],
      1
  );
  addQuestion("Product Knowledge",
      "在非交易时间内，通常无法进行以下哪项操作？",
      ["查看历史图表","开仓或平仓","修改账户密码","查看技术指标"],
      "During non-trading hours, which of the following operations is usually unavailable?",
      ["View historical charts","Open or close a position","Modify account password","View technical indicators"],
      1
  );
  addQuestion("Product Knowledge",
      "什么是账户净值（Equity）？",
      ["账户中的初始本金","余额加上或减去当前持仓的未实现盈亏","已经被冻结的保证金金额","已经提取的资金总额"],
      "What is Account Equity?",
      ["The initial principal in the account","Balance plus or minus the unrealized profit/loss of current positions","The amount of margin that has been frozen","The total amount of funds already withdrawn"],
      1
  );
  addQuestion("Product Knowledge",
      "止损订单（Stop Loss）的核心作用是什么？",
      ["锁定既有利润","在价格波动不利时限制最大潜在亏损","增加持仓手数","延迟订单成交时间"],
      "What is the core function of a Stop Loss order?",
      ["Lock in existing profits","Limit maximum potential loss when price movements are unfavorable","Increase position size","Delay order execution time"],
      1
  );
  addQuestion("Product Knowledge",
      "止盈订单（Take Profit）的主要目的是什么？",
      ["防止账户爆仓","在价格达到预期目标时自动离场并锁定利润","降低交易点差","自动申请出金"],
      "What is the primary purpose of a Take Profit order?",
      ["Prevent account liquidation","Automatically exit and lock in profits when the price reaches the expected target","Reduce trading spread","Automatically apply for withdrawal"],
      1
  );
  addQuestion("Product Knowledge",
      "非农就业数据（NFP）通常对以下哪个市场影响最大？",
      ["美元及相关直盘货币对","仅限加密货币","仅限中国A股指数","仅限农产品期货"],
      "Non-Farm Payroll (NFP) data usually has the greatest impact on which market?",
      ["USD and related major currency pairs","Cryptocurrency only","China A-share index only","Agricultural futures only"],
      0
  );
  addQuestion("Product Knowledge",
      "当账户的保证金比例（Margin Level）低于强制平仓线时，平台会执行什么操作？",
      ["自动为客户账户注资","开始强制关闭部分或全部未平仓订单","降低点差","冻结账户禁止登录"],
      "When the account's Margin Level falls below the forced liquidation line, what action will the platform take?",
      ["Automatically inject funds into the client's account","Start to force close part or all of the open orders","Reduce the spread","Freeze the account to prohibit login"],
      1
  );
  addQuestion("Product Knowledge",
      "关于外汇市场的24小时连续交易，以下哪个主要市场在星期一北京时间清晨最先开市？",
      ["悉尼","伦敦","纽约","东京"],
      "Regarding the 24-hour continuous trading in the forex market, which major market opens first in the early morning of Monday Beijing time?",
      ["Sydney","London","New York","Tokyo"],
      0
  );
  addQuestion("Product Knowledge",
      "在MT4图表上，“卖出价（Bid）”和“买入价（Ask）”之间的空间代表什么？",
      ["持仓利息","手续费","即时点差","滑点距离"],
      "What does the space between the 'Bid' price and 'Ask' price on an MT4 chart represent?",
      ["Swap interest","Commission","Instantaneous spread","Slippage distance"],
      2
  );
  addQuestion("Product Knowledge",
      "如果一名交易者预期某种商品未来的价格会下跌，他应该采取什么交易策略？",
      ["买入做多（Buy）","卖出做空（Sell）","锁仓不动","撤销所有挂单"],
      "If a trader expects the price of a certain commodity to fall in the future, what trading strategy should he adopt?",
      ["Buy (Go Long)","Sell (Go Short)","Hedge positions","Cancel all pending orders"],
      1
  );
  addQuestion("Product Knowledge",
      "外汇交易中的“点（Pip）”通常指什么？",
      ["汇率波动的最小标准单位","手续费的固定金额","杠杆的倍数","订单的交易手数"],
      "What does a 'Pip' usually refer to in forex trading?",
      ["The minimum standard unit of exchange rate movement","A fixed amount of commission","The multiple of leverage","The number of lots traded"],
      0
  );
  addQuestion("Product Knowledge",
      "以下哪种情况最有可能导致交易执行时的实际成交价与请求价产生不利差异（即滑动价位/滑点）？",
      ["市场平稳、流动性极高时","重大经济数据发布或市场流动性极低时","模拟账户交易时","周末闭市时"],
      "Which of the following situations is most likely to cause an unfavorable difference between the actual execution price and the requested price (i.e., slippage)?",
      ["When the market is stable and liquidity is extremely high","When major economic data is released or market liquidity is extremely low","When trading on a demo account","When the market is closed on weekends"],
      1
  );
  addQuestion("Product Knowledge",
      "当你在MT4上看到一条报价显示为EURUSD 1.0850 / 1.0852，此时如果你想“立即买入”1手欧元美元，成交价将是？",
      ["1.0850","1.0851","1.0852","1.0853"],
      "When you see a quote displayed as EURUSD 1.0850 / 1.0852 on MT4, if you want to 'buy immediately' 1 lot of EURUSD, the execution price will be?",
      ["1.0850","1.0851","1.0852","1.0853"],
      2
  );
  addQuestion("Product Knowledge",
      "在MT4平台上，如果想查看某个产品的交易代码、单笔最大/最小手数等完整属性，应当选择哪个功能？",
      ["规格 / 交易品种属性","图表属性","技术指标","新订单"],
      "On the MT4 platform, if you want to view the full attributes of a product, such as its trading symbol, maximum/minimum lot size per trade, which function should you choose?",
      ["Specification / Symbol properties","Chart properties","Technical indicators","New order"],
      0
  );
  addQuestion("Product Knowledge",
      "市场波动剧烈时，浮动点差通常会发生什么变化？",
      ["保持绝对不变","急剧变窄","急剧扩大 / 变宽","变为零点差"],
      "What usually happens to floating spreads when the market is highly volatile?",
      ["Remains absolutely unchanged","Narrows sharply","Widens / broadens sharply","Becomes zero spread"],
      2
  );
  addQuestion("Product Knowledge",
      "一个标准外汇货币对（如EURUSD）的1手（Lot），其基础货币的合约单位通常是多少？",
      ["1,000","10,000","100,000","1,000,000"],
      "What is the typical contract size of the base currency for 1 Lot of a standard forex currency pair (e.g., EURUSD)?",
      ["1,000","10,000","100,000","1,000,000"],
      2
  );
  addQuestion("Product Knowledge",
      "关于模拟账户（Demo Account），以下说法错误的是？",
      ["模拟账户使用虚拟资金进行交易演练","模拟账户的交易盈亏不需要承担真实金钱责任","模拟账户有效期为1个月","模拟账户的报价走势通常与真实账户一致"],
      "Which of the following statements about a Demo Account is incorrect?",
      ["Demo accounts use virtual funds for trading practice","Traders bear no real financial responsibility for profits or losses in a demo account","Demo account is valid for one month.","Price movements on a demo account are usually consistent with a live account"],
      2
  );
  addQuestion("Product Knowledge",
      "在交易进行中，可用保证金（Free Margin）是指什么？",
      ["已被开仓订单占用的保证金","净值减去已用保证金后，可用于建立新仓位的资金","账户存入的总资金","强制平仓被退回的资金"],
      "During active trading, what does 'Free Margin' refer to?",
      ["The margin already occupied by open positions","The funds available to open new positions, calculated as Equity minus Used Margin","The total funds deposited into the account","The funds returned after forced liquidation"],
      1
  );
  addQuestion("Product Knowledge",
      "下列哪个节假日期间，全球外汇及黄金市场通常会全天全线闭市？",
      ["感恩节","圣诞节 / 元旦","劳动节","万圣节"],
      "During which of the following holidays are the global forex and gold markets usually fully closed all day?",
      ["Thanksgiving","Christmas / New Year's Day","Labor Day","Halloween"],
      1
  );
  addQuestion("Product Knowledge",
      "在ATFX平台中，若客户建立了一笔买入（Buy）订单且一直持仓，当价格上涨时，该订单的盈亏状态是？",
      ["产生浮动亏损","产生浮动盈利","不盈不亏","直接转化为固定手续费"],
      "On the ATFX platform, if a client opens a Buy order and keeps holding it, what is the profit/loss status of the order when the price rises?",
      ["Generates a floating loss","Generates a floating profit","No profit or loss","Directly converted into a fixed commission"],
      1
  );
  addQuestion("Product Knowledge",
      "买入止损单（Buy Stop）是在什么价格水平进行挂单？",
      ["等于当前市场现价","低于当前市场现价","高于当前市场现价","任意无法触及的价格"],
      "At what price level does a Buy Stop order place a pending order?",
      ["Equal to the current market price","Below the current market price","Above the current market price","Any unreachable price"],
      2
  );
  addQuestion("Product Knowledge",
      "如果客户在同一产品上同时持有了相同手数的买单和卖单，这种状态在交易中通称为什么？",
      ["重仓交易","锁仓 / 对冲","爆仓平仓","挂单撤销"],
      "If a client holds a buy order and a sell order of the same lot size on the same product at the same time, what is this state commonly called in trading?",
      ["Heavy trading","Hedged position / Locking","Liquidation","Order cancellation"],
      1
  );
  addQuestion("Product Knowledge",
      "在MT4系统界面中，“市场报价（Market Watch）”窗口的最核心功能是？",
      ["修改账户杠杆比例","实时显示各交易品种的买价、卖价及点差空间","查看公司新闻","直接联系在线客服"],
      "In the MT4 system interface, what is the core function of the 'Market Watch' window?",
      ["Modify account leverage ratio","Display the real-time bid price, ask price, and spread space of each trading symbol","View company news","Directly contact online customer service"],
      1
  );
  addQuestion("Product Knowledge",
      "以下哪种行为不属于挂单（Pending Order）交易指令？",
      ["Buy Limit","Sell Stop","市价买入（Buy by Market）","Sell Limit"],
      "Which of the following actions does not belong to a Pending Order trading instruction?",
      ["Buy Limit","Sell Stop","Buy by Market","Sell Limit"],
      2
  );
  addQuestion("Product Knowledge",
      "外汇交易中的“基础货币（Base Currency）”是指货币对（如GBPUSD）中的哪一个？",
      ["排在前面的那个货币（如GBP）","排在后面的那个货币（如USD）","根据当天交易量动态决定","固定为美元（USD）"],
      "What does the 'Base Currency' in a forex currency pair (such as GBPUSD) refer to?",
      ["The currency listed first (e.g., GBP)","The currency listed second (e.g., USD)","Dynamically determined by the daily trading volume","Fixed as USD"],
      0
  );

  // ========== Trading Groups 交易组别（50题）==========
  addQuestion("Trading Groups",
      "中国地区对应的组别代码前缀是？",
      ["SEA","IB","SEAK","ATFX"],
      "What is the group code prefix for the China region?",
      ["SEA","IB","SEAK","ATFX"],
      1
  );
  addQuestion("Trading Groups",
      "以下哪个属于韩国组别？",
      ["SEA_ELI_","IB_ECN_","SEAK_15ADM_","SEA_00VP_"],
      "Which of the following belongs to the Korea group?",
      ["SEA_ELI_","IB_ECN_","SEAK_15ADM_","SEA_00VP_"],
      2
  );
  addQuestion("Trading Groups",
      "哪个组别代码表示“新疆组”？",
      ["IB_A_00_100","IB_XJ_00_100","SEA_00_200X","SEAK_22ACR_"],
      "Which group code represents the \"Xinjiang group\"?",
      ["IB_A_00_100","IB_XJ_00_100","SEA_00_200X","SEAK_22ACR_"],
      1
  );
  addQuestion("Trading Groups",
      "默认不带前缀的组别（如IB_A_00_100）代表哪种交易平台？",
      ["MT5","MT4","cTrader","网页版"],
      "Which trading platform does the default group without prefix (e.g., IB_A_00_100) represent?",
      ["MT5","MT4","cTrader","Web version"],
      1
  );
  addQuestion("Trading Groups",
      "以下哪个是MT5组别？",
      ["SEA_00_200","ATFXGM18\\SEA_00_200","MT5\\SEA_00_200","SEA_00_200.MT5"],
      "Which of the following is an MT5 group?",
      ["SEA_00_200","ATFXGM18\\SEA_00_200","MT5\\SEA_00_200","SEA_00_200.MT5"],
      1
  );
  addQuestion("Trading Groups",
      "下列代码中，哪一个属于东南亚的VIP组别？",
      ["SEA_00VP_","SEA_ELI_","SEA_SME_","SEA_ECN"],
      "Which of the following codes belongs to the Southeast Asia VIP group?",
      ["SEA_00VP_","SEA_ELI_","SEA_SME_","SEA_ECN"],
      0
  );
  addQuestion("Trading Groups",
      "中国地区中，STP点差类别的代码是？",
      ["IB_ECN_","IB_A_","IB_XJ","IB_STP_"],
      "In the China region, what is the code for the STP spread type?",
      ["IB_ECN_","IB_A_","IB_XJ","IB_STP_"],
      1
  );
  addQuestion("Trading Groups",
      "以下哪个组别有入金激活要求？",
      ["IB_ECN_ A06_400","SEAK_16ADM_400","IB_XJ_20_100","ATFXGM18\\SEA_SME_0A00_400"],
      "Which of the following groups has a deposit activation requirement?",
      ["IB_ECN_ A06_400","SEAK_16ADM_400","IB_XJ_20_100","ATFXGM18\\SEA_SME_0A00_400"],
      3
  );
  addQuestion("Trading Groups",
      "SEA组别中，EDGE点差类别的代码包括？",
      ["SEA_ECN","SEA_STD00_ / SEA_00ED_","SEA_00VP_","SEA_ELI_"],
      "In the SEA group, which codes represent the EDGE spread type?",
      ["SEA_ECN","SEA_STD00_ / SEA_00ED_","SEA_00VP_","SEA_ELI_"],
      1
  );
  addQuestion("Trading Groups",
      "SEA的Smart Edge组别对应哪个代码？",
      ["SEA_SME_","SEA_ELI_","SEA_00VP_","SEA_ECN"],
      "Which code corresponds to the Smart Edge group in SEA?",
      ["SEA_SME_","SEA_ELI_","SEA_00VP_","SEA_ECN"],
      0
  );
  addQuestion("Trading Groups",
      "SEA的Crystal组别的代码是？",
      ["SEAK_15ADM_","SEAK_22ACR_","SEAK_30AVP_","SEAK_48ASap_"],
      "What is the code for the Crystal group in SEA?",
      ["SEAK_15ADM_","SEAK_22ACR_","SEAK_30AVP_","SEAK_48ASap_"],
      1
  );
  addQuestion("Trading Groups",
      "以下哪个是SEA中Diamond组别的代码？",
      ["SEAK_22ACR_","SEAK_15ADM_","SEAK_30AVP_","SEAK_01Prem_"],
      "Which of the following is the code for the Diamond group in SEA?",
      ["SEAK_22ACR_","SEAK_15ADM_","SEAK_30AVP_","SEAK_01Prem_"],
      1
  );
  addQuestion("Trading Groups",
      "中国地区中，加点为+0 pips的代码是？",
      ["IB_1A_","IB_AA_","IB_A_","IB_2A_"],
      "In the China region, which code represents +0 pips mark-up?",
      ["IB_1A_","IB_AA_","IB_A_","IB_2A_"],
      2
  );
  addQuestion("Trading Groups",
      "以下哪个选项代表加1点？",
      ["IB_A_ 和 IB_1A_","IB_1A_ 和 IB_AA_","IB_AA_ 和 IB_2A_","仅IB_1A_"],
      "Which of the following options represents a +1 pip mark-up?",
      ["IB_A_ and IB_1A_","IB_1A_ and IB_AA_","IB_AA_ and IB_2A_","Only IB_1A_"],
      1
  );
  addQuestion("Trading Groups",
      "SEA组别中，没有加点的代码是？",
      ["SEA_1A00_","SEA_AA00_","SEA_A00_ / SEA_00_","SEA_2A00_"],
      "In the SEA group, which code has no mark-up?",
      ["SEA_1A00_","SEA_AA00_","SEA_A00_ / SEA_00_","SEA_2A00_"],
      2
  );
  addQuestion("Trading Groups",
      "SEA组别中加点为+2 pips的代码是？",
      ["SEA_1A00_","SEA_AA00_","SEA_2A00_","SEA_3A00_"],
      "In the SEA group, which code represents a +2 pips mark-up?",
      ["SEA_1A00_","SEA_AA00_","SEA_2A00_","SEA_3A00_"],
      2
  );
  addQuestion("Trading Groups",
      "代码IB_AA_代表的加点是多少？",
      ["+0 pips","+1 pips","+2 pips","+3 pips"],
      "What mark-up does the code IB_AA_ represent?",
      ["+0 pips","+1 pips","+2 pips","+3 pips"],
      1
  );
  addQuestion("Trading Groups",
      "下面哪个组别的交易成本最高？",
      ["IB_ECN_ A06_400","SEA_00ED_200","IB_XJ_00_100","ATFXGM18\\SEA_SME_0A00_400"],
      "Which of the following groups has the highest trading cost?",
      ["IB_ECN_ A06_400","SEA_00ED_200","IB_XJ_00_100","ATFXGM18\\SEA_SME_0A00_400"],
      2
  );
  addQuestion("Trading Groups",
      "中国地区中，手续费+0 USD的代码是？",
      ["IB_A_10_","IB_A_20_","IB_A_00_","IB_A_30_"],
      "In the China region, which code represents a commission of +0 USD?",
      ["IB_A_10_","IB_A_20_","IB_A_00_","IB_A_30_"],
      2
  );
  addQuestion("Trading Groups",
      "下面哪个组别的交易成本最高？",
      ["IB_A_50_100","SEA_00VP_200","IB_1A_10_100","ATFXGM18\\SEA_ELI_0A00_400"],
      "Which of the following groups has the highest trading cost?",
      ["IB_A_50_100","SEA_00VP_200","IB_1A_10_100","ATFXGM18\\SEA_ELI_0A00_400"],
      0
  );
  addQuestion("Trading Groups",
      "以下哪个手续费金额在中国地区中不存在？",
      ["+10 USD","+20 USD","+40 USD","+60 USD"],
      "Which commission amount does not exist in the China region?",
      ["+10 USD","+20 USD","+40 USD","+60 USD"],
      3
  );
  addQuestion("Trading Groups",
      "组别IB_1A_30_做一手EURUSD的额外交易成本是多少？",
      ["30","35","40","50"],
      "What is the extra trading cost for 1 lot of EURUSD in group IB_1A_30_?",
      ["30","35","40","50"],
      2
  );
  addQuestion("Trading Groups",
      "组别IB_A_50_做一手黄金的额外交易成本是多少？",
      ["+5 USD","+15 USD","+50 USD","+40 USD"],
      "What is the extra trading cost for 1 lot of Gold in group IB_A_50_?",
      ["+5 USD","+15 USD","+50 USD","+40 USD"],
      2
  );
  addQuestion("Trading Groups",
      "组别SEAK_16ADM_400做一手AUDUSD的额外交易成本是多少？",
      ["1.6 USD","0.16 USD","16 USD","160 USD"],
      "What is the extra trading cost for 1 lot of AUDUSD in group SEAK_16ADM_400?",
      ["1.6 USD","0.16 USD","16 USD","160 USD"],
      2
  );
  addQuestion("Trading Groups",
      "0.5%保证金要求的代码后缀是？",
      ["_100","_200","_400","_500"],
      "Which code suffix represents a 0.5% margin requirement?",
      ["_100","_200","_400","_500"],
      1
  );
  addQuestion("Trading Groups",
      "0.25%保证金要求的代码后缀是？",
      ["_100","_200","_400","_500"],
      "Which code suffix represents a 0.25% margin requirement?",
      ["_100","_200","_400","_500"],
      2
  );
  addQuestion("Trading Groups",
      "1%保证金要求的代码后缀是？",
      ["_100","_200","_400","_500"],
      "Which code suffix represents a 1% margin requirement?",
      ["_100","_200","_400","_500"],
      0
  );
  addQuestion("Trading Groups",
      "0.2%保证金要求的代码后缀是？",
      ["_100","_200","_400","_500"],
      "Which code suffix represents a 0.2% margin requirement?",
      ["_100","_200","_400","_500"],
      3
  );
  addQuestion("Trading Groups",
      "一般情况下，哪个杠杆比例在SEA组别中不存在？",
      ["1:200","1:400","1:500","1:100"],
      "Generally, which leverage ratio does not exist in the SEA group?",
      ["1:200","1:400","1:500","1:100"],
      3
  );
  addQuestion("Trading Groups",
      "韩国宝石组的额外交易费用如何体现？",
      ["手续费","点差","无额外交易费用","手续费+点差"],
      "How is the extra trading cost reflected in the Korea Gem group?",
      ["Commission","Spread","No extra cost","Commission + Spread"],
      1
  );
  addQuestion("Trading Groups",
      "以下哪个代码表示中国地区的新疆免息组？",
      ["IB_A_00_100","IB_XJ_00_100","IB_A_00_400X","SEA_00_200X"],
      "Which code represents the Xinjiang swap-free group in the China region?",
      ["IB_A_00_100","IB_XJ_00_100","IB_A_00_400X","SEA_00_200X"],
      1
  );
  addQuestion("Trading Groups",
      "中国地区中，非新疆的免息组别如何表示？",
      ["组别最前面加X","组别最后加X","组别中间加XJ","使用特殊前缀"],
      "In the China region, how are non-Xinjiang swap-free groups represented?",
      ["Add X at the beginning of the group","Add X at the end of the group","Add XJ in the middle of the group","Use a special prefix"],
      1
  );
  addQuestion("Trading Groups",
      "SEA组别免息组别的标识是？",
      ["组别最后加X","组别最前面加X","使用XJ前缀","SEA无免息"],
      "What is the identifier for swap-free groups in the SEA group?",
      ["Add X at the end of the group","Add X at the beginning of the group","Use XJ prefix","SEA has no swap-free"],
      0
  );
  addQuestion("Trading Groups",
      "代码IB_A_00_400X表示什么？",
      ["杠杆1:400，免息","杠杆1:400，非免息","加点+2 pips","MT5组别"],
      "What does the code IB_A_00_400X represent?",
      ["Leverage 1:400, swap-free","Leverage 1:400, not swap-free","+2 pips mark-up","MT5 group"],
      0
  );
  addQuestion("Trading Groups",
      "关于SEAK组别免息信息，正确的是？",
      ["末尾加X","使用XJ前缀","无免息选项","高手续费"],
      "Which is correct about swap-free information for SEAK groups?",
      ["Add X at the end","Use XJ prefix","No swap-free option","High commission"],
      0
  );
  addQuestion("Trading Groups",
      "一个完整的组别代码为“IB_1A_20_400”。请判断以下哪项描述完全正确？",
      ["中国地区，加点+0 pips，手续费+20 USD，杠杆1:400，非免息","中国地区，加点+1 pips，手续费+20 USD，杠杆1:400，非免息","东南亚地区，加点+1 pips，手续费+20 USD，杠杆1:400，非免息","中国地区，加点+1 pips，手续费+20 USD，杠杆1:400，免息"],
      "The full group code is \"IB_1A_20_400\". Which description is completely correct?",
      ["China region, +0 pips mark-up, commission +20 USD, leverage 1:400, non-swap-free","China region, +1 pip mark-up, commission +20 USD, leverage 1:400, non-swap-free","Southeast Asia region, +1 pip mark-up, commission +20 USD, leverage 1:400, non-swap-free","China region, +1 pip mark-up, commission +20 USD, leverage 1:400, swap-free"],
      1
  );
  addQuestion("Trading Groups",
      "一般情况下“SEA_2A30_200” – 组别是否存在？如存在，其含义是？",
      ["不存在，因为SEA组别加点与手续费格式不允许同时出现","存在，表示东南亚地区，+2 pips，手续费+30 USD，非免息","存在，表示东南亚地区，+2 pips，手续费+30 USD, 免息","不存在，因为SEA手续费无+30 USD档"],
      "Generally, does the group \"SEA_2A30_200\" exist? If so, what does it mean?",
      ["Does not exist, because the mark-up and commission format cannot appear together in SEA groups","Exists, meaning Southeast Asia region, +2 pips, commission +30 USD, non-swap-free","Exists, meaning Southeast Asia region, +2 pips, commission +30 USD, swap-free","Does not exist, because SEA does not have a +30 USD commission tier"],
      0
  );
  addQuestion("Trading Groups",
      "以下哪个代码代表一个中国地区的MT5组别，加点+0 pips，手续费+10 USD，杠杆1:500，非免息？",
      ["ATFXGM18\\IB_A_10_500","IB_A_10_500","ATFXGM18\\IB_1A_10_500","ATFXGM18\\IB_A_00_500"],
      "Which code represents a China region MT5 group with +0 pips mark-up, commission +10 USD, leverage 1:500, non-swap-free?",
      ["ATFXGM18\\IB_A_10_500","IB_A_10_500","ATFXGM18\\IB_1A_10_500","ATFXGM18\\IB_A_00_500"],
      0
  );
  addQuestion("Trading Groups",
      "组别“IB_AA_30_400”。以下哪个解读正确？",
      ["加点+1 pips，手续费+30 USD","加点+0 pips，手续费+30 USD","加点+1 pips，手续费+0 USD","加点+2 pips，手续费+30 USD"],
      "Group \"IB_AA_30_400\". Which interpretation is correct?",
      ["+1 pip mark-up, commission +30 USD","+0 pips mark-up, commission +30 USD","+1 pip mark-up, commission +0 USD","+2 pips mark-up, commission +30 USD"],
      0
  );
  addQuestion("Trading Groups",
      "下面哪个组别的交易成本最高？",
      ["IB_A_50_100","IB_1A_30_100","IB_1A_10_100","IB_1A_50_100"],
      "Which of the following groups has the highest trading cost?",
      ["IB_A_50_100","IB_1A_30_100","IB_1A_10_100","IB_1A_50_100"],
      3
  );
  addQuestion("Trading Groups",
      "以下哪个组别同时满足：中国地区、加点+3 pips、手续费+0 USD、杠杆1:400、免息？",
      ["SEA_3A00_400X","SEA_3A30_400","SEA_2A20_400X","SEA_3A10_400X"],
      "Which group simultaneously satisfies: China region, +3 pips mark-up, commission +0 USD, leverage 1:400, swap-free?",
      ["SEA_3A00_400X","SEA_3A30_400","SEA_2A20_400X","SEA_3A10_400X"],
      0
  );
  addQuestion("Trading Groups",
      "代码“IB_XJ_00_100”与“IB_A_00_400X”的共同点是什么？",
      ["都是中国地区免息组别","都是MT5组别","都使用ECN点差","都有加点"],
      "What do the codes \"IB_XJ_00_100\" and \"IB_A_00_400X\" have in common?",
      ["Both are China region swap-free groups","Both are MT5 groups","Both use ECN spreads","Both have mark-up"],
      0
  );
  addQuestion("Trading Groups",
      "针对组别“SEA_ELI_”。以下哪项描述正确？",
      ["该组别属于韩国地区","该组别点差比标准组别低","该组别手续费固定为+10 USD","该组别杠杆只能1:200"],
      "Regarding the group \"SEA_ELI_\". Which description is correct?",
      ["This group belongs to the Korea region","This group has lower spreads than standard groups","This group has a fixed commission of +10 USD","This group can only have leverage 1:200"],
      1
  );
  addQuestion("Trading Groups",
      "组别ATFXGM18\\IB_ECN_ A06_400 做一手USDJPY的额外交易成本是多少？",
      ["0.6 USD","6 × 1000JPY","6 ÷ 1000JPY","6 USD"],
      "What is the extra trading cost for 1 lot of USDJPY in group ATFXGM18\\IB_ECN_ A06_400?",
      ["0.6 USD","6 × 1000JPY","6 ÷ 1000JPY","6 USD"],
      3
  );
  addQuestion("Trading Groups",
      "组别ATFXGM18\\IB_1A_ 10_400 做一手USDJPY的额外交易成本是多少？",
      ["10 USD + 1000JPY","11 USD","20 USD","1 USD + 1000JPY"],
      "What is the extra trading cost for 1 lot of USDJPY in group ATFXGM18\\IB_1A_ 10_400?",
      ["10 USD + 1000JPY","11 USD","20 USD","1 USD + 1000JPY"],
      0
  );
  addQuestion("Trading Groups",
      "组别ATFXGM18\\IB_A_ 50_400 做一手USDJPY的额外交易成本是多少？",
      ["5 USD + 5000JPY","50 USD","55 USD","5 USD + 1000JPY"],
      "What is the extra trading cost for 1 lot of USDJPY in group ATFXGM18\\IB_A_ 50_400?",
      ["5 USD + 5000JPY","50 USD","55 USD","5 USD + 1000JPY"],
      1
  );
  addQuestion("Trading Groups",
      "某代码为“ATFXGM18\\SEAK_15ADM_”。请判断其正确性及含义：",
      ["正确，表示东南亚地区，MT5平台的Diamond组别","错误，SEAK组别不支持MT5","正确，但SEAK_15ADM_是Crystal组别","错误，MT5前缀只能用于中国组别"],
      "The code is \"ATFXGM18\\SEAK_15ADM_\". Judge its correctness and meaning:",
      ["Correct, represents Southeast Asia region, Diamond group on MT5 platform","Incorrect, SEAK groups do not support MT5","Correct, but SEAK_15ADM_ is the Crystal group","Incorrect, MT5 prefix can only be used for China groups"],
      0
  );
  addQuestion("Trading Groups",
      "一个组别代码为“IB_AA_20_400X”。以下哪项描述错误？",
      ["属于中国地区","加点+1 pips","手续费+20 USD","免息且杠杆1:500"],
      "The group code is \"IB_AA_20_400X\". Which description is incorrect?",
      ["Belongs to China region","+1 pip mark-up","Commission +20 USD","Swap-free and leverage 1:500"],
      3
  );
  addQuestion("Trading Groups",
      "客户要求：东南亚地区，Smart Edge点差，+1.1点，手续费+0 USD，杠杆1:500，MT5平台，免息。以下哪个代码符合？",
      ["ATFXGM18\\SEA_SME_11A00_500X","SEA_SME_1A00_500X","ATFXGM18\\SEA_SME_AA00_500X","ATFXGM18\\SEA_SME_1A00_500"],
      "Client requirements: Southeast Asia region, Smart Edge spread, +1.1 pips mark-up, commission +0 USD, leverage 1:500, MT5 platform, swap-free. Which code meets the requirements?",
      ["ATFXGM18\\SEA_SME_11A00_500X","SEA_SME_1A00_500X","ATFXGM18\\SEA_SME_AA00_500X","ATFXGM18\\SEA_SME_1A00_500"],
      0
  );
  addQuestion("Trading Groups",
      "请从以下选项中选出不可能存在的组别：",
      ["IB_ECN_3A_30_400","SEA_3A00_500X","SEAK_30AVP_400","IB_1A_50_100X"],
      "Please select the group that cannot exist from the following options:",
      ["IB_ECN_3A_30_400","SEA_3A00_500X","SEAK_30AVP_400","IB_1A_50_100X"],
      0
  );

  // ========== Trading Calculations 交易计算（50题）==========
  addQuestion("Trading Calculations",
      "客户在中国市场以 1.0800 的价格买入 1 手 EURUSD，使用杠杆为 100，请问该笔建仓需要的已用预付款（保证金）是多少？",
      ["$1,080","$1,000","$10,800","$540"],
      "A client in the China market buys 1 lot of EURUSD at 1.0800 with a leverage of 100. What is the used margin required for opening this position?",
      ["$1,080","$1,000","$10,800","$540"],
      0
  );
  addQuestion("Trading Calculations",
      "客户以 1.2500 的价格卖出 2 手 GBPUSD，使用杠杆为 400，请问该笔建仓需要的保证金是多少？",
      ["$500","$625","$2,500","$1,250"],
      "A client sells 2 lots of GBPUSD at 1.2500 with a leverage of 400. What is the required margin for opening this position?",
      ["$500","$625","$2,500","$1,250"],
      1
  );
  addQuestion("Trading Calculations",
      "客户以 150.00 的价格买入 0.5 手 USDJPY，使用杠杆为 200，请问建仓保证金是多少？",
      ["$375","$250","$750","$150"],
      "A client buys 0.5 lots of USDJPY at 150.00 with a leverage of 200. What is the margin required to open the position?",
      ["$375","$250","$750","$150"],
      1
  );
  addQuestion("Trading Calculations",
      "客户以 0.6500 的价格买入 1 手 AUDUSD，使用杠杆为 100，请问建仓保证金是多少？",
      ["$650","$1,000","$65","$1,300"],
      "A client buys 1 lot of AUDUSD at 0.6500 with a leverage of 100. What is the margin required to open the position?",
      ["$650","$1,000","$65","$1,300"],
      0
  );
  addQuestion("Trading Calculations",
      "客户以 2,300 的价格买入 1 手 XAUUSD，使用杠杆为 200，请问建仓保证金是多少？",
      ["$1,150","$2,300","$575","$115"],
      "A client buys 1 lot of XAUUSD at 2,300 with a leverage of 200. What is the margin required to open the position?",
      ["$1,150","$2,300","$575","$115"],
      0
  );
  addQuestion("Trading Calculations",
      "客户以 30.00 的价格卖出 2 手 XAGUSD，使用杠杆为 100，请问建仓保证金是多少？",
      ["$3,000","$1,500","$30,000","$6,000"],
      "A client sells 2 lots of XAGUSD at 30.00 with a leverage of 100. What is the margin required to open the position?",
      ["$3,000","$1,500","$30,000","$6,000"],
      0
  );
  addQuestion("Trading Calculations",
      "客户以 80.00 的价格买入 1 手 USOIL.MMMYY，杠杆为 100，请问建仓保证金是多少？",
      ["$800","$8,000","$400","$1,000"],
      "A client buys 1 lot of USOIL.MMMYY at 80.00 with a leverage of 100. What is the margin required to open the position?",
      ["$800","$8,000","$400","$1,000"],
      0
  );
  addQuestion("Trading Calculations",
      "客户以 1.3500 的价格卖出 1 手 USDCAD，使用杠杆为 400，请问建仓保证金是多少？",
      ["$250","$337.5","$1,350","$100"],
      "A client sells 1 lot of USDCAD at 1.3500 with a leverage of 400. What is the margin required to open the position?",
      ["$250","$337.5","$1,350","$100"],
      0
  );
  addQuestion("Trading Calculations",
      "客户以 0.6000 的价格买入 5 手 NZDUSD，使用杠杆为 200，请问建仓保证金是多少？",
      ["$1,500","$2,500","$3,000","$750"],
      "A client buys 5 lots of NZDUSD at 0.6000 with a leverage of 200. What is the margin required to open the position?",
      ["$1,500","$2,500","$3,000","$750"],
      1
  );
  addQuestion("Trading Calculations",
      "客户以 0.9000 的价格买入 1 手 USDCHF，使用杠杆为 100，请问建仓保证金是多少？",
      ["$1,000","$900","$100","$450"],
      "A client buys 1 lot of USDCHF at 0.9000 with a leverage of 100. What is the margin required to open the position?",
      ["$1,000","$900","$100","$450"],
      0
  );
  addQuestion("Trading Calculations",
      "客户在中国市场同时持有 2 手 EURUSD Buy 单和 1 手 EURUSD Sell 单，建仓价均为 1.1000，杠杆 100。请问该账户的已用预付款（保证金）是多少？",
      ["$2,200","$1,100","$3,300","$0"],
      "A client in the China market simultaneously holds 2 lots of EURUSD Buy and 1 lot of EURUSD Sell, both opened at 1.1000 with a leverage of 100. What is the used margin for this account?",
      ["$2,200","$1,100","$3,300","$0"],
      0
  );
  addQuestion("Trading Calculations",
      "客户在中国市场同时持有 1 手 GBPUSD Buy 单和 3 手 GBPUSD Sell 单，建仓价均为 1.2000，杠杆 200。请问该账户的已用预付款（保证金）是多少？",
      ["$1,800","$600","$1,200","$2,400"],
      "A client in the China market simultaneously holds 1 lot of GBPUSD Buy and 3 lots of GBPUSD Sell, both opened at 1.2000 with a leverage of 200. What is the used margin for this account?",
      ["$1,800","$600","$1,200","$2,400"],
      3
  );
  addQuestion("Trading Calculations",
      "客户在中国市场完全锁仓（持有 1 手 XAUUSD Buy单和 1 手 XAUUSD Sell单），建仓价为 2000，杠杆 100。请问总已用预付款是多少？",
      ["$2,000","$4,000","$0","$1,000"],
      "A client in the China market is fully hedged (holding 1 lot of XAUUSD Buy and 1 lot of XAUUSD Sell) opened at 2000 with a leverage of 100. What is the total used margin?",
      ["$2,000","$4,000","$0","$1,000"],
      0
  );
  addQuestion("Trading Calculations",
      "客户在 SEA 市场完全锁仓（持有 1 手 XAUUSD Buy单和 1 手 XAUUSD Sell单），建仓价为 2000，杠杆 100。请问该账户的已用预付款（保证金）是多少？",
      ["$2,000","$0","$4,000","$500"],
      "A client in the SEA market is fully hedged (holding 1 lot of XAUUSD Buy and 1 lot of XAUUSD Sell) opened at 2000 with a leverage of 100. What is the used margin for this account?",
      ["$2,000","$0","$4,000","$500"],
      1
  );
  addQuestion("Trading Calculations",
      "客户在 SEA 市场持有 3 手 EURUSD Buy 单和 1 手 EURUSD Sell 单，建仓价均为 1.0000，杠杆 100。请问该账户的已用预付款（保证金）是多少？",
      ["$3,000","$2,000","$1,000","$0"],
      "A client in the SEA market holds 3 lots of EURUSD Buy and 1 lot of EURUSD Sell, both opened at 1.0000 with a leverage of 100. What is the used margin for this account?",
      ["$3,000","$2,000","$1,000","$0"],
      1
  );
  addQuestion("Trading Calculations",
      "客户以 1.0800 买入 1 手 EURUSD，随后在 1.0850 平仓。请问该笔交易的盈亏是多少？",
      ["盈利 $50","盈利 $500","亏损 $500","盈利 $5,000"],
      "A client buys 1 lot of EURUSD at 1.0800 and subsequently closes it at 1.0850. What is the profit or loss of this transaction?",
      ["Profit $50","Profit $500","Loss $500","Profit $5,000"],
      1
  );
  addQuestion("Trading Calculations",
      "客户以 1.2600 卖出 2 手 GBPUSD，随后在 1.2520 平仓。请问该笔交易的盈亏是多少？",
      ["盈利 $1,600","亏损 $1,600","盈利 $800","盈利 $160"],
      "A client sells 2 lots of GBPUSD at 1.2600 and subsequently closes the position at 1.2520. What is the profit or loss of this transaction?",
      ["Profit $1,600","Loss $1,600","Profit $800","Profit $160"],
      0
  );
  addQuestion("Trading Calculations",
      "客户以 155.00 买入 1 手 USDJPY，随后在 154.00 平仓。请问该笔交易的盈亏是多少？",
      ["亏损 100,000 JPY","盈利 100,000 JPY","亏损 1,000 USD","亏损 10,000 JPY"],
      "A client buys 1 lot of USDJPY at 155.00 and subsequently closes it at 154.00. What is the profit or loss of this transaction?",
      ["Loss 100,000 JPY","Profit 100,000 JPY","Loss 1,000 USD","Loss 10,000 JPY"],
      0
  );
  addQuestion("Trading Calculations",
      "客户以 2,400.00 买入 0.5 手 XAUUSD，随后在 2,380.00 平仓。请问该笔交易的盈亏是多少？",
      ["亏损 $1,000","亏损 $10","亏损 $2,000","盈利 $1,000"],
      "A client buys 0.5 lots of XAUUSD at 2,400.00 and subsequently closes it at 2,380.00. What is the profit or loss of this transaction?",
      ["Loss $1,000","Loss $10","Loss $2,000","Profit $1,000"],
      0
  );
  addQuestion("Trading Calculations",
      "客户以 30.00 卖出 1 手 XAGUSD，随后在 31.00 平仓。请问该笔交易的盈亏是多少？",
      ["亏损 $5,000","盈利 $5,000","亏损 $1,000","亏损 $50"],
      "A client sells 1 lot of XAGUSD at 30.00 and subsequently closes it at 31.00. What is the profit or loss of this transaction?",
      ["Loss $5,000","Profit $5,000","Loss $1,000","Loss $50"],
      0
  );
  addQuestion("Trading Calculations",
      "客户以 85.00 买入 2 手 WTI，随后在 86.50 平仓。请问盈亏是多少？",
      ["盈利 $3,000","盈利 $1,500","亏损 $3,000","盈利 $300"],
      "A client buys 2 lots of WTI at 85.00 and subsequently closes the position at 86.50. What is the profit or loss?",
      ["Profit $3,000","Profit $1,500","Loss $3,000","Profit $300"],
      0
  );
  addQuestion("Trading Calculations",
      "账户余额 $10,000，无信用额。当前持有一个单子亏损 $2,000，已用预付款为 $1,000。请问当前账户的净值是多少？",
      ["$10,000","$8,000","$9,000","$7,000"],
      "The account balance is $10,000 with no credit. A currently held position has a loss of $2,000, and the used margin is $1,000. What is the current equity of the account?",
      ["$10,000","$8,000","$9,000","$7,000"],
      1
  );
  addQuestion("Trading Calculations",
      "账户余额 $5,000，信用额 $1,000。当前无持仓。请问账户的净值是多少？",
      ["$5,000","$6,000","$4,000","$1,000"],
      "The account balance is $5,000 with a credit of $1,000. There are currently no open positions. What is the equity of the account?",
      ["$5,000","$6,000","$4,000","$1,000"],
      1
  );
  addQuestion("Trading Calculations",
      "账户余额 $4,000，无信用额。当前持仓有一笔 Buy 单盈利 $500，一笔 Sell 单亏损 $300。已用预付款为 $500。请问当前可用预付款是多少？",
      ["$4,200","$3,700","$4,000","$3,500"],
      "The account balance is $4,000 with no credit. Current positions include a Buy order with a profit of $500 and a Sell order with a loss of $300. The used margin is $500. What is the current free margin?",
      ["$4,200","$3,700","$4,000","$3,500"],
      1
  );
  addQuestion("Trading Calculations",
      "账户余额 $2,000，信用额 $500。持仓变动亏损 $800，已用预付款为 $400。请问当前可用预付款是多少？",
      ["$1,300","$1,700","$2,500","$900"],
      "The account balance is $2,000 with a credit of $500. The open positions have a floating loss of $800, and the used margin is $400. What is the current free margin?",
      ["$1,300","$1,700","$2,500","$900"],
      0
  );
  addQuestion("Trading Calculations",
      "当前账户净值为 $3,000，已用预付款（保证金）为 $1,000。请问当前的预付款比例是多少？",
      ["30%","300%","100%","33.3%"],
      "The current account equity is $3,000, and the used margin is $1,000. What is the current margin level?",
      ["30%","300%","100%","33.3%"],
      1
  );
  addQuestion("Trading Calculations",
      "当前账户余额 $1,500，无信用额，持仓浮亏 $500，已用预付款为 $500。请问目前的预付款比例是多少？",
      ["200%","300%","100%","50%"],
      "The current account balance is $1,500 with no credit. Open positions have a floating loss of $500, and the used margin is $500. What is the current margin level?",
      ["200%","300%","100%","50%"],
      0
  );
  addQuestion("Trading Calculations",
      "当前账户净值为 $450，已用预付款为 $1,500。请问当前的预付款比例是多少？",
      ["30%","33.3%","25%","15%"],
      "The current account equity is $450, and the used margin is $1,500. What is the current margin level?",
      ["30%","33.3%","25%","15%"],
      0
  );
  addQuestion("Trading Calculations",
      "账户净值为 $900，已用预付款为 $900。客户想再开新仓，已知新仓所需保证金为 $100。请问客户能否成功建仓？",
      ["可以，因为可用预付款足够","不能，因为当前预付款比例等于 100%，开仓后会低于 100%","可以，开仓不看当前比例","不能，因为可用预付款为 $0，低于 100% 不能建仓"],
      "The account equity is $900, and the used margin is $900. The client wants to open a new position, and the required margin for the new position is known to be $100. Can the client successfully open the position?",
      ["Yes, because the free margin is sufficient","No, because the current margin level is exactly 100%, and it will drop below 100% after opening","Yes, opening positions does not depend on the current level","No, because the free margin is $0, and new positions cannot be opened when the margin level is below 100%"],
      3
  );
  addQuestion("Trading Calculations",
      "账户余额 $2,000，无信用额。当前持仓已用预付款 $1,200，变动亏损 $900。请问该客户此时能否开立新仓？",
      ["可以","不能，因为当前预付款比例低于 100%","不能，因为余额不足","可以，只要新仓保证金小于 $100"],
      "The account balance is $2,000 with no credit. Current positions have a used margin of $1,200 and a floating loss of $900. Can the client open a new position at this moment?",
      ["Yes","No, because the current margin level is below 100%","No, because the balance is insufficient","Yes, as long as the new position's margin is less than $100"],
      1
  );
  addQuestion("Trading Calculations",
      "某中国内地客户账户余额 $1,000，无信用额。持仓两笔订单：订单 A（亏损 $500），订单 B（亏损 $210）。两笔订单总保证金为 $1,000。请问此时该账户会发生什么？",
      ["没有任何事情发生","仅强制平仓订单 A","仅强制平仓订单 B","触发强制平仓，订单 A 和订单 B 一起被平仓"],
      "A client in Mainland China has an account balance of $1,000 with no credit. The client holds two positions: Order A (loss of $500) and Order B (loss of $210). The total margin for both orders is $1,000. What will happen to the account at this moment?",
      ["Nothing happens","Only Order A is liquidated","Only Order B is liquidated","Liquidation is triggered, and both Order A and Order B are closed together"],
      3
  );
  addQuestion("Trading Calculations",
      "某 SEA 客户账户余额 $1,000，无信用额。持仓两笔订单：订单 A（亏损 $500），订单 B（亏损 $210）。两笔订单总保证金为 $1,000。请问此时该账户会发生什么？",
      ["触发强制平仓，订单 A 和订单 B 一起被平仓","触发强制平仓，从亏损最大的订单 A 开始平仓","触发强制平仓，从亏损最小的订单 B 开始平仓","未达到强平水平，不平仓"],
      "An SEA client has an account balance of $1,000 with no credit. The client holds two positions: Order A (loss of $500) and Order B (loss of $210). The total margin for both orders is $1,000. What will happen to the account at this moment?",
      ["Liquidation is triggered, and both Order A and Order B are closed together","Liquidation is triggered, starting with the largest losing position, Order A","Liquidation is triggered, starting with the smallest losing position, Order B","The liquidation level is not reached, no positions are closed"],
      1
  );
  addQuestion("Trading Calculations",
      "中国市场客户净值为 $150，已用预付款为 $500。请问该账户是否达到了强制平仓水平？",
      ["未达到","正好达到（预付款比例为 30%），触发全平","已经跌破，但只平亏损最大的单子","净值大于0，不触发强平"],
      "A client in the China market has an equity of $150 and a used margin of $500. Has this account reached the liquidation level?",
      ["Not reached","Exactly reached (margin level at 30%), triggering full liquidation","Already dropped below, but only the largest losing order will be closed","Equity is greater than 0, liquidation is not triggered"],
      1
  );
  addQuestion("Trading Calculations",
      "SEA 客户持有完全锁仓仓位（1 手 Buy 和 1 手 Sell），已用预付款为 $0。此时由于点差扩大或库存费扣除，账户净值变为了 $0。请问该账户会发生什么？",
      ["不会强平，因为预付款比例无法计算","触发强制平仓，因为 SEA 锁仓时净值低于或等于 0 触发强平","只有当净值变为负数才会强平","保持观望"],
      "An SEA client holds a fully hedged position (1 lot Buy and 1 lot Sell), and the used margin is $0. Due to spread widening or swap deductions, the account equity becomes $0. What will happen to this account?",
      ["No liquidation, because the margin level cannot be calculated","Liquidation is triggered, because for SEA hedged positions, liquidation occurs when equity is less than or equal to 0","Liquidation only occurs when equity becomes negative","Stay on hold"],
      1
  );
  addQuestion("Trading Calculations",
      "SEA 客户账户完全锁仓，当前余额为 $10，无信用额，净值为 $10。若持仓过夜被扣除 $15 库存费导致净值变为 -$5。请问该账户是否触发强平？",
      ["触发强制平仓","不触发，因为锁仓免疫强平","不触发，需等待预付款比例低于 30%","自动向系统申请信用额"],
      "An SEA client's account is fully hedged, with a current balance of $10, no credit, and equity of $10. If an overnight swap of $15 is deducted, causing the equity to become -$5, will liquidation be triggered?",
      ["Liquidation is triggered","Not triggered, because hedging immune to liquidation","Not triggered, needs to wait until margin level drops below 30%","Automatically apply for credit from the system"],
      0
  );
  addQuestion("Trading Calculations",
      "账户余额 $1,000，无信用额。以 1.1000 卖出 1 手 EURUSD，杠杆 100。当前价格涨至 1.1080。请问当前的预付款比例是多少？",
      ["18%","20%","11%","50%"],
      "The account balance is $1,000 with no credit. A client sells 1 lot of EURUSD at 1.1000 with a leverage of 100. The current price rises to 1.1080. What is the current margin level?",
      ["18%","20%","11%","50%"],
      1
  );
  addQuestion("Trading Calculations",
      "某中国市场客户账户余额 $1,000，无信用额。以 1.1000 卖出 1 手 EURUSD，杠杆 100。当前价格涨至 1.1080（该单变动亏损 $800）。请问此时账户会发生什么？",
      ["正常持仓","触发强制平仓，该订单被强制平仓","账户可用预付款变为正数","自动锁仓"],
      "A client in the China market has an account balance of $1,000 with no credit. The client sells 1 lot of EURUSD at 1.1000 with a leverage of 100. The current price rises to 1.1080 (the position has a floating loss of $800). What will happen to the account at this moment?",
      ["Normal holding","Liquidation is triggered, and the order is forcibly closed","The free margin becomes positive","Automatic hedging"],
      1
  );
  addQuestion("Trading Calculations",
      "账户余额 $500，无信用额。以 2,000.00 买入 0.1 手 XAUUSD，杠杆 400。当前价格跌至 1,960.00。请问当前账户净值是多少？",
      ["$500","$100","$460","$0"],
      "The account balance is $500 with no credit. A client buys 0.1 lots of XAUUSD at 2,000.00 with a leverage of 400. The current price drops to 1,960.00. What is the current account equity?",
      ["$500","$100","$460","$0"],
      1
  );
  addQuestion("Trading Calculations",
      "某账户余额 $500，无信用额。以 2,000.00 买入 0.1 手 XAUUSD，杠杆 400。当前价格跌至 1,960.00（该单变动亏损 $400）。请问此时该账户的预付款比例是多少？",
      ["20%","50%","200%","25%"],
      "An account balance is $500 with no credit. A client buys 0.1 lots of XAUUSD at 2,000.00 with a leverage of 400. The current price drops to 1,960.00 (the position has a floating loss of $400). What is the current margin level of the account?",
      ["20%","50%","200%","25%"],
      2
  );
  addQuestion("Trading Calculations",
      "账户余额 $300，无信用额。以 1.2000 买入 1 手 GBPUSD，杠杆 400。价格跌到 1.1975。请问当前的预付款比例是多少？",
      ["30%","20%","10%","25%"],
      "The account balance is $300 with no credit. A client buys 1 lot of GBPUSD at 1.2000 with a leverage of 400. The price drops to 1.1975. What is the current margin level?",
      ["30%","20%","10%","25%"],
      1
  );
  addQuestion("Trading Calculations",
      "某中国客户账户余额 $300，无信用额。以 1.2000 买入 1 手 GBPUSD，杠杆 400。当价格跌到 1.1975 时（该单变动亏损 $250），请问此时该持仓的状态是？",
      ["正常持有，因为未到 0","已被触发强制平仓（因预付款比例低于或等于 30%）","变成锁仓状态","享有免平仓特权"],
      "A China client has an account balance of $300 with no credit. The client buys 1 lot of GBPUSD at 1.2000 with a leverage of 400. When the price drops to 1.1975 (the position has a floating loss of $250), what is the status of this position?",
      ["Held normally because it hasn't reached 0","Liquidation has been triggered (due to margin level being <= 30%)","Becomes a hedged status","Enjoys liquidation exemption privilege"],
      1
  );
  addQuestion("Trading Calculations",
      "账户余额 $600，无信用额。在 SEA 市场以 80.00 买入 1 手 USOIL.MMMYY，杠杆 200。当前价格跌至 79.50。请问当前已用预付款和净值分别是多少？",
      ["已用预付款 $400，净值 $100","已用预付款 $400，净值 $200","已用预付款 $800，净值 $100","已用预付款 $200，净值 $100"],
      "The account balance is $600 with no credit. In the SEA market, a client buys 1 lot of USOIL.MMMYY at 80.00 with a leverage of 200. The current price drops to 79.50. What are the current used margin and equity, respectively?",
      ["Used margin $400, Equity $100","Used margin $400, Equity $200","Used margin $800, Equity $100","Used margin $200, Equity $100"],
      0
  );
  addQuestion("Trading Calculations",
      "某 SEA 账户余额 $600，无信用额。以 80.00 买入 1 手 USOIL.MMMYY，杠杆 200。当前价格跌至 79.50（该单变动亏损 $500）。请问该账户此时的预付款比例是多少？是否触发强平？",
      ["25%，触发强制平仓","50%，未触发强制平仓","25%，未触发强制平仓","30%，正好触发强平"],
      "An SEA account balance is $600 with no credit. A client buys 1 lot of USOIL.MMMYY at 80.00 with a leverage of 200. The current price drops to 79.50 (the position has a floating loss of $500). What is the account's margin level at this moment? Is liquidation triggered?",
      ["25%, liquidation is triggered","50%, liquidation is not triggered","25%, liquidation is not triggered","30%, exactly triggers liquidation"],
      0
  );
  addQuestion("Trading Calculations",
      "账户余额 $1,500，无信用额。中国客户开仓 1 手 EURUSD Buy 单（保证金 $1,000），此时变动亏损 $1,100。请问此时账户净值是多少？",
      ["$400","$1,500","$500","$1,100"],
      "The account balance is $1,500 with no credit. A China client opens 1 lot of EURUSD Buy (margin $1,000), and currently has a floating loss of $1,100. What is the account equity at this moment?",
      ["$400","$1,500","$500","$1,100"],
      0
  );
  addQuestion("Trading Calculations",
      "某中国客户账户余额 $1,500，无信用额。开仓 1 手 EURUSD Buy 单（保证金 $1,000），此时变动亏损 $1,100（账户净值为 $400）。请问该账户目前的预付款比例是多少？是否触发强平？",
      ["40%，未触发强平","40%，触发强平","30%，触发强平","25%，触发强平"],
      "A China client has an account balance of $1,500 with no credit. The client opens 1 lot of EURUSD Buy (margin $1,000), and currently has a floating loss of $1,100 (account equity is $400). What is the current margin level of this account? Is liquidation triggered?",
      ["40%, liquidation is not triggered","40%, liquidation is triggered","30%, liquidation is triggered","25%, liquidation is triggered"],
      0
  );
  addQuestion("Trading Calculations",
      "账户余额 $1,000，无信用额。在 SEA 市场建立 1 手 GBPUSD Buy 单和 1 手 GBPUSD Sell 单。如果点差扩大导致变动盈亏合计为 -$10。请问此时账户净值是多少？",
      ["$1,000","$990","$0","-$10"],
      "The account balance is $1,000 with no credit. In the SEA market, 1 lot of GBPUSD Buy and 1 lot of GBPUSD Sell are opened. If spread widening causes the total floating profit/loss to be -$10, what is the account equity at this moment?",
      ["$1,000","$990","$0","-$10"],
      1
  );
  addQuestion("Trading Calculations",
      "某 SEA 账户余额 $1,000，无信用额。建立 1 手 GBPUSD Buy 单和 1 手 GBPUSD Sell 单，锁仓后保证金为 $0。如果由于点差扩大导致锁仓变动盈亏合计为 -$10（账户净值为 $990）。请问此时该账户是否会触发强制平仓？",
      ["会，因为有亏损","不会，因为净值 $990 大于 0","会，因为锁仓不安全","不会，因为没有已用预付款"],
      "An SEA account balance is $1,000 with no credit. 1 lot of GBPUSD Buy and 1 lot of GBPUSD Sell are opened, and the margin after hedging is $0. If spread widening causes the total floating profit/loss to be -$10 (account equity is $990), will liquidation be triggered for this account at this moment?",
      ["Yes, because there is a loss","No, because the equity of $990 is greater than 0","Yes, because hedging is unsafe","No, because there is no used margin"],
      1
  );
  addQuestion("Trading Calculations",
      "账户余额 $2,000，无信用额。中国客户建立 2 手 EURUSD Buy单和 2 手 EURUSD Sell单。如果因点差扩大导致浮亏 $1,410。请问此时预付款比例是多少？",
      ["30%","29.5%","70%","15%"],
      "The account balance is $2,000 with no credit. A China client opens 2 lots of EURUSD Buy and 2 lots of EURUSD Sell. If spread widening causes a floating loss of $1,410, what is the margin level at this moment?",
      ["30%","29.5%","70%","15%"],
      1
  );
  addQuestion("Trading Calculations",
      "某中国客户账户余额 $2,000，无信用额。建立 2 手 EURUSD Buy单和 2 手 EURUSD Sell单（收单边保证金共 $2,000）。如果因点差扩大导致锁仓浮亏 $1,410，触发了强制平仓。请问此时该账户会发生什么？",
      ["只有 Buy 单被全平","只有亏损最大的单子被平仓","全部订单一起被强制平仓","账户无变化"],
      "A China client has an account balance of $2,000 with no credit. The client opens 2 lots of EURUSD Buy and 2 lots of EURUSD Sell (total used margin is $2,000 under the single-side rule). If spread widening causes a floating loss of $1,410, triggering liquidation, what will happen to the account?",
      ["Only Buy orders are fully liquidated","Only the order with the largest loss is closed","All orders are forcibly closed together","No change to the account"],
      2
  );
  addQuestion("Trading Calculations",
      "账户余额 $10,000，无信用额。当前持仓有一笔 Buy 单（保证金 $2,000）亏损 $3,000，一笔 Sell 单（保证金 $2,000）亏损 $5,200。两笔单共需保证金 $4,000。请问该账户当前的预付款比例是多少？是否触发强制平仓？",
      ["45%，未触发强制平仓","30%，未触发强制平仓","45%，从亏损最大的订单开始强制平仓","30%，正好触发强制平仓"],
      "The account balance is $10,000 with no credit. The current open positions include a Buy order (margin $2,000) with a loss of $3,000 and a Sell order (margin $2,000) with a loss of $5,200. The total required margin for both orders is $4,000. What is the current margin level of this account? Is liquidation triggered?",
      ["45%, liquidation is not triggered","30%, liquidation is not triggered","45%, liquidation starts from the order with the largest loss","30%, exactly triggers liquidation"],
      0
  );

  // ========== Trading Software 交易软件（50题）==========
  addQuestion("Trading Software",
      "MetaTrader 4（MT4）是由哪家公司开发的？",
      ["MetaQuotes Software","Microsoft","Oracle","Adobe"],
      "Which company developed MetaTrader 4 (MT4)?",
      ["MetaQuotes Software","Microsoft","Oracle","Adobe"],
      0
  );
  addQuestion("Trading Software",
      "在MT4中，如何快速切换图表的时间周期？",
      ["只能通过“图表”菜单选择","右键图表选择“时间周期”","使用工具栏上的时间周期按钮或右键菜单均可","在终端窗口中切换"],
      "In MT4, how can you quickly switch the chart's timeframe?",
      ["Only through the 'Charts' menu","Right-click the chart and select 'Timeframe'","Use the timeframe buttons on the toolbar or the right-click menu","Switch in the Terminal window"],
      2
  );
  addQuestion("Trading Software",
      "在MT4中，如何调出十字光标（十字准线）以精确查看价格和时间？",
      ["按下鼠标中键","单击工具栏的十字准线按钮或按Ctrl+F","双击图表空白处","在终端窗口中选择"],
      "In MT4, how can you bring up the crosshair cursor to precisely view price and time?",
      ["Press the middle mouse button","Click the crosshair button on the toolbar or press Ctrl+F","Double-click on a blank area of the chart","Select in the Terminal window"],
      1
  );
  addQuestion("Trading Software",
      "MT5平台内置的技术指标数量是多少？",
      ["30个","38个","44个","50个"],
      "How many built-in technical indicators does MT5 have?",
      ["30","38","44","50"],
      1
  );
  addQuestion("Trading Software",
      "MT5平台支持的图形分析对象数量是多少？",
      ["24个","33个","38个","44个"],
      "How many graphical analytical objects does MT5 support?",
      ["24","33","38","44"],
      3
  );
  addQuestion("Trading Software",
      "MT4平台提供几种时间周期？",
      ["7种","9种","12种","15种"],
      "How many timeframes does MT4 provide?",
      ["7","9","12","15"],
      1
  );
  addQuestion("Trading Software",
      "MT5平台相对于MT4，新增了哪些中间时间周期？",
      ["5分钟和15分钟","2分钟、3分钟、4小时、12小时等","1小时和8小时","仅月线"],
      "Which intermediate timeframes did MT5 add compared to MT4?",
      ["5-minute and 15-minute","2-minute, 3-minute, 4-hour, 12-hour, etc.","1-hour and 8-hour","Monthly only"],
      1
  );
  addQuestion("Trading Software",
      "MT5最多支持同时打开多少个图表窗口？",
      ["50个","75个","100个","无限制"],
      "How many chart windows can MT5 open simultaneously at most?",
      ["50","75","100","Unlimited"],
      2
  );
  addQuestion("Trading Software",
      "MT5提供几种图表显示类型（如蜡烛图、美国线、折线图等）？",
      ["4种","6种","8种","10种"],
      "How many chart display types does MT5 offer (e.g., candlestick, bar, line, etc.)?",
      ["4","6","8","10"],
      2
  );
  addQuestion("Trading Software",
      "MT5中的图表模板（Template）功能主要用于什么？",
      ["修改平台的界面语言","保存一组图表设置（指标、颜色、时间框架等）以便快速应用到其他图表","导出交易数据至Excel","调整账户杠杆"],
      "What is the primary purpose of the chart template function in MT5?",
      ["Change the platform's interface language","Save a set of chart settings (indicators, colors, timeframes, etc.) for quick application to other charts","Export trading data to Excel","Adjust account leverage"],
      1
  );
  addQuestion("Trading Software",
      "MT4支持几种挂单类型？",
      ["2种","4种","6种","8种"],
      "How many pending order types does MT4 support?",
      ["2","4","6","8"],
      1
  );
  addQuestion("Trading Software",
      "MT5相比MT4，新增了哪两种复合订单类型？",
      ["Market Buy和Market Sell","Buy Limit和Sell Limit","Buy Stop Limit和Sell Stop Limit","Buy Stop和Sell Stop"],
      "Which two composite order types did MT5 add compared to MT4?",
      ["Market Buy and Market Sell","Buy Limit and Sell Limit","Buy Stop Limit and Sell Stop Limit","Buy Stop and Sell Stop"],
      2
  );
  addQuestion("Trading Software",
      "在MT4中，如何修改一个已有的挂单价格？",
      ["只能删除后重新挂单","在终端窗口的“交易”选项卡中双击该挂单，修改价格后确认","右键点击挂单，选择“修改或删除订单”，修改价格后确认","B和C均正确"],
      "In MT4, how can you modify the price of an existing pending order?",
      ["Delete it and place a new one","Double-click the order in the 'Trade' tab of the Terminal window and modify the price","Right-click the order, select 'Modify or Delete Order', and modify the price","Both B and C are correct"],
      3
  );
  addQuestion("Trading Software",
      "在MT5中，F9快捷键的作用是什么？",
      ["打开图表","打开新订单窗口","切换时间框架","删除所有指标"],
      "What is the function of the F9 shortcut key in MT5?",
      ["Open a chart","Open the new order window","Switch timeframes","Delete all indicators"],
      1
  );
  addQuestion("Trading Software",
      "MT5支持的对冲（Hedging）和单边（Netting）持仓系统，以下说法正确的是？",
      ["MT5仅支持对冲系统","MT5仅支持单边系统","MT5同一平台内可选择对冲或单边系统，取决于经纪商设置","MT5不支持任何持仓管理系统"],
      "Which statement is correct regarding the hedging and netting position systems supported by MT5?",
      ["MT5 only supports the hedging system","MT5 only supports the netting system","MT5 can support either hedging or netting within the same platform, depending on broker settings","MT5 does not support any position management system"],
      2
  );
  addQuestion("Trading Software",
      "在MT5中，想要一次性平掉所有持仓，以下哪个操作是正确的？",
      ["逐一选择持仓手动平仓","在终端窗口的订单上右键选择“所有持仓平仓”","必须使用EA程序平仓","关闭图表即可自动平仓"],
      "In MT5, which operation correctly closes all open positions at once?",
      ["Select each position and close it manually","Right-click on orders in the Terminal window and select 'Close All Positions'","Must use an EA to close","Close the chart and they will be closed automatically"],
      1
  );
  addQuestion("Trading Software",
      "MT5的内置技术指标被分为哪几类？",
      ["趋势指标、震荡指标、成交量指标、比尔·威廉姆斯指标","基础指标、高级指标、自定义指标","短期指标、中期指标、长期指标","价格指标、时间指标、量价指标"],
      "What categories are MT5's built-in technical indicators divided into?",
      ["Trend indicators, Oscillators, Volume indicators, Bill Williams indicators","Basic indicators, Advanced indicators, Custom indicators","Short-term indicators, Medium-term indicators, Long-term indicators","Price indicators, Time indicators, Volume-price indicators"],
      0
  );
  addQuestion("Trading Software",
      "MT4中，如何将自定义技术指标添加到图表？",
      ["只能使用内置指标","将.ex4或.mq4文件放入MQL4/Indicators文件夹，重启平台后从导航器拖入图表","通过“插入”菜单直接加载外部文件","在市场中购买"],
      "In MT4, how do you add a custom technical indicator to a chart?",
      ["Only built-in indicators can be used","Place the .ex4 or .mq4 file into the MQL4/Indicators folder, restart the platform, and drag it from the Navigator onto the chart","Directly load external files through the 'Insert' menu","Purchase from the Market"],
      1
  );
  addQuestion("Trading Software",
      "在MT5中，可以将多个技术指标同时应用在同一图表上吗？",
      ["不可以，每个图表只能添加一个指标","可以，一个指标可以叠加在另一个指标之上共存","只能使用内置指标，不能叠加自定义指标","仅限付费账户使用此功能"],
      "In MT5, can multiple technical indicators be applied to the same chart simultaneously?",
      ["No, only one indicator per chart","Yes, one indicator can be overlaid on top of another","Only built-in indicators can be used, custom indicators cannot be overlaid","This feature is only available for paid accounts"],
      1
  );
  addQuestion("Trading Software",
      "MT5中的警报（Alert）系统支持哪些提醒方式？",
      ["仅平台内弹窗","仅声音提醒","仅邮件提醒","平台弹窗、声音、邮件及移动端推送通知等多种方式"],
      "What notification methods does the Alert system in MT5 support?",
      ["Only in-platform pop-ups","Only sound alerts","Only email alerts","Multiple methods including platform pop-ups, sound, email, and mobile push notifications"],
      3
  );
  addQuestion("Trading Software",
      "在MT5中，如何在图表上绘制趋势线？",
      ["只能通过编程方式绘制","从工具栏选择趋势线工具后在图表上点击并拖动","右键点击图表选择'自动趋势线'","输入坐标数值自动生成"],
      "In MT5, how do you draw a trend line on a chart?",
      ["Only through programming","Select the trend line tool from the toolbar, then click and drag on the chart","Right-click on the chart and select 'Auto Trendline'","Enter coordinate values to generate automatically"],
      1
  );
  addQuestion("Trading Software",
      "MT5使用的编程语言是什么？",
      ["Python","Java","MQL5","C#"],
      "What programming language does MT5 use?",
      ["Python","Java","MQL5","C#"],
      2
  );
  addQuestion("Trading Software",
      "MT4使用的编程语言是什么？",
      ["MQL5","MQL4","Python","C++"],
      "What programming language does MT4 use?",
      ["MQL5","MQL4","Python","C++"],
      1
  );
  addQuestion("Trading Software",
      "MT4上编写的EA能否直接在MT5上运行？",
      ["可以直接运行，完全兼容","不能直接运行，因为MQL4与MQL5不兼容，需要重写或转换代码","仅限付费版本可以运行","只需修改文件扩展名即可"],
      "Can an EA written for MT4 run directly on MT5?",
      ["Yes, it is fully compatible","No, because MQL4 and MQL5 are incompatible; the code needs to be rewritten or converted","Only paid versions can run it","Just change the file extension"],
      1
  );
  addQuestion("Trading Software",
      "MT5相比MT4在策略回测上的主要优势是？",
      ["只支持单品种回测","支持多线程并行回测和多品种同时回测，可使用真实tick数据","回测数据质量较差","回测速度更慢"],
      "What is MT5's main advantage over MT4 in strategy backtesting?",
      ["Only supports single-instrument backtesting","Supports multi-threaded parallel backtesting and multi-instrument simultaneous backtesting, using real tick data","Backtesting data quality is poorer","Backtesting speed is slower"],
      1
  );
  addQuestion("Trading Software",
      "MT4的图表模板文件后缀名是什么？",
      [".ex4",".mq4",".tpl",".set"],
      "What is the file extension for MT4 chart templates?",
      [".ex4",".mq4",".tpl",".set"],
      2
  );
  addQuestion("Trading Software",
      "MT4中，在“工具-选项-电邮”中正确设置SMTP服务器后，可以如何接收提醒？",
      ["系统自动发送所有交易记录","当触发警报或EA条件满足时可发送电子邮件通知","将盈亏直接发送到邮箱","只能接收来自经纪商的邮件"],
      "In MT4, after correctly configuring the SMTP server in 'Tools - Options - Email', how can you receive notifications?",
      ["The system automatically sends all trade records","Email notifications can be sent when alerts or EA conditions are met","Profit/loss is directly emailed","Only emails from the broker can be received"],
      1
  );
  addQuestion("Trading Software",
      "MT4中，将当前图表保存为图片的快捷键是什么？",
      ["Ctrl+S","Ctrl+I","Ctrl+P","F12"],
      "What is the shortcut key to save the current chart as an image in MT4?",
      ["Ctrl+S","Ctrl+I","Ctrl+P","F12"],
      1
  );
  addQuestion("Trading Software",
      "在MT4中，如何快速查看交易品种的当前点差？",
      ["仅在图表上测量","市场报价窗口直接显示买价和卖价，点差一目了然","需要安装第三方插件","在终端窗口的“交易”选项卡中查看"],
      "In MT4, how can you quickly view the current spread of a trading instrument?",
      ["Only by measuring on the chart","The Market Watch window directly displays the bid and ask prices, showing the spread at a glance","A third-party plugin is required","View in the 'Trade' tab of the Terminal window"],
      1
  );
  addQuestion("Trading Software",
      "在MT4中，如何快速切换不同的交易账户？",
      ["只能关闭平台重新登录","通过“文件-登录到交易账户”并输入账号密码","导航器窗口右键点击账户选择“登录”","B和C均正确"],
      "In MT4, how can you quickly switch between different trading accounts?",
      ["Only by closing the platform and re-opening","Use 'File - Login to Trade Account' and enter credentials","Right-click the account in the Navigator window and select 'Login'","Both B and C are correct"],
      3
  );
  addQuestion("Trading Software",
      "在MT4中，为已有持仓设置或修改止损、止盈，以下哪些方法可行？",
      ["右键持仓选择“修改或删除订单”","在终端窗口双击持仓直接修改止损/止盈栏位","拖动图表上的止损止盈线","以上方法均可"],
      "In MT4, which methods can be used to set or modify stop-loss and take-profit for an existing position?",
      ["Right-click the position and select 'Modify or Delete Order'","Double-click the position in the Terminal window and modify the S/L and T/P fields","Drag the stop-loss or take-profit line on the chart","All of the above"],
      3
  );
  addQuestion("Trading Software",
      "MT4的“数据窗口”可以显示什么信息？",
      ["仅当前账户余额","鼠标所指K线的精确价格、指标数值等详细数据","交易历史","服务器时间"],
      "What information does the 'Data Window' in MT4 display?",
      ["Only the current account balance","Detailed data such as the exact price of the bar under the cursor and indicator values","Trade history","Server time"],
      1
  );
  addQuestion("Trading Software",
      "交易者在MT4中为持仓启用了25点的追踪止损，然后关闭了电脑。在此期间市场价格朝有利方向移动了50点。当交易者重新打开MT4时，追踪止损会如何表现？",
      ["止损自动向前跟进50点","止损不会补移，而是从当前市价开始重新计算追踪","持仓已被自动平仓","止损移至开仓价"],
      "A trader enabled a 25-point trailing stop on a position in MT4 and then shut down the computer. During this time, the market moved 50 points in a favorable direction. What happens to the trailing stop when MT4 is re-opened?",
      ["The stop-loss automatically moves forward by 50 points","The stop-loss does not retroactively trail; it resumes from the current market price","The position was automatically closed","The stop-loss moves to the opening price"],
      1
  );
  addQuestion("Trading Software",
      "MT4的“终端”窗口不包含以下哪个选项卡？",
      ["交易","账户历史","新闻","图表"],
      "Which of the following tabs is NOT found in the 'Terminal' window of MT4?",
      ["Trade","Account History","News","Charts"],
      3
  );
  addQuestion("Trading Software",
      "在MT4中启用“一键交易”功能后，图表上会出现什么？",
      ["额外的图表类型","快捷买卖按钮，点击可直接按市价下单","自动交易策略","市场深度"],
      "After enabling the 'One Click Trading' function in MT4, what appears on the chart?",
      ["Additional chart types","Quick buy and sell buttons for direct market order placement","Automated trading strategies","Depth of Market"],
      1
  );
  addQuestion("Trading Software",
      "MT5内置的经济日历功能可以显示什么内容？",
      ["仅节假日安排","全球重要财经事件、数据发布时间及历史影响评级","仅天气预报","仅公司财报日期"],
      "What content does the built-in Economic Calendar in MT5 display?",
      ["Only holiday schedules","Global important financial events, data release times, and historical impact ratings","Only weather forecasts","Only corporate earnings dates"],
      1
  );
  addQuestion("Trading Software",
      "MT4平台是否内置了经济日历功能？",
      ["有，和MT5一样完善","没有内置经济日历，需要依赖第三方插件或外部网站","仅限付费版本有","只有移动版有"],
      "Does the MT4 platform have a built-in Economic Calendar feature?",
      ["Yes, as comprehensive as MT5","No built-in Economic Calendar; third-party plugins or external websites are needed","Only available in paid versions","Only available in the mobile version"],
      1
  );
  addQuestion("Trading Software",
      "MT5平台的“市场报价”窗口显示什么内容？",
      ["交易者个人信息","金融品种的实时报价、点差、价格统计和分时图表","系统日志","账户历史报表"],
      "What content does the 'Market Watch' window display in MT5?",
      ["Trader's personal information","Real-time quotes, spreads, price statistics, and tick charts of financial instruments","System logs","Account history reports"],
      1
  );
  addQuestion("Trading Software",
      "在MT4中，如何查看当前账户是模拟账户还是真实账户？",
      ["在终端窗口的底部状态栏查看","通过“帮助-关于”查看","每次登录时弹窗提示","需要联系经纪商确认"],
      "In MT4, how can you tell whether the current account is a demo or real account?",
      ["Check the bottom status bar of the Terminal window","Check 'Help - About'","A pop-up appears at each login","Contact the broker to confirm"],
      0
  );
  addQuestion("Trading Software",
      "在MT5中，“导航器”窗口的主要功能是什么？",
      ["浏览网页","快速访问账户信息、技术指标、EA交易和脚本","管理文件","编辑代码"],
      "What is the main function of the 'Navigator' window in MT5?",
      ["Browse the web","Quick access to account information, technical indicators, Expert Advisors, and scripts","Manage files","Edit code"],
      1
  );
  addQuestion("Trading Software",
      "MT4最初主要设计用于哪类市场？",
      ["多资产全品类交易","主要面向外汇市场交易","仅限股票市场","仅限期货市场"],
      "For which type of market was MT4 originally designed?",
      ["Multi-asset trading across all categories","Primarily forex market trading","Stock market only","Futures market only"],
      1
  );
  addQuestion("Trading Software",
      "MT5从底层架构上被设计为什么类型的交易平台？",
      ["单一外汇交易平台","多资产全品类金融交易平台","仅限加密货币交易平台","仅限大宗商品交易平台"],
      "What type of trading platform was MT5 designed as from its underlying architecture?",
      ["A single forex trading platform","A multi-asset, all-category financial trading platform","A cryptocurrency-only trading platform","A commodity-only trading platform"],
      1
  );
  addQuestion("Trading Software",
      "MT5支持的资产类别包括以下哪些？",
      ["仅外汇","外汇、股票、指数、贵金属、大宗商品、加密货币CFD等","仅股票指数","仅贵金属"],
      "What asset classes does MT5 support?",
      ["Only forex","Forex, stocks, indices, precious metals, commodities, cryptocurrency CFDs, etc.","Only stock indices","Only precious metals"],
      1
  );
  addQuestion("Trading Software",
      "在MT4中，如何导出完整的交易历史记录？",
      ["只能截图","在“账户历史”选项卡右键，选择“保存为详细报告”","文件菜单直接导出Excel","历史记录无法导出"],
      "In MT4, how can you export the complete trading history?",
      ["Only screenshots","Right-click in the 'Account History' tab and select 'Save as Detailed Report'","Export to Excel directly from the File menu","History cannot be exported"],
      1
  );
  addQuestion("Trading Software",
      "MT5是否支持移动端交易？",
      ["仅支持PC端","支持iOS和Android移动端","仅支持网页版","仅支持Linux系统"],
      "Does MT5 support mobile trading?",
      ["Only supports PC","Supports iOS and Android mobile devices","Only supports web version","Only supports Linux systems"],
      1
  );
  addQuestion("Trading Software",
      "与MT4一样，MT5桌面版的追踪止损功能在关闭平台后会怎样？",
      ["继续在服务器端自动追踪","停止追踪，重新打开平台后从当前价格开始重新计算","转为固定止损","自动平仓"],
      "Like MT4, what happens to the MT5 desktop version's trailing stop function after the platform is closed?",
      ["It continues trailing automatically on the server side","It stops trailing, and recalculates from the current market price once the platform is re-opened","It converts to a fixed stop-loss","The position is automatically closed"],
      1
  );
  addQuestion("Trading Software",
      "在MT4中，想要修改蜡烛图的阳线、阴线颜色和背景网格颜色，应进入哪个设置？",
      ["工具-选项-图表","右键图表-属性-颜色","无法修改","通过模板设置"],
      "In MT4, where should you go to change the colors of bullish/bearish candles and the background grid?",
      ["Tools - Options - Charts","Right-click the chart - Properties - Colors","Cannot be modified","Through template settings"],
      1
  );
  addQuestion("Trading Software",
      "交易者持有1手EUR/USD多头，开仓价1.1000，初始止损1.0980（20点）。他启用了15点的追踪止损，当前市价涨至1.1030。此时止损价应该在什么位置？",
      ["1.0980","1.1015","1.1010","1.1000"],
      "A trader holds 1 lot EUR/USD long, opened at 1.1000, with an initial stop loss at 1.0980 (20 pips). He activates a 15-point trailing stop, and the market rises to 1.1030. Where should the stop-loss price be now?",
      ["1.0980","1.1015","1.1010","1.1000"],
      1
  );
  addQuestion("Trading Software",
      "在MT4中，除了使用工具栏按钮，还可以如何快速缩放图表？",
      ["按住Ctrl键并滚动鼠标滚轮","按F1键","双击图表空白处","右键选择缩放"],
      "In MT4, besides using the toolbar buttons, how else can you quickly zoom the chart?",
      ["Hold Ctrl and scroll the mouse wheel","Press F1","Double-click a blank area","Right-click and select zoom"],
      0
  );
  addQuestion("Trading Software",
      "在MT4手机App中，如何查看已平仓的交易历史记录？",
      ["在“行情”页面下滑刷新","进入“历史”选项卡，可查看所有已平仓订单及盈亏明细","长按任意K线","在“设置”中找到“交易报告”"],
      "In the MT4 mobile app, how can you view the history of closed trades?",
      ["Swipe down on the 'Quotes' page","Go to the 'History' tab to view all closed orders and profit/loss details","Long press any candlestick","Find 'Trade Report' in 'Settings'"],
      1
  );
  addPlaceholderCategory("Simulation", "情景模拟");
  addPlaceholderCategory("Account Opening Process", "开户流程");
  addPlaceholderCategory("Deposit and Withdrawal Process", "出入金流程");
  addPlaceholderCategory("Daily Workflow", "日常工作流程");
  addPlaceholderCategory("Commission Settings", "佣金设置");  
  // ========== 您可以直接在上方循环内或下方添加真实题目，格式参考 addQuestion ==========

  // --------------------------------------------------------------

  return quizBank;
}
