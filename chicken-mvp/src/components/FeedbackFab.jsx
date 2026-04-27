import { useCallback, useEffect, useState } from 'react'

const OVERALL_OPTIONS = [
  '오 꽤 유용했는데? 👍',
  '그냥 심심해서 해봤어 😐',
  '솔직히 좀 구렸어... 미안 😬',
]

const REASON_OPTIONS = [
  '숫자를 믿기 어려웠어',
  '검색하면 더 잘 나올 것 같아',
  '브랜드가 너무 적어',
  '내가 궁금한 게 없었어',
  '딱히 없어 잘 됐어',
]

export default function FeedbackFab() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState('form')
  const [overall, setOverall] = useState(null)
  const [reasons, setReasons] = useState(() => new Set())
  const [comment, setComment] = useState('')

  const closeSheet = useCallback(() => {
    setOpen(false)
    setStep('form')
    setOverall(null)
    setReasons(new Set())
    setComment('')
  }, [])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') closeSheet() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, closeSheet])

  const toggleReason = (label) => {
    setReasons((prev) => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  const submit = () => {
    if (!overall) return
    const payload = {
      overall,
      reasonsNegative: Array.from(reasons),
      comment: comment.trim() || null,
      at: new Date().toISOString(),
    }
    console.log('[feedback]', payload)
    setStep('thanks')
  }

  const fabRight = 'max(12px, calc((100vw - 390px) / 2 + 12px))'
  const fabBottom = 'calc(32px + 12px + env(safe-area-inset-bottom, 0px))'

  const chipBase = (active) => ({
    fontFamily: 'var(--font-korean)',
    fontSize: 13,
    lineHeight: 1.45,
    padding: '12px 14px',
    borderRadius: 'var(--radius-button)',
    border: `1px solid ${active ? 'var(--color-accent-gold-border)' : 'var(--color-border-default)'}`,
    background: active ? 'var(--color-accent-gold-tint)' : 'var(--color-bg-card)',
    color: active ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background 0.15s ease, border-color 0.15s ease',
  })

  return (
    <>
      {/* 플로팅 버튼 */}
      <div
        className="feedback-fab-group"
        style={{
          position: 'fixed',
          right: fabRight,
          bottom: fabBottom,
          zIndex: 1000,
          width: 52,
          height: 52,
        }}
      >
        <div
          className="feedback-fab-tooltip"
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: 10,
            padding: '10px 12px',
            borderRadius: 12,
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border-hover)',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-korean)',
            fontSize: 12,
            lineHeight: 1.45,
            whiteSpace: 'nowrap',
            boxShadow: 'var(--shadow-card)',
            pointerEvents: 'none',
          }}
        >
          구렸어? 칭찬해줘도 돼 🙏
          <span
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '7px solid transparent',
              borderRight: '7px solid transparent',
              borderTop: '7px solid var(--color-border-hover)',
            }}
          />
        </div>

        <div style={{ position: 'relative', width: 52, height: 52 }}>
          <span
            className="feedback-fab-ring"
            aria-hidden
          />
          <span
            className="feedback-fab-ring feedback-fab-ring-delay"
            aria-hidden
          />
          <button
            type="button"
            aria-label="피드백 보내기"
            onClick={() => { setOpen(true); setStep('form') }}
            className="feedback-fab-btn"
            style={{
              position: 'relative',
              width: 52,
              height: 52,
              borderRadius: '50%',
              border: '1px solid var(--color-accent-gold-border)',
              background: 'linear-gradient(165deg, rgba(201,163,101,0.18) 0%, rgba(17,16,16,0.98) 55%)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              zIndex: 2,
            }}
          >
            <span className="feedback-fab-emoji" style={{ fontSize: 26, lineHeight: 1, display: 'block' }} role="img" aria-hidden>
              🍗
            </span>
          </button>
        </div>
      </div>

      {/* 바텀시트 */}
      {open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1002,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <button
            type="button"
            aria-label="닫기"
            onClick={closeSheet}
            style={{
              position: 'absolute',
              inset: 0,
              border: 'none',
              margin: 0,
              padding: 0,
              background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(4px)',
              cursor: 'pointer',
            }}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-sheet-title"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 390,
              maxHeight: '88dvh',
              overflow: 'auto',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              background: 'var(--color-bg-base)',
              border: '1px solid var(--color-border-default)',
              borderBottom: 'none',
              boxShadow: '0 -8px 40px rgba(0,0,0,0.5)',
              padding: '20px 18px calc(20px + env(safe-area-inset-bottom, 0px))',
              zIndex: 1,
            }}
          >
            {step === 'form' ? (
              <>
                <p
                  id="feedback-sheet-title"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 22,
                    color: 'var(--color-text-primary)',
                    margin: '0 0 18px',
                    lineHeight: 1.25,
                  }}
                >
                  솔직히 쓸만했어? 🍗
                </p>

                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-faint)', marginBottom: 10 }}>
                  한 줄 평
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
                  {OVERALL_OPTIONS.map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setOverall(label)}
                      style={chipBase(overall === label)}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-faint)', marginBottom: 10 }}>
                  구렸으면 왜 구렸어? (복수 선택)
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                  {REASON_OPTIONS.map((label) => {
                    const on = reasons.has(label)
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => toggleReason(label)}
                        style={{
                          ...chipBase(on),
                          padding: '9px 12px',
                          fontSize: 12,
                          flex: '1 1 calc(50% - 4px)',
                          minWidth: 'calc(50% - 4px)',
                        }}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>

                <label style={{ display: 'block', marginBottom: 8 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-faint)' }}>
                    한 마디만 털어놔봐 (선택)
                  </span>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    placeholder="적고 싶을 때만 적어도 돼요"
                    style={{
                      display: 'block',
                      width: '100%',
                      marginTop: 8,
                      boxSizing: 'border-box',
                      borderRadius: 'var(--radius-button)',
                      border: '1px solid var(--color-border-default)',
                      background: 'var(--color-bg-card)',
                      color: 'var(--color-text-primary)',
                      fontFamily: 'var(--font-korean)',
                      fontSize: 13,
                      padding: '12px 14px',
                      resize: 'vertical',
                      minHeight: 72,
                    }}
                  />
                </label>

                <button
                  type="button"
                  disabled={!overall}
                  onClick={submit}
                  style={{
                    width: '100%',
                    marginTop: 8,
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-button)',
                    border: 'none',
                    fontFamily: 'var(--font-korean)',
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: overall ? 'pointer' : 'not-allowed',
                    background: overall
                      ? 'linear-gradient(165deg, var(--color-accent-gold) 0%, #a8844a 100%)'
                      : 'var(--color-bg-card-hover)',
                    color: overall ? '#1a1510' : 'var(--color-text-muted)',
                    opacity: overall ? 1 : 0.7,
                    boxShadow: overall ? '0 4px 16px rgba(201, 163, 101, 0.25)' : 'none',
                  }}
                >
                  보내기
                </button>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '28px 8px 12px' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--color-text-primary)', margin: '0 0 12px', lineHeight: 1.3 }}>
                  고마워! 🍗
                </p>
                <p style={{ fontFamily: 'var(--font-korean)', fontSize: 14, color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
                  더 나은 서비스 만들게
                </p>
                <button
                  type="button"
                  onClick={closeSheet}
                  style={{
                    marginTop: 28,
                    padding: '12px 24px',
                    borderRadius: 'var(--radius-button)',
                    border: '1px solid var(--color-accent-gold-border)',
                    background: 'var(--color-accent-gold-tint)',
                    color: 'var(--color-accent-gold)',
                    fontFamily: 'var(--font-korean)',
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  닫기
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
