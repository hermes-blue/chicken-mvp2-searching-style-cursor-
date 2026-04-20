import { useState } from 'react'
import { screens } from './data'
import Card from './components/Card'

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

  const toggleCard = (idx) => {
    setSelectedCard(prev => prev === idx ? null : idx)
  }

  const screen = screens[currentScreen]

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
      <div style={{ padding: '56px 20px 40px' }}>
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
            />
          ))}
        </div>
      </div>
    </div>
  )
}
