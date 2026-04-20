import { useState, useEffect } from 'react'

// valColor → accent 색상 매핑
const ACCENT_MAP = {
  green:  { color: '#3DBFB8', glow: 'rgba(61,191,184,0.12)',  border: 'rgba(61,191,184,0.25)'  },
  yellow: { color: '#C9A365', glow: 'rgba(201,163,101,0.12)', border: 'rgba(201,163,101,0.25)' },
  red:    { color: '#E05A4E', glow: 'rgba(224,90,78,0.12)',   border: 'rgba(224,90,78,0.25)'   },
}
const DEFAULT_ACCENT = { color: '#9B7FE8', glow: 'rgba(155,127,232,0.12)', border: 'rgba(155,127,232,0.25)' }

const TAG_STYLES = {
  warn: { background: 'rgba(224,90,78,0.10)',   color: '#E05A4E', border: '1px solid rgba(224,90,78,0.25)'   },
  ok:   { background: 'rgba(61,191,184,0.10)',  color: '#3DBFB8', border: '1px solid rgba(61,191,184,0.25)'  },
  neu:  { background: 'var(--color-bg-subtle)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border-default)' },
}

export default function Card({ data, index = 0, selected, onToggle, onNavigate }) {
  const { title, hint, val, valColor, row1Val, row1Label, tags, text, qBtn } = data
  const [pressed, setPressed] = useState(false)
  const [btnPressed, setBtnPressed] = useState(false)
  const [visible, setVisible] = useState(false)

  const ac = ACCENT_MAP[valColor] ?? DEFAULT_ACCENT

  // 스태거 fadeUp
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 60)
    return () => clearTimeout(t)
  }, [index])

  return (
    <div
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => { setPressed(false); onToggle() }}
      onPointerLeave={() => setPressed(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: pressed || selected ? 'var(--color-bg-card-hover)' : 'var(--color-bg-card)',
        border: `1px solid ${selected || pressed ? 'var(--color-border-hover)' : 'var(--color-border-default)'}`,
        borderRadius: 'var(--radius-card)',
        cursor: 'pointer',
        transform: `${pressed ? 'scale(0.97)' : 'scale(1)'} translateY(${visible ? '0px' : '16px'})`,
        opacity: visible ? 1 : 0,
        transition: pressed
          ? 'transform 0.12s ease, background 0.12s ease, border-color 0.12s ease'
          : 'transform 0.15s ease, background 0.15s ease, border-color 0.15s ease, opacity 0.4s ease',
        boxShadow: 'var(--shadow-card)',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {/* 코너 glow */}
      <div style={{
        position: 'absolute',
        bottom: -30, right: -30,
        width: 80, height: 80,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${ac.glow.replace('0.12', '0.18')} 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* 상단 헤더 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '18px 18px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1, minWidth: 0 }}>
          {/* accent dot */}
          <div style={{
            width: 6, height: 6,
            borderRadius: '50%',
            background: ac.color,
            boxShadow: `0 0 8px ${ac.color}80`,
            marginTop: 6,
            flexShrink: 0,
          }} />

          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: 15,
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.3px',
            }}>
              {title}
            </div>
            {!selected && (
              <div style={{
                fontSize: 11,
                color: 'var(--color-text-muted)',
                marginTop: 3,
                fontWeight: 300,
              }}>
                {hint}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, marginLeft: 12 }}>
          {/* 수치 — DM Serif */}
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 17,
            color: ac.color,
            letterSpacing: '-0.3px',
          }}>
            {val}
          </span>
          <svg
            width="14" height="14" viewBox="0 0 14 14" fill="none"
            style={{
              opacity: 0.3,
              transform: selected ? 'rotate(90deg)' : 'none',
              transition: 'transform 0.2s ease',
            }}
          >
            <path d="M2 7h10M7 2l5 5-5 5" stroke="#F5F0E8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* 확장 영역 */}
      <div style={{
        maxHeight: selected ? 320 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div style={{
          padding: '0 18px 18px',
          borderTop: '1px solid var(--color-border-default)',
        }}>
          {/* row1: 큰 수치 — DM Serif */}
          <div style={{
            padding: '14px 0 12px',
            borderBottom: '1px solid var(--color-border-default)',
          }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 36,
              color: 'var(--color-text-primary)',
              lineHeight: 0.95,
              letterSpacing: '-0.5px',
            }}>
              {row1Val}
            </div>
            <div style={{
              fontSize: 11,
              fontWeight: 300,
              color: 'var(--color-text-muted)',
              marginTop: 6,
            }}>
              {row1Label}
            </div>
          </div>

          {/* row2: 태그 */}
          <div style={{
            display: 'flex',
            gap: 6,
            flexWrap: 'wrap',
            padding: '10px 0',
            borderBottom: '1px solid var(--color-border-default)',
          }}>
            {tags.map((tag, i) => (
              <span key={i} style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: '0.06em',
                padding: '3px 9px',
                borderRadius: 'var(--radius-badge)',
                ...TAG_STYLES[tag.type],
              }}>
                {tag.label}
              </span>
            ))}
          </div>

          {/* row3: 설명 + 버튼 */}
          <div style={{ paddingTop: 10 }}>
            {/* insight 블록 */}
            <div style={{
              padding: '12px 14px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.04)',
              borderLeft: `3px solid ${ac.color}`,
              marginBottom: 10,
            }}>
              <p style={{
                fontSize: 12,
                fontWeight: 300,
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.7,
                margin: 0,
              }}>
                {text}
              </p>
            </div>

            {qBtn && (
              <button
                onPointerDown={(e) => { e.stopPropagation(); setBtnPressed(true) }}
                onPointerUp={(e) => {
                  e.stopPropagation()
                  setBtnPressed(false)
                  if (qBtn.target) onNavigate(qBtn.target)
                }}
                onPointerLeave={(e) => { e.stopPropagation(); setBtnPressed(false) }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  background: btnPressed ? ac.color : ac.color,
                  border: 'none',
                  borderRadius: 'var(--radius-button)',
                  padding: '13px 16px',
                  fontFamily: 'var(--font-korean)',
                  fontSize: 14,
                  fontWeight: 900,
                  color: '#0A0907',
                  cursor: 'pointer',
                  transform: btnPressed ? 'scale(0.97)' : 'scale(1)',
                  transition: 'transform 0.12s ease, opacity 0.12s ease',
                  opacity: btnPressed ? 0.85 : 1,
                }}
              >
                <span>{qBtn.label}</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M1 7h12M7 1l6 6-6 6" stroke="#0A0907" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
