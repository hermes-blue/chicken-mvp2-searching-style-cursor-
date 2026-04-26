import { useState, useEffect } from 'react'

// ── 브랜드 비용 데이터 ────────────────────────────────────────
const BRAND_TOTAL = {
  '교촌치킨':   '약 2억~2.5억',
  '비비큐(BBQ)': '약 2억~2.5억',
  'BHC치킨':    '약 1억 5천',
  '푸라닭치킨':  '약 1억 내외',
}

const BRAND_COSTS = {
  '교촌치킨': [
    { label: '인테리어',   amt: '7,000만', pct: 78 },
    { label: '장비·설비',  amt: '5,000만', pct: 56 },
    { label: '숨겨진 비용', amt: '5,500만', pct: 61 },
    { label: '가맹비',    amt: '676.5만', pct: 8 },
  ],
  '비비큐(BBQ)': [
    { label: '인테리어',   amt: '9,000만', pct: 100 },
    { label: '숨겨진 비용', amt: '5,500만', pct: 61 },
    { label: '장비·설비',  amt: '4,500만', pct: 50 },
    { label: '가맹비',    amt: '1,100만', pct: 12 },
  ],
  'BHC치킨': [
    { label: '인테리어',   amt: '4,620만', pct: 51 },
    { label: '숨겨진 비용', amt: '3,000만+', pct: 33 },
    { label: '장비·설비',  amt: '4,800만', pct: 53 },
    { label: '가맹비',    amt: '1,100만', pct: 12 },
  ],
  '푸라닭치킨': [
    { label: '인테리어',   amt: '5,000만', pct: 56 },
    { label: '숨겨진 비용', amt: '3,000만', pct: 33 },
    { label: '장비·설비',  amt: '3,500만', pct: 39 },
    { label: '가맹비',    amt: '1,100만', pct: 12 },
  ],
}

// 비용 항목 4개 브랜드 비교 데이터
const COST_COMPARE = {
  '가맹비': [
    { name: '교촌', val: 676.5, label: '676.5만' },
    { name: 'BBQ',  val: 1100, label: '1,100만' },
    { name: 'BHC',  val: 1100, label: '1,100만' },
    { name: '푸라닭', val: 1100, label: '1,100만' },
  ],
  '인테리어': [
    { name: '교촌', val: 7000, label: '7,000만' },
    { name: 'BBQ',  val: 9000, label: '9,000만' },
    { name: 'BHC',  val: 4620, label: '4,620만' },
    { name: '푸라닭', val: 5000, label: '5,000만' },
  ],
  '장비/설비': [
    { name: '교촌', val: 5000, label: '5,000만' },
    { name: 'BBQ',  val: 4500, label: '4,500만' },
    { name: 'BHC',  val: 4800, label: '4,800만' },
    { name: '푸라닭', val: 3500, label: '3,500만' },
  ],
  '숨겨진 비용': [
    { name: '교촌', val: 5500, label: '5,500만' },
    { name: 'BBQ',  val: 5500, label: '5,500만' },
    { name: 'BHC',  val: 5500, label: '5,500만' },
    { name: '푸라닭', val: 3000, label: '3,000만' },
  ],
}

// ── 차트 타입 감지 ────────────────────────────────────────────
function detectChartType(title) {
  if (['교촌치킨', '비비큐(BBQ)', 'BHC치킨', '푸라닭치킨'].includes(title))
    return 'brand'
  if (['왜 망하나?', '어디서 망하나?', '입지 미스매치', '자금 소진', '본사 갈등', '체력 고비', '가격 저항', '집객 부족'].includes(title))
    return 'failure'
  if (['얼마 남나?', '재료비', '인건비', '임대료', '실제 순이익', '로열티'].includes(title))
    return 'profit'
  if (['가맹비', '인테리어', '장비/설비', '숨겨진 비용'].includes(title))
    return 'cost'
  return 'overview'
}

// ── 유틸 ─────────────────────────────────────────────────────
function useBarAnim(delay = 120) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setReady(true), delay)
    return () => clearTimeout(t)
  }, [delay])
  return ready
}

function extractPct(str = '') {
  const m = str.match(/(\d+)%/)
  return m ? parseInt(m[1]) : 0
}

function extractAmt(str = '') {
  const m = str.replace(/,/g, '').match(/(\d+)만/)
  return m ? parseInt(m[1]) : 0
}

function extractManwon(str = '') {
  const cleaned = String(str).replace(/,/g, '')
  const m = cleaned.match(/(\d+(?:\.\d+)?)만/)
  return m ? Number(m[1]) : 0
}

function extractRevenue(label = '') {
  const m = label.replace(/,/g, '').match(/매출\s*(\d+)만/)
  return m ? parseInt(m[1]) : 1300
}

function formatManwon(value = 0) {
  const rounded = Math.round(value)
  if (rounded >= 10000) {
    const eok = Math.floor(rounded / 10000)
    const rest = rounded % 10000
    if (rest === 0) return `${eok}억`
    if (rest % 1000 === 0) return `${eok}억 ${rest / 1000}천만`
    return `${eok}억 ${rest.toLocaleString()}만`
  }
  return `${rounded.toLocaleString()}만`
}

function useCountUp(target, delay = 0) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!Number.isFinite(target) || target <= 0) {
      setValue(target || 0)
      return
    }
    let raf = 0
    const timeout = setTimeout(() => {
      const start = performance.now()
      const duration = 650
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setValue(target * eased)
        if (progress < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, delay)
    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(raf)
    }
  }, [target, delay])
  return value
}

// ── insight 점 2개 렌더링 ─────────────────────────────────────
const INSIGHT_DOT = { teal: '#3DBFB8', gold: '#C9A365' }

function InsightList({ insights, text }) {
  if (Array.isArray(insights) && insights.length) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {insights.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: INSIGHT_DOT[item.dot] ?? '#9B7FE8', flexShrink: 0, marginTop: 4 }} />
            <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, wordBreak: 'keep-all' }}>{item.text}</span>
              {item.source && (
                <span style={{ flexShrink: 0, fontSize: 9, fontFamily: 'var(--font-mono)', color: 'rgba(255,180,80,0.8)', border: '1px solid rgba(255,180,80,0.35)', borderRadius: 4, padding: '2px 6px', letterSpacing: '0.04em', whiteSpace: 'nowrap', marginTop: 2 }}>
                  📰 {item.source}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }
  return <p style={{ fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, margin: 0, wordBreak: 'keep-all' }}>{text}</p>
}

