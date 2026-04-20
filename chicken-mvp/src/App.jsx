import { useState } from 'react'
import { screens } from './data'
import Card from './components/Card'

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('s0')
  const [stack, setStack] = useState([])
  const [selectedCard, setSelectedCard] = useState(null)

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

  const toggleCard = (idx) => {
    setSelectedCard(prev => prev === idx ? null : idx)
  }

  const screen = screens[currentScreen]

  return (
    <div style={{
      background: '#0a0c10',
      minHeight: '100dvh',
      width: '100%',
      maxWidth: 390,
      margin: '0 auto',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      color: '#eee',
      overflowY: 'auto',
    }}>
      <div style={{ padding: 18 }}>
        {/* 뒤로가기 + 단계 표시 */}
        {stack.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <button
              onClick={back}
              style={{
                background: '#1e2128', border: '0.5px solid #2e3140', borderRadius: 8,
                color: '#aaa', fontSize: 12, padding: '6px 12px', cursor: 'pointer',
              }}
            >
              ← 뒤로
            </button>
            <span style={{
              fontSize: 10, color: '#555', background: '#1e2128',
              border: '0.5px solid #2e3140', borderRadius: 6, padding: '2px 8px',
              marginLeft: 'auto',
            }}>
              {stack.length + 1}단계
            </span>
          </div>
        )}

        {/* 브레드크럼 */}
        {screen.breadcrumb && (
          <p style={{ fontSize: 11, color: '#555', marginBottom: 16 }}>
            {screen.breadcrumb[0]} › <span style={{ color: '#888' }}>{screen.breadcrumb[1]}</span>
          </p>
        )}

        {/* 브랜드명 (1단계만) */}
        {screen.brand && (
          <p style={{ fontSize: 11, color: '#555', marginBottom: 4, letterSpacing: '.5px' }}>
            {screen.brand}
          </p>
        )}

        {/* 제목 */}
        <p style={{ fontSize: 20, fontWeight: 500, color: '#eee', marginBottom: 3 }}>
          {screen.title}
        </p>
        <p style={{ fontSize: 12, color: '#555', marginBottom: 16 }}>
          {screen.sub}
        </p>

        {/* 카드 목록 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {screen.cards.map((card, i) => (
            <Card
              key={i}
              data={card}
              selected={selectedCard === i}
              onToggle={() => toggleCard(i)}
              onNavigate={navigate}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
