const valColorMap = {
  green: '#4eca7a',
  red: '#e84a5f',
  yellow: '#f0a830',
}

const tagStyles = {
  warn: { background: '#1e1414', color: '#e84a5f', border: '0.5px solid #3a2020' },
  ok:   { background: '#141e14', color: '#4eca7a', border: '0.5px solid #203a20' },
  neu:  { background: '#1a1d24', color: '#888',    border: '0.5px solid #2a2e3a' },
}

export default function Card({ data, selected, onToggle, onNavigate }) {
  const { title, hint, val, valColor, row1Val, row1Label, tags, text, qBtn } = data

  return (
    <div
      onClick={onToggle}
      style={{
        background: selected ? '#1c2030' : '#1a1d24',
        border: `0.5px solid ${selected ? '#3a4060' : '#2a2e3a'}`,
        borderRadius: 14,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color .2s',
      }}
    >
      {/* 상단 헤더 */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 16px',
      }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 500, color: '#ddd' }}>{title}</div>
          {!selected && (
            <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>{hint}</div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: valColorMap[valColor] }}>{val}</span>
          <span style={{
            fontSize: 13, color: '#444',
            display: 'inline-block',
            transform: selected ? 'rotate(90deg)' : 'none',
            transition: 'transform .2s',
          }}>›</span>
        </div>
      </div>

      {/* 확장 영역 */}
      <div style={{
        maxHeight: selected ? 260 : 0,
        overflow: 'hidden',
        transition: 'max-height .25s ease',
      }}>
        <div style={{ padding: '0 16px 14px', borderTop: '0.5px solid #22273a' }}>
          {/* row1 */}
          <div style={{ padding: '10px 0 8px', borderBottom: '0.5px solid #1e2230' }}>
            <div style={{ fontSize: 22, fontWeight: 500, color: '#eee' }}>{row1Val}</div>
            <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>{row1Label}</div>
          </div>

          {/* row2: 태그 */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', padding: '8px 0', borderBottom: '0.5px solid #1e2230' }}>
            {tags.map((tag, i) => (
              <span key={i} style={{
                fontSize: 10, padding: '3px 8px', borderRadius: 6,
                ...tagStyles[tag.type],
              }}>{tag.label}</span>
            ))}
          </div>

          {/* row3: 설명 + 버튼 */}
          <div style={{ padding: '8px 0 0' }}>
            <div style={{ fontSize: 12, color: '#777', lineHeight: 1.5, marginBottom: 8 }}>{text}</div>
            {qBtn && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (qBtn.target) onNavigate(qBtn.target)
                }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  background: '#111520', border: '0.5px solid #2a2e3a',
                  borderRadius: 8, padding: '9px 12px',
                  fontSize: 12, color: '#7788bb', cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#161c2e'
                  e.currentTarget.style.borderColor = '#3a4466'
                  e.currentTarget.style.color = '#99aadd'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#111520'
                  e.currentTarget.style.borderColor = '#2a2e3a'
                  e.currentTarget.style.color = '#7788bb'
                }}
              >
                {qBtn.label}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