// ── 바 공통 ───────────────────────────────────────────────────
function Bar({ pct, color, delay = 0, ready, height = 5 }) {
  return (
    <div style={{ height, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' }}>
      <div style={{
        height: '100%', borderRadius: 3,
        background: `linear-gradient(90deg, ${color}, ${color}99)`,
        width: ready ? `${pct}%` : '0%',
        transition: `width 0.75s cubic-bezier(0.4,0,0.2,1) ${delay}s`,
      }} />
    </div>
  )
}

// ── 차트 1: 브랜드 초기비용 바 ────────────────────────────────
function BrandCostChart({ title, color }) {
  const ready = useBarAnim()
  const costs = BRAND_COSTS[title] ?? []
  return (
    <div>
      <ChartLabel>초기비용 구성</ChartLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
        {costs.map((item, i) => (
          <div key={item.label}>
            <BarRow left={item.label} right={item.amt} />
            <Bar pct={item.pct} color={color} delay={i * 0.08} ready={ready} />
          </div>
        ))}
      </div>
      <TotalRow label="총 예상 초기비용" val={BRAND_TOTAL[title]} color={color} />
    </div>
  )
}

// ── 차트 2: 폐업 기여율 바 ────────────────────────────────────
function FailureChart({ data, color }) {
  const ready = useBarAnim()
  const pct = extractPct(data.val) || extractPct(data.row1Val)
  return (
    <div>
      <ChartLabel>폐업 기여율</ChartLabel>
      <BigStat val={pct} unit="%" color={color} />
      <Bar pct={pct} color={color} ready={ready} height={6} />
    </div>
  )
}

// ── 차트 3: 수익/비용 비중 ────────────────────────────────────
function ProfitChart({ data, color }) {
  const ready = useBarAnim()
  const isProfit = !data.val?.includes('-')
  const amt = extractAmt(data.val) || extractAmt(data.row1Val)
  const revenue = extractRevenue(data.row1Label)
  const pct = revenue > 0 ? Math.min(Math.round((amt / revenue) * 100), 100) : 0
  const barColor = isProfit ? '#3DBFB8' : color
  return (
    <div>
      <ChartLabel>{isProfit ? '순이익 비중' : '비용 비중'}</ChartLabel>
      <BigStat val={pct} unit="%" color={barColor} sub="of 월매출" />
      <Bar pct={pct} color={barColor} ready={ready} height={6} />
      <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 300, marginTop: 6, wordBreak: 'keep-all' }}>
        {data.row1Label}
      </div>
    </div>
  )
}

