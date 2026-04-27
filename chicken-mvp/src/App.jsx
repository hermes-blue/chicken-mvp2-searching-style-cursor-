import { useState } from 'react'
import { screens } from './data'
import Card from './components/Card'
import FeedbackFab from './components/FeedbackFab'

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('s0')
  const [stack, setStack] = useState([])
  const [selectedCard, setSelectedCard] = useState(null)
  const [backPressed, setBackPressed] = useState(false)

  const navigate = (target) => {
    setStack(prev => [...prev, currentScreen])
    setCurrentScreen(target)
    setSelectedCard(null)
  }

  const back = () => {
    if (!stack.length) return
    const prev = stack[stack.length - 1]
    setStack(s => s.slice(0, -1))
    setCurrentScreen(prev)
    setSelectedCard(null)
  }

  // 브랜드별 '얼마 드나?' API 연결 대상 화면
  const BRAND_SCREENS = {
    sgyo0:  '교촌치킨',
    sbhc0:  'BHC치킨',
    sbbq0:  '비비큐(BBQ)',
    spura0: '푸라닭치킨',
  }

  const [apiCosts, setApiCosts] = useState({})
  const [apiLoadings, setApiLoadings] = useState({})

  const parseCostToManwon = (text = '') => {
    const normalized = String(text).replace(/,/g, '').replace(/\s+/g, '')
    const rangeMatch = normalized.match(/(\d+(?:\.\d+)?)억~(\d+(?:\.\d+)?)억/)
    if (rangeMatch) return Math.round(((Number(rangeMatch[1]) + Number(rangeMatch[2])) / 2) * 10000)
    const eokMatch = normalized.match(/(\d+(?:\.\d+)?)억/)
    const cheonMatch = normalized.match(/(\d+(?:\.\d+)?)천/)
    const manMatch = normalized.match(/(\d+(?:\.\d+)?)만/)
    let total = 0
    if (eokMatch) total += Number(eokMatch[1]) * 10000
    if (cheonMatch) total += Number(cheonMatch[1]) * 1000
    if (manMatch) total += Number(manMatch[1])
    if (total > 0) return Math.round(total)
    const numeric = normalized.match(/(\d+(?:\.\d+)?)/)
    if (!numeric) return null
    const value = Number(numeric[1])
    return value < 100 ? Math.round(value * 10000) : Math.round(value)
  }

  const fetchBrandCostDirectForLocal = async (brandName) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey || !import.meta.env.DEV) return null
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`
    const body = {
      contents: [{
        parts: [{ text: `${brandName} 창업비용을 딱 하나의 숫자로만 답해줘. 단위는 억원으로. 예: 2.2억. 범위 말고 대표값 하나만.` }]
      }]
    }
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error?.message ?? 'Gemini local request failed')
    const costText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    const totalManwon = parseCostToManwon(costText)
    if (!costText || !totalManwon) throw new Error('Gemini local response could not be parsed')
    return { costText, totalManwon }
  }

  const toggleCard = (idx) => {
    const opening = selectedCard !== idx
    setSelectedCard(prev => prev === idx ? null : idx)

    // '얼마 드나?' 카드(index 1)를 열 때 해당 브랜드 API 호출
    if (opening && idx === 1 && BRAND_SCREENS[currentScreen] && !apiCosts[currentScreen]) {
      fetchBrandCost(currentScreen, BRAND_SCREENS[currentScreen])
    }
  }

  const fetchBrandCost = async (screenKey, brandName) => {
    setApiLoadings(prev => ({ ...prev, [screenKey]: true }))
    try {
      const res = await fetch('/api/gemini-cost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandName }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Gemini request failed')
      console.log(`🐔 ${brandName} 창업비용 (API):`, data.costText, data.totalManwon)
      setApiCosts(prev => ({ ...prev, [screenKey]: data }))
    } catch (error) {
      try {
        const localData = await fetchBrandCostDirectForLocal(brandName)
        if (!localData) throw error
        console.log(`🐔 ${brandName} 창업비용 (local fallback):`, localData.costText, localData.totalManwon)
        setApiCosts(prev => ({ ...prev, [screenKey]: localData }))
      } catch (fallbackError) {
        console.warn(`🐔 ${brandName} 창업비용 API 실패:`, fallbackError)
      }
    } finally {
      setApiLoadings(prev => ({ ...prev, [screenKey]: false }))
    }
  }

  const screen = screens[currentScreen]
  // 하단 푸터 + 피드백 FAB 높이만큼 본문 여백을 줘서 카드와 겹침 방지
  const contentBottomPadding = 'calc(32px + 52px + 28px + env(safe-area-inset-bottom, 0px))'

  return (
    <div style={{
      background: 'var(--color-bg-base)',
      minHeight: '100dvh',
      width: '100%',
      maxWidth: 390,
      margin: '0 auto',
      fontFamily: 'var(--font-korean)',
      color: 'var(--color-text-primary)',
      overflowY: 'auto',
    }}>
      {/* 하단 고정 푸터 */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 390,
        height: 32,
        background: 'rgba(10,9,7,0.92)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        zIndex: 999,
        backdropFilter: 'blur(8px)',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>Data Source</span>
        <span style={{ width: 1, height: 10, background: 'rgba(255,255,255,0.1)' }} />
        <span style={{ fontFamily: 'var(--font-korean)', fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}>공정거래위원회 · 통계청</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.1em', marginLeft: 4 }}>정보공개서 2025</span>
      </div>

      <div style={{ padding: `56px 20px ${contentBottomPadding}` }}>
        {/* 뒤로가기 + 단계 표시 */}
        {stack.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <button
              onPointerDown={() => setBackPressed(true)}
              onPointerUp={() => { setBackPressed(false); back() }}
              onPointerLeave={() => setBackPressed(false)}
              style={{
                background: backPressed ? 'var(--color-bg-card-hover)' : 'var(--color-bg-card)',
                border: `1px solid ${backPressed ? 'var(--color-border-hover)' : 'var(--color-border-default)'}`,
                borderRadius: 'var(--radius-button)',
                color: 'var(--color-text-secondary)',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.06em',
                padding: '7px 14px',
                cursor: 'pointer',
                transform: backPressed ? 'scale(0.97)' : 'scale(1)',
                transition: 'transform 0.12s ease, background 0.12s ease',
              }}
            >
              ← 뒤로
            </button>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-text-faint)',
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-badge)',
              padding: '3px 10px',
              marginLeft: 'auto',
            }}>
              Step {stack.length + 1}
            </span>
          </div>
        )}

        {/* 브레드크럼 */}
        {screen.breadcrumb && (
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-text-faint)',
            marginBottom: 20,
          }}>
            {screen.breadcrumb[0]} <span style={{ opacity: 0.4 }}>›</span>{' '}
            <span style={{ color: 'var(--color-text-muted)' }}>{screen.breadcrumb[1]}</span>
          </p>
        )}

        {/* 브랜드명 (1단계만) */}
        {screen.brand && (
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-text-faint)',
            marginBottom: 10,
          }}>
            {screen.brand}
          </p>
        )}

        {/* 섹션 레이블 (s0에만) */}
        {!screen.brand && !screen.breadcrumb && (
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)',
            marginBottom: 8,
            fontWeight: 500,
          }}>
            치킨 프랜차이즈 인텔리전스
          </p>
        )}

        {/* 제목 */}
        {!screen.brand && !screen.breadcrumb ? (
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 38,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.5px',
            lineHeight: 1.1,
            marginBottom: 10,
          }}
            dangerouslySetInnerHTML={{
              __html: screen.title.replace('궁금해', '<span style="font-style:italic;color:#C9A365">궁금해</span>')
            }}
          />
        ) : (
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 28,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.5px',
            lineHeight: 1.2,
            marginBottom: 8,
          }}>
            {screen.title}
          </p>
        )}

        {/* 서브타이틀 */}
        <p style={{
          fontSize: 12,
          fontWeight: 300,
          color: 'rgba(255,255,255,0.35)',
          lineHeight: 1.6,
          marginBottom: 28,
        }}>
          {screen.sub}
        </p>

        {/* 카드 목록 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: currentScreen === 's0' && selectedCard !== null ? 8 : 10 }}>
          {screen.cards.map((card, i) => (
            <Card
              key={i}
              index={i}
              data={card}
              selected={selectedCard === i}
              anySelected={selectedCard !== null}
              focusMode={true}
              onToggle={() => toggleCard(i)}
              onNavigate={navigate}
              apiCost={BRAND_SCREENS[currentScreen] && i === 1 ? apiCosts[currentScreen] ?? null : null}
              apiLoading={BRAND_SCREENS[currentScreen] && i === 1 ? apiLoadings[currentScreen] ?? false : false}
            />
          ))}
        </div>
      </div>

      <FeedbackFab />
    </div>
  )
}