// ── 차트 4: 비용 항목 4개 브랜드 비교 ────────────────────────
function CostCompareChart({ title, color }) {
  const ready = useBarAnim()
  const items = COST_COMPARE[title]
  if (!items) return null
  const max = Math.max(...items.map(i => i.val))
  return (
    <div>
      <ChartLabel>4개 브랜드 비교</ChartLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
        {items.map((item, i) => (
          <div key={item.name}>
            <BarRow left={item.name} right={item.label} />
            <Bar pct={Math.round((item.val / max) * 100)} color={color} delay={i * 0.07} ready={ready} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── 차트 5: 허브 섹션 종합 평가 (해볼 만할까?) ───────────────
const HUB_OVERVIEW_DATA = {
  '교촌치킨': [
    { label: '브랜드 파워',   pct: 95 },
    { label: '수익성',       pct: 62 },
    { label: '진입 용이성',  pct: 45 },
    { label: '운영 안정성',  pct: 68 },
  ],
  'BHC치킨': [
    { label: '브랜드 파워',   pct: 80 },
    { label: '수익성',       pct: 60 },
    { label: '진입 용이성',  pct: 78 },
    { label: '운영 안정성',  pct: 65 },
  ],
  '비비큐(BBQ)': [
    { label: '브랜드 파워',   pct: 88 },
    { label: '수익성',       pct: 64 },
    { label: '진입 용이성',  pct: 50 },
    { label: '운영 안정성',  pct: 60 },
  ],
  '푸라닭치킨': [
    { label: '브랜드 파워',   pct: 42 },
    { label: '수익성',       pct: 55 },
    { label: '진입 용이성',  pct: 88 },
    { label: '운영 안정성',  pct: 72 },
  ],
}

function HubOverviewChart({ data, color }) {
  const items = HUB_OVERVIEW_DATA[data.brandKey] ?? []
  if (!items.length) return null
  return (
    <div>
      <ChartLabel>비교용 감각 지표</ChartLabel>
      <ChartNote>공식 점수보다 방향만 봐주세요</ChartNote>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {items.map((item, i) => (
          <LevelTile key={item.label} label={item.label} level={qualLevel(item.pct)} color={color} delay={i * 0.04} />
        ))}
      </div>
    </div>
  )
}

// ── 차트 6: 허브 섹션 초기비용 미니 요약 (얼마 드나?) ────────
function buildSyncedCosts(costs, totalManwon) {
  if (!Number.isFinite(totalManwon) || totalManwon <= 0) return null
  const baseTotal = costs.reduce((sum, item) => sum + extractManwon(item.amt), 0)
  if (baseTotal <= 0) return null
  let runningTotal = 0
  const synced = costs.map((item, index) => {
    const isLast = index === costs.length - 1
    const value = isLast
      ? Math.max(totalManwon - runningTotal, 0)
      : Math.round(extractManwon(item.amt) / baseTotal * totalManwon)
    runningTotal += value
    return { ...item, amtValue: value, amt: formatManwon(value) }
  })
  const max = Math.max(...synced.map(item => item.amtValue), 1)
  return synced.map(item => ({ ...item, pct: Math.round((item.amtValue / max) * 100) }))
}

function AnimatedAmount({ value, fallback, delay = 0 }) {
  const counted = useCountUp(value, delay)
  return <>{Number.isFinite(value) && value > 0 ? formatManwon(counted) : fallback}</>
}

function CostChartLoading({ brandKey }) {
  const items = BRAND_COSTS[brandKey] ?? [
    { label: '가맹비' }, { label: '인테리어' }, { label: '장비/설비' }, { label: '숨겨진 비용' },
  ]
  // 항목마다 최대값·감속계수를 살짝 다르게 — 자연스럽게 달라 보임
  const MAX = [82, 78, 80, 75]
  const K   = [0.030, 0.028, 0.032, 0.026]

  const [progresses, setProgresses] = useState(items.map(() => 0))
  const [started, setStarted] = useState(items.map(() => false))

  useEffect(() => {
    const timers = items.map((_, i) =>
      setTimeout(() => setStarted(prev => { const n = [...prev]; n[i] = true; return n }), i * 900)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    const iv = setInterval(() => {
      setProgresses(prev => prev.map((p, i) => {
        if (!started[i]) return p
        const max = MAX[i]
        const speed = K[i] * (max - p)
        return Math.min(max, p + speed)
      }))
    }, 100)
    return () => clearInterval(iv)
  }, [started])

  return (
    <div>
      <ChartLabel>초기비용 구성</ChartLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {items.map((item, i) => (
          <div key={item.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-korean)' }}>
                {item.label}
              </span>
              <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'rgba(201,163,101,0.5)', letterSpacing: '0.04em' }}>
                조회 중
              </span>
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 3,
                background: 'linear-gradient(90deg, #C9A365, #C9A36555)',
                width: `${progresses[i]}%`,
                transition: 'width 0.08s linear',
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function HubCostChart({ data, color, apiTotalManwon, apiLoading = false }) {
  if (apiLoading) return <CostChartLoading brandKey={data.brandKey} />
  const ready = useBarAnim()
  const costs = BRAND_COSTS[data.brandKey] ?? []
  const syncedCosts = buildSyncedCosts(costs, apiTotalManwon)
  const displayCosts = syncedCosts ?? costs
  const total = Number.isFinite(apiTotalManwon) && apiTotalManwon > 0 ? formatManwon(apiTotalManwon) : BRAND_TOTAL[data.brandKey]
  if (!costs.length) return null
  return (
    <div>
      <ChartLabel>{syncedCosts ? 'Gemini 총액 맞춤 구성' : '초기비용 구성'}</ChartLabel>
      {syncedCosts && <ChartNote>Gemini 총액에 맞춰 구성비를 비례 조정했습니다</ChartNote>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
        {displayCosts.map((item, i) => (
          <div key={item.label}>
            <BarRow left={item.label} right={<AnimatedAmount value={item.amtValue} fallback={item.amt} delay={i * 80} />} />
            <Bar pct={item.pct} color={color} delay={i * 0.08} ready={ready} />
          </div>
        ))}
      </div>
      {total && <TotalRow label="총 예상 초기비용" val={total} color={color} />}
    </div>
  )
}

// ── 차트 7: 허브 섹션 월 수익 구조 (얼마 남나?) ──────────────
const HUB_PROFIT_DATA = {
  '교촌치킨': {
    revenue: 1300,
    items: [
      { label: '재료비 (40%)', amt: 494, pct: 38 },
      { label: '인건비',       amt: 250, pct: 19 },
      { label: '임대료',       amt: 150, pct: 12 },
      { label: '기타 (로열티·관리비)', amt: 86, pct: 7 },
    ],
    profit: 320,
  },
  'BHC치킨': {
    revenue: 1200,
    items: [
      { label: '재료비 (47.6%)', amt: 571, pct: 48 },
      { label: '인건비',         amt: 250, pct: 21 },
      { label: '임대료',         amt: 150, pct: 13 },
      { label: '기타 (광고·관리비)', amt: 64, pct: 5 },
    ],
    profit: 130,
  },
  '비비큐(BBQ)': {
    revenue: 1400,
    items: [
      { label: '재료비 (38%)', amt: 532, pct: 38 },
      { label: '인건비',       amt: 250, pct: 18 },
      { label: '임대료',       amt: 150, pct: 11 },
      { label: '로열티 (3%)',  amt: 42,  pct: 3  },
      { label: '기타',         amt: 86,  pct: 6  },
    ],
    profit: 155,
  },
  '푸라닭치킨': {
    revenue: 1000,
    items: [
      { label: '재료비 (38%)', amt: 380, pct: 38 },
      { label: '인건비',       amt: 200, pct: 20 },
      { label: '임대료',       amt: 120, pct: 12 },
      { label: '기타 (로열티·관리비)', amt: 80, pct: 8 },
    ],
    profit: 220,
  },
}

function HubProfitChart({ data, color }) {
  const ready = useBarAnim()
  const d = HUB_PROFIT_DATA[data.brandKey]
  if (!d) return null
  const profitPct = Math.round((d.profit / d.revenue) * 100)
  return (
    <div>
      <ChartLabel>월 수익 구조 (매출 {d.revenue.toLocaleString()}만 기준)</ChartLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
        {d.items.map((item, i) => (
          <div key={item.label}>
            <BarRow left={item.label} right={`-${item.amt.toLocaleString()}만`} />
            <Bar pct={item.pct} color="#E05A4E" delay={i * 0.07} ready={ready} height={5} />
          </div>
        ))}
      </div>
      <TotalRow label="실제 순이익" val={`약 ${d.profit.toLocaleString()}만 (${profitPct}%)`} color={color} />
    </div>
  )
}

// ── 차트 8: 허브 섹션 폐업 원인 (어디서 망하나?) ─────────────
const HUB_FAILURE_DATA = {
  '교촌치킨': [
    { label: '자금 소진',  pct: 35 },
    { label: '입지 미스매치',  pct: 33 },
    { label: '본사 갈등',  pct: 20 },
    { label: '체력 고비', pct: 12 },
  ],
  'BHC치킨': [
    { label: '입지 미스매치',  pct: 38 },
    { label: '자금 소진',  pct: 31 },
    { label: '본사 갈등',  pct: 18 },
    { label: '체력 고비', pct: 13 },
  ],
  '비비큐(BBQ)': [
    { label: '가격 저항',  pct: 32 },
    { label: '입지 미스매치',  pct: 31 },
    { label: '자금 소진',  pct: 25 },
    { label: '본사 갈등',  pct: 12 },
  ],
  '푸라닭치킨': [
    { label: '집객 부족',  pct: 40 },
    { label: '입지 미스매치',  pct: 30 },
    { label: '자금 소진',  pct: 20 },
    { label: '체력 고비', pct: 10 },
  ],
}

function HubFailureChart({ data, color }) {
  const ready = useBarAnim()
  const items = HUB_FAILURE_DATA[data.brandKey] ?? []
  if (!items.length) return null
  return (
    <div>
      <ChartLabel>폐업 원인 분포</ChartLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
        {items.map((item, i) => (
          <div key={item.label}>
            <BarRow left={item.label} right={`${item.pct}%`} />
            <Bar pct={item.pct} color={color} delay={i * 0.08} ready={ready} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── 차트 9: 제목 기반 세부 카드 바 그래프 (3단계 섹션) ────────
const SUBCHART_DATA = {
  // s1계열 - 해볼 만할까? 세부
  '브랜드 파워': {
    label: '인지도 지표',
    items: [
      { name: '브랜드 인지도',  pct: 95, val: '95%' },
      { name: '재방문율',      pct: 62, val: '62%' },
      { name: '배달앱 상위',    pct: 85, val: '상위 5%' },
      { name: 'TV광고 점유',    pct: 70, val: '연 200억+' },
    ],
  },
  '초보자 난이도': {
    label: '학습 곡선',
    items: [
      { name: '표준화 수준',    pct: 90, val: '높음' },
      { name: '교육 기간',      pct: 45, val: '3~4주' },
      { name: '조리 복잡도',    pct: 35, val: '낮음' },
      { name: '1인 운영 가능',  pct: 15, val: '불가' },
    ],
  },
  '경쟁 강도': {
    label: '밀집도 분석',
    items: [
      { name: '반경 500m 내',   pct: 85, val: '4.2개' },
      { name: '동일 브랜드',    pct: 20, val: '500m 보호' },
      { name: '타 브랜드',      pct: 95, val: '무제한' },
      { name: '배달 경쟁',      pct: 75, val: '심함' },
    ],
  },
  '운영 고비': {
    label: '3년 통계',
    items: [
      { name: '3년 내 폐업률',  pct: 30, val: '30%' },
      { name: '6개월 위험',     pct: 75, val: '최대' },
      { name: '2년차 안정률',   pct: 60, val: '60%' },
      { name: '5년 생존율',     pct: 40, val: '40%' },
    ],
  },

  // s9계열 - 얼마 남나? 세부
  '재료비': {
    label: '원가 구성',
    items: [
      { name: '닭고기',        pct: 55, val: '마리 4,200원' },
      { name: '튀김유·오일',   pct: 22, val: '15%' },
      { name: '소스·파우더',   pct: 16, val: '본사 공급' },
      { name: '포장·배달재',   pct: 10, val: '10%' },
    ],
  },
  '인건비': {
    label: '직원 구성별 월 인건비',
    items: [
      { name: '사장 1인',      pct: 20, val: '0만' },
      { name: '+직원 1명',     pct: 50, val: '250만' },
      { name: '+주말 알바',    pct: 66, val: '330만' },
      { name: '+직원 2명',     pct: 95, val: '500만' },
    ],
  },
  '임대료': {
    label: '상권별 월 임대료',
    items: [
      { name: '주택가',        pct: 16, val: '50~80만' },
      { name: '동네 상권',     pct: 30, val: '120~150만' },
      { name: 'A급 상권',      pct: 70, val: '250~400만' },
      { name: '대로변·역세권', pct: 100, val: '500만+' },
    ],
  },
  '실제 순이익': {
    label: '매출별 순이익 시뮬레이션',
    items: [
      { name: '매출 900만',    pct: 24, val: '약 90~110만' },
      { name: '매출 1,200만',  pct: 34, val: '약 100~150만' },
      { name: '매출 1,500만',  pct: 46, val: '약 150~180만' },
      { name: '매출 1,800만',  pct: 58, val: '약 180~220만' },
    ],
  },
  '로열티': {
    label: '브랜드별 로열티 부담 (월매출 1,400만 기준)',
    items: [
      { name: '교촌 (2%)',     pct: 40, val: '월 28만' },
      { name: 'BHC (2%)',      pct: 40, val: '월 28만' },
      { name: 'BBQ (3%)',      pct: 60, val: '월 42만' },
      { name: '푸라닭 (4%)',   pct: 80, val: '월 40만' },
    ],
  },

  // s13계열 - 어디서 망하나? 세부
  '입지 미스매치': {
    label: '상권 타입별 3년 내 폐업률',
    items: [
      { name: '배달상권 + 홀', pct: 85, val: '65%' },
      { name: '유동↓ 주택가',  pct: 70, val: '52%' },
      { name: '포화 상권',     pct: 55, val: '40%' },
      { name: '적합 상권',     pct: 18, val: '12%' },
    ],
  },
  '자금 소진': {
    label: '월별 자금 상태',
    items: [
      { name: '1~2개월 오픈버프', pct: 30, val: '유입 > 유출' },
      { name: '3~4개월 위기',    pct: 90, val: '예비금 소진' },
      { name: '5~7개월 손익분기', pct: 55, val: '균형' },
      { name: '8개월+ 회복',     pct: 35, val: '흑자 전환' },
    ],
  },
  '본사 갈등': {
    label: '갈등 유형 분포',
    items: [
      { name: '단가 강제 인상', pct: 75, val: '연 2~5%' },
      { name: '메뉴 강제 변경', pct: 55, val: '거부 불가' },
      { name: '리모델링 강요', pct: 45, val: '5년 주기' },
      { name: '해지 위약금',   pct: 65, val: '수천만' },
    ],
  },
  '체력 고비': {
    label: '근무 부담 지표',
    items: [
      { name: '주 근무일',     pct: 95, val: '주 7일' },
      { name: '일 근무시간',   pct: 85, val: '12시간+' },
      { name: '휴가 가능성',   pct: 15, val: '연 5일 미만' },
      { name: '체력 한계 시점', pct: 70, val: '1~2년차' },
    ],
  },
  '가격 저항': {
    label: '경기 민감도 (호황기 = 100%)',
    items: [
      { name: '호황기 매출',   pct: 95, val: '100%' },
      { name: '보통',          pct: 72, val: '78%' },
      { name: '불황 초기',     pct: 50, val: '55%' },
      { name: '불황 지속',     pct: 30, val: '33%' },
    ],
  },
  '집객 부족': {
    label: '오픈 후 집객 추이',
    items: [
      { name: '오픈 1개월',    pct: 42, val: '자연 40%' },
      { name: '2~3개월',       pct: 25, val: '하락 25%' },
      { name: '광고 투입 후',  pct: 60, val: '회복 60%' },
      { name: '유지 성공률',   pct: 35, val: '35%' },
    ],
  },
}

const QUALITATIVE_SUBCHARTS = new Set([
  '브랜드 파워',
  '초보자 난이도',
  '경쟁 강도',
  '운영 고비',
  '본사 갈등',
  '체력 고비',
])

function SubBarChart({ data, color }) {
  const ready = useBarAnim()
  const d = SUBCHART_DATA[data.title]
  if (!d) return null
  return (
    <div>
      <ChartLabel>{d.label}</ChartLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
        {d.items.map((item, i) => (
          <div key={item.name}>
            <BarRow left={item.name} right={item.val} />
            <Bar pct={item.pct} color={color} delay={i * 0.07} ready={ready} />
          </div>
        ))}
      </div>
    </div>
  )
}

function QualitativeSubChart({ data, color }) {
  const d = SUBCHART_DATA[data.title]
  if (!d) return null
  return (
    <div>
      <ChartLabel>{d.label}</ChartLabel>
      <ChartNote>서로 다른 지표를 묶은 요약입니다</ChartNote>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {d.items.map((item, i) => (
          <SignalRow key={item.name} label={item.name} value={item.val} tone={qualTone(item.pct)} color={color} delay={i * 0.04} />
        ))}
      </div>
    </div>
  )
}

// ── 차트 10: 핵심 체크 (스마트 오버뷰) ───────────────────────
function OverviewChart({ data, color }) {
  const ready = useBarAnim()
  const pct = extractPct(data.row1Val) || extractPct(data.val)
  const warn = data.tags?.filter(t => t.type === 'warn') ?? []
  const ok   = data.tags?.filter(t => t.type === 'ok')   ?? []
  const scoreMap = { green: 78, yellow: 52, red: 28 }
  const score = scoreMap[data.valColor] ?? 50

  if (pct > 0) {
    return (
      <div>
        <ChartLabel>핵심 지표</ChartLabel>
        <BigStat val={pct} unit="%" color={color} />
        <Bar pct={pct} color={color} ready={ready} height={6} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 16 }}>
          {ok.map((tag, i) => <TagRow key={i} label={tag.label} dot="#3DBFB8" />)}
          {warn.map((tag, i) => <TagRow key={i} label={tag.label} dot="#E05A4E" />)}
        </div>
      </div>
    )
  }

  return (
    <div>
      <ChartLabel>종합 평가</ChartLabel>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 34, color, lineHeight: 1, marginBottom: 10, letterSpacing: '-0.5px' }}>
        {data.val}
      </div>
      <Bar pct={score} color={color} ready={ready} height={5} />
      <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 300, marginTop: 6, marginBottom: 14 }}>
        {data.row1Val}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {ok.map((tag, i) => <TagRow key={i} label={tag.label} dot="#3DBFB8" />)}
        {warn.map((tag, i) => <TagRow key={i} label={tag.label} dot="#E05A4E" />)}
      </div>
    </div>
  )
}

// ── 공통 UI 조각 ──────────────────────────────────────────────
function ChartLabel({ children }) {
  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-text-faint)', marginBottom: 12 }}>
      {children}
    </div>
  )
}

function ChartNote({ children }) {
  return (
    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.32)', fontWeight: 300, lineHeight: 1.5, marginTop: -7, marginBottom: 12, wordBreak: 'keep-all' }}>
      {children}
    </div>
  )
}

function qualLevel(pct) {
  if (pct >= 85) return { text: '매우 높음', tone: 'high' }
  if (pct >= 70) return { text: '높음', tone: 'good' }
  if (pct >= 55) return { text: '보통', tone: 'mid' }
  if (pct >= 40) return { text: '낮음', tone: 'low' }
  return { text: '매우 낮음', tone: 'low' }
}

function qualTone(pct) {
  if (pct >= 75) return 'high'
  if (pct >= 55) return 'mid'
  if (pct >= 35) return 'low'
  return 'faint'
}

const QUAL_TONE_STYLE = {
  high:  { bg: 'rgba(224,90,78,0.12)',  border: 'rgba(224,90,78,0.28)',  text: '#E05A4E' },
  good:  { bg: 'rgba(61,191,184,0.12)', border: 'rgba(61,191,184,0.28)', text: '#3DBFB8' },
  mid:   { bg: 'rgba(201,163,101,0.12)', border: 'rgba(201,163,101,0.28)', text: '#C9A365' },
  low:   { bg: 'rgba(155,127,232,0.10)', border: 'rgba(155,127,232,0.24)', text: '#BCAAF4' },
  faint: { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.09)', text: 'rgba(255,255,255,0.58)' },
}

function LevelTile({ label, level, color, delay = 0 }) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80 + delay * 1000)
    return () => clearTimeout(t)
  }, [delay])
  const tone = QUAL_TONE_STYLE[level.tone] ?? QUAL_TONE_STYLE.mid
  return (
    <div style={{
      minHeight: 62,
      borderRadius: 12,
      background: ready ? tone.bg : 'rgba(255,255,255,0.035)',
      border: `1px solid ${ready ? tone.border : 'rgba(255,255,255,0.07)'}`,
      padding: '10px 11px',
      transition: 'background 0.35s ease, border-color 0.35s ease, transform 0.35s ease, opacity 0.35s ease',
      transform: ready ? 'translateY(0)' : 'translateY(6px)',
      opacity: ready ? 1 : 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}80`, flexShrink: 0 }} />
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.56)', fontWeight: 500, wordBreak: 'keep-all' }}>{label}</span>
      </div>
      <div style={{ fontSize: 14, fontWeight: 800, color: tone.text, letterSpacing: '-0.2px' }}>{level.text}</div>
    </div>
  )
}

function SignalRow({ label, value, tone, color, delay = 0 }) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80 + delay * 1000)
    return () => clearTimeout(t)
  }, [delay])
  const toneStyle = QUAL_TONE_STYLE[tone] ?? QUAL_TONE_STYLE.mid
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      minHeight: 38,
      padding: '8px 10px',
      borderRadius: 10,
      background: ready ? 'rgba(255,255,255,0.045)' : 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.07)',
      transition: 'background 0.35s ease, transform 0.35s ease, opacity 0.35s ease',
      transform: ready ? 'translateY(0)' : 'translateY(5px)',
      opacity: ready ? 1 : 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, boxShadow: `0 0 5px ${color}80`, flexShrink: 0 }} />
        <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.68)', wordBreak: 'keep-all' }}>{label}</span>
      </div>
      <span style={{
        flexShrink: 0,
        maxWidth: '44%',
        textAlign: 'right',
        fontSize: 11,
        fontWeight: 800,
        color: toneStyle.text,
        background: toneStyle.bg,
        border: `1px solid ${toneStyle.border}`,
        borderRadius: 9999,
        padding: '3px 8px',
        wordBreak: 'keep-all',
      }}>
        {value}
      </span>
    </div>
  )
}

function BarRow({ left, right }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
      <span style={{ fontFamily: 'var(--font-korean)', fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.65)' }}>{left}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.9)' }}>{right}</span>
    </div>
  )
}

function BigStat({ val, unit, color, sub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, marginBottom: 8 }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 42, color, lineHeight: 1 }}>{val}</span>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, color, fontStyle: 'italic', lineHeight: 1.2 }}>{unit}</span>
      {sub && <span style={{ fontSize: 11, color: 'var(--color-text-muted)', marginLeft: 4, marginBottom: 4 }}>{sub}</span>}
    </div>
  )
}

function TotalRow({ label, val, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 13px', background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 12, marginTop: 14 }}>
      <span style={{ fontFamily: 'var(--font-korean)', fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color }}>{val}</span>
    </div>
  )
}

function TagRow({ label, dot }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 5, height: 5, borderRadius: '50%', background: dot, flexShrink: 0, boxShadow: `0 0 5px ${dot}80` }} />
      <span style={{ fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.7)' }}>{label}</span>
    </div>
  )
}

// ── 렌더 차트 선택 ────────────────────────────────────────────
function ChartSection({ data, ac, apiCost, apiLoading = false }) {
  const apiTotalManwon = typeof apiCost === 'object' ? apiCost?.totalManwon : null
  if (data.brandKey && data.title === '해볼 만할까?')  return <HubOverviewChart data={data} color={ac.color} />
  if (data.brandKey && data.title === '얼마 드나?')    return <HubCostChart data={data} color={ac.color} apiTotalManwon={apiTotalManwon} apiLoading={apiLoading} />
  if (data.brandKey && data.title === '얼마 남나?')    return <HubProfitChart data={data} color={ac.color} />
  if (data.brandKey && (data.title === '왜 망하나?' || data.title === '어디서 망하나?')) return <HubFailureChart data={data} color={ac.color} />

  if (SUBCHART_DATA[data.title]) {
    if (QUALITATIVE_SUBCHARTS.has(data.title)) return <QualitativeSubChart data={data} color={ac.color} />
    return <SubBarChart data={data} color={ac.color} />
  }

  const type = detectChartType(data.title)
  switch (type) {
    case 'brand':   return <BrandCostChart title={data.title} color={ac.color} />
    case 'failure': return <FailureChart data={data} color={ac.color} />
    case 'profit':  return <ProfitChart data={data} color={ac.color} />
    case 'cost':    return <CostCompareChart title={data.title} color={ac.color} />
    default:        return <OverviewChart data={data} color={ac.color} />
  }
}

// ── accent 맵 ────────────────────────────────────────────────
const ACCENT_MAP = {
  green:  { color: '#3DBFB8', glow: 'rgba(61,191,184,0.15)',  border: 'rgba(61,191,184,0.25)'  },
  yellow: { color: '#C9A365', glow: 'rgba(201,163,101,0.15)', border: 'rgba(201,163,101,0.25)' },
  red:    { color: '#E05A4E', glow: 'rgba(224,90,78,0.15)',   border: 'rgba(224,90,78,0.25)'   },
}
const DEFAULT_ACCENT = { color: '#9B7FE8', glow: 'rgba(155,127,232,0.15)', border: 'rgba(155,127,232,0.25)' }

const TAG_STYLES = {
  warn: { background: 'rgba(224,90,78,0.10)',   color: '#E05A4E', border: '1px solid rgba(224,90,78,0.25)'   },
  ok:   { background: 'rgba(61,191,184,0.10)',  color: '#3DBFB8', border: '1px solid rgba(61,191,184,0.25)'  },
  neu:  { background: 'var(--color-bg-subtle)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border-default)' },
}

// ── 포커스 모드: 납작한 카드 ──────────────────────────────────
function FlatCard({ data, onToggle, visible, ac }) {
  const [pressed, setPressed] = useState(false)
  return (
    <div
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => { setPressed(false); onToggle() }}
      onPointerLeave={() => setPressed(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', height: 48,
        background: pressed ? 'var(--color-bg-card-hover)' : 'var(--color-bg-card)',
        border: `1px solid ${pressed ? 'var(--color-border-hover)' : 'var(--color-border-default)'}`,
        borderRadius: 14, cursor: 'pointer',
        transform: pressed ? 'scale(0.97)' : 'scale(1)',
        opacity: visible ? 0.55 : 0,
        transition: 'transform 0.12s ease, background 0.12s ease, opacity 0.3s ease',
        userSelect: 'none', WebkitUserSelect: 'none',
        overflow: 'hidden', position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: ac.color, boxShadow: `0 0 6px ${ac.color}80`, flexShrink: 0 }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.3px' }}>
          {data.title}
        </span>
      </div>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: ac.color }}>
        {data.val}
      </span>
    </div>
  )
}

// row1Val 안의 '상반기' '하반기'만 0.5em (부모의 절반)으로 — 가로 폭 절약
function Row1ValDisplay({ value, fontSize, color, lineHeight = 0.95, letterSpacing = '-0.5px' }) {
  const base = {
    fontFamily: 'var(--font-display)',
    fontSize,
    lineHeight,
    color,
    letterSpacing,
    wordBreak: 'keep-all',
    overflowWrap: 'break-word',
  }
  if (!value || !/(상반기|하반기)/.test(value)) {
    return <div style={base}>{value}</div>
  }
  const parts = value.split(/(상반기|하반기)/g)
  return (
    <div style={base}>
      {parts.map((part, i) =>
        part === '상반기' || part === '하반기' ? (
          <span key={i} style={{ fontSize: '0.5em' }}>{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </div>
  )
}

// ── 포커스 모드: 확장된 큰 카드 ──────────────────────────────
function ExpandedFocusCard({ data, onToggle, onNavigate, visible, ac, apiCost = null, apiLoading = false }) {
  const [headerPressed, setHeaderPressed] = useState(false)
  const [btnPressed, setBtnPressed] = useState(false)
  const apiCostText = typeof apiCost === 'object' ? apiCost?.costText : apiCost

  const [countNum, setCountNum] = useState(0)
  useEffect(() => {
    if (!apiLoading) { setCountNum(0); return }
    setCountNum(0)
    let cur = 0
    const iv = setInterval(() => {
      const step = cur < 1000 ? Math.ceil(Math.random() * 50 + 10)
                 : cur < 100000 ? Math.ceil(Math.random() * 3000 + 500)
                 : cur < 10000000 ? Math.ceil(Math.random() * 200000 + 50000)
                 : Math.ceil(Math.random() * 5000000 + 1000000)
      cur = cur + step
      setCountNum(cur)
    }, 60)
    return () => clearInterval(iv)
  }, [apiLoading])

  function formatCount(n) {
    if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억`
    if (n >= 10000) return `${Math.floor(n / 10000).toLocaleString()}만원`
    return `${n.toLocaleString()}원`
  }

  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: 'var(--color-bg-card)',
      border: `1px solid var(--color-border-hover)`,
      borderRadius: 22,
      minHeight: 'calc(66dvh - 60px)',
      display: 'flex', flexDirection: 'column',
      boxShadow: `0 0 40px ${ac.glow}, var(--shadow-card)`,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(16px)',
      transition: 'opacity 0.4s ease, transform 0.4s ease',
      userSelect: 'none', WebkitUserSelect: 'none',
    }}>
      {/* 배경 glow */}
      <div style={{ position: 'absolute', bottom: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, ${ac.glow} 0%, transparent 70%)`, pointerEvents: 'none' }} />

      {/* 헤더 (탭하면 닫힘) */}
      <div
        onPointerDown={() => setHeaderPressed(true)}
        onPointerUp={() => { setHeaderPressed(false); onToggle() }}
        onPointerLeave={() => setHeaderPressed(false)}
        style={{ padding: '20px 20px 0', cursor: 'pointer', transform: headerPressed ? 'scale(0.99)' : 'scale(1)', transition: 'transform 0.12s ease', flexShrink: 0 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: ac.color, boxShadow: `0 0 8px ${ac.color}80` }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: ac.color, letterSpacing: '0.1em' }}>{data.title}</span>
          </div>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 2l6 6M8 2l-6 6" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        {/* 큰 수치 */}
        <div style={{ marginBottom: 6 }}>
          <div>
            {apiLoading ? (
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 46, lineHeight: 0.9, color: 'rgba(255,255,255,0.6)', letterSpacing: '-1px', fontVariantNumeric: 'tabular-nums' }}>
                  {formatCount(countNum)}
                </div>
                <div style={{ fontSize: 11, fontWeight: 300, color: 'rgba(61,191,184,0.6)', marginTop: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
                  실시간 조회 중
                </div>
              </div>
            ) : apiCostText ? (
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 46, lineHeight: 0.9, color: ac.color, letterSpacing: '-1px', wordBreak: 'keep-all', overflowWrap: 'break-word' }}>{apiCostText}</div>
            ) : (
              <Row1ValDisplay value={data.row1Val} fontSize={46} color="var(--color-text-primary)" lineHeight={0.9} letterSpacing="-1px" />
            )}
            {!apiLoading && !apiCostText && /\d[\d,]*(만원|억|개)/.test(data.row1Val) && !data.row1Val.includes('%') && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'rgba(61,191,184,0.7)', border: '1px solid rgba(61,191,184,0.3)', borderRadius: 4, padding: '2px 5px', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>공정위자료기반</span>
              </div>
            )}
          </div>
          {!apiLoading && (
            <div style={{ fontSize: 11, fontWeight: 300, color: 'var(--color-text-muted)', marginTop: 8, wordBreak: 'keep-all' }}>
              {apiCostText ? 'Gemini AI 응답 · 실시간' : data.row1Label}
            </div>
          )}
        </div>
      </div>

      {/* 구분선 */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '16px 20px 0', flexShrink: 0 }} />

      {/* 바디 */}
      <div style={{ padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* 동적 차트 */}
        <ChartSection data={data} ac={ac} apiCost={apiCost} apiLoading={apiLoading} />

        {/* 태그 */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {data.tags?.map((tag, i) => (
            <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500, letterSpacing: '0.06em', padding: '3px 9px', borderRadius: 9999, ...TAG_STYLES[tag.type] }}>
              {tag.label}
            </span>
          ))}
        </div>

        {/* insight */}
        <div style={{ padding: '11px 13px', borderRadius: 12, background: 'rgba(255,255,255,0.04)' }}>
          <InsightList insights={data.insights} text={data.text} />
        </div>

        {/* 공정위 표시 */}
        {data.official && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="7.5" stroke="rgba(61,191,184,0.4)" strokeWidth="1"/>
              <circle cx="8" cy="8" r="5" stroke="rgba(61,191,184,0.3)" strokeWidth="0.5"/>
              <text x="8" y="10.5" textAnchor="middle" fontSize="5" fill="rgba(61,191,184,0.6)" fontFamily="sans-serif" fontWeight="700">공정위</text>
            </svg>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>공정거래위원회 기반</span>
          </div>
        )}
      </div>

      {/* CTA */}
      <div style={{ padding: '16px 20px 52px', marginTop: 'auto' }}>
        {data.qBtn && (
          <button
            onPointerDown={(e) => { e.stopPropagation(); setBtnPressed(true) }}
            onPointerUp={(e) => { e.stopPropagation(); setBtnPressed(false); if (data.qBtn.target) onNavigate(data.qBtn.target) }}
            onPointerLeave={(e) => { e.stopPropagation(); setBtnPressed(false) }}
            className="cta-pulse"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', background: '#E8D5B0', border: 'none', borderRadius: 14,
              padding: '14px 18px', fontFamily: 'var(--font-korean)',
              fontSize: 13, fontWeight: 900, color: '#0A0907', cursor: 'pointer',
              animationPlayState: btnPressed ? 'paused' : 'running',
              opacity: btnPressed ? 0.85 : 1,
              transition: 'opacity 0.12s ease',
            }}
          >
            <span>{data.qBtn.label}</span>
          </button>
        )}
      </div>
    </div>
  )
}

// ── 메인 Card ─────────────────────────────────────────────────
export default function Card({ data, index = 0, selected, anySelected, focusMode = false, onToggle, onNavigate, apiCost = null, apiLoading = false }) {
  const { title, hint, val, valColor, row1Val, row1Label, tags, text, qBtn } = data
  const [pressed, setPressed] = useState(false)
  const [btnPressed, setBtnPressed] = useState(false)
  const [visible, setVisible] = useState(false)

  const ac = ACCENT_MAP[valColor] ?? DEFAULT_ACCENT

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 60)
    return () => clearTimeout(t)
  }, [index])

  // 포커스 모드 분기
  if (focusMode) {
    if (selected) return <ExpandedFocusCard data={data} onToggle={onToggle} onNavigate={onNavigate} visible={visible} ac={ac} apiCost={apiCost} apiLoading={apiLoading} />
    if (anySelected) return <FlatCard data={data} onToggle={onToggle} visible={visible} ac={ac} />
  }

  // 일반 모드
  return (
    <div
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => { setPressed(false); onToggle() }}
      onPointerLeave={() => setPressed(false)}
      style={{
        position: 'relative', overflow: 'hidden',
        background: pressed || selected ? 'var(--color-bg-card-hover)' : 'var(--color-bg-card)',
        border: `1px solid ${selected || pressed ? 'var(--color-border-hover)' : 'var(--color-border-default)'}`,
        borderRadius: 'var(--radius-card)', cursor: 'pointer',
        transform: `${pressed ? 'scale(0.97)' : 'scale(1)'} translateY(${visible ? '0px' : '16px'})`,
        opacity: visible ? 1 : 0,
        transition: pressed
          ? 'transform 0.12s ease, background 0.12s ease, border-color 0.12s ease'
          : 'transform 0.15s ease, background 0.15s ease, border-color 0.15s ease, opacity 0.4s ease',
        boxShadow: 'var(--shadow-card)', userSelect: 'none', WebkitUserSelect: 'none',
      }}
    >
      <div style={{ position: 'absolute', bottom: -30, right: -30, width: 80, height: 80, borderRadius: '50%', background: `radial-gradient(circle, ${ac.glow} 0%, transparent 70%)`, pointerEvents: 'none' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1, minWidth: 0 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: ac.color, boxShadow: `0 0 8px ${ac.color}80`, marginTop: 6, flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.3px' }}>{title}</div>
            {!selected && <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 3, fontWeight: 300 }}>{hint}</div>}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, marginLeft: 12 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: ac.color, letterSpacing: '-0.3px' }}>{val}</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ opacity: 0.3, transform: selected ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease' }}>
            <path d="M2 7h10M7 2l5 5-5 5" stroke="#F5F0E8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <div style={{ maxHeight: selected ? 340 : 0, overflow: 'hidden', transition: 'max-height 0.28s cubic-bezier(0.4, 0, 0.2, 1)' }}>
        <div style={{ padding: '0 18px 18px', borderTop: '1px solid var(--color-border-default)' }}>
          <div style={{ padding: '14px 0 12px', borderBottom: '1px solid var(--color-border-default)' }}>
            <div>
              <Row1ValDisplay value={row1Val} fontSize={36} color="var(--color-text-primary)" lineHeight={0.95} letterSpacing="-0.5px" />
              {/\d[\d,]*(만원|억|개)/.test(row1Val) && !row1Val.includes('%') && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                  <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'rgba(61,191,184,0.7)', border: '1px solid rgba(61,191,184,0.3)', borderRadius: 4, padding: '2px 5px', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>공정위자료기반</span>
                </div>
              )}
            </div>
            <div style={{ fontSize: 11, fontWeight: 300, color: 'var(--color-text-muted)', marginTop: 6, wordBreak: 'keep-all' }}>{row1Label}</div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', padding: '10px 0', borderBottom: '1px solid var(--color-border-default)' }}>
            {tags?.map((tag, i) => (
              <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500, letterSpacing: '0.06em', padding: '3px 9px', borderRadius: 9999, ...TAG_STYLES[tag.type] }}>
                {tag.label}
              </span>
            ))}
          </div>
          <div style={{ paddingTop: 10 }}>
            <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', marginBottom: 10 }}>
              <InsightList insights={data.insights} text={text} />
            </div>
            {data.official && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="8" r="7.5" stroke="rgba(61,191,184,0.4)" strokeWidth="1"/>
                  <circle cx="8" cy="8" r="5" stroke="rgba(61,191,184,0.3)" strokeWidth="0.5"/>
                  <text x="8" y="10.5" textAnchor="middle" fontSize="5" fill="rgba(61,191,184,0.6)" fontFamily="sans-serif" fontWeight="700">공정위</text>
                </svg>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>공정거래위원회 기반</span>
              </div>
            )}
            {qBtn && (
              <button
                onPointerDown={(e) => { e.stopPropagation(); setBtnPressed(true) }}
                onPointerUp={(e) => { e.stopPropagation(); setBtnPressed(false); if (qBtn.target) onNavigate(qBtn.target) }}
                onPointerLeave={(e) => { e.stopPropagation(); setBtnPressed(false) }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', background: ac.color, border: 'none', borderRadius: 'var(--radius-button)',
                  padding: '13px 16px', fontFamily: 'var(--font-korean)', fontSize: 13, fontWeight: 900,
                  color: '#0A0907', cursor: 'pointer',
                  transform: btnPressed ? 'scale(0.97)' : 'scale(1)',
                  transition: 'transform 0.12s ease, opacity 0.12s ease',
                  opacity: btnPressed ? 0.85 : 1,
                }}
              >
                <span>{qBtn.label}</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M1 7h12M7 1l6 6-6 6" stroke="#0A0907" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
