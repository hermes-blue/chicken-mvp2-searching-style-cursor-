import { useState } from 'react'
import { brands, questions, details } from '../data'
import Card from './Card'

export default function Step3_DetailExplore({ brandId, questionId, onBack, onReset }) {
  const [expanded, setExpanded] = useState(null)
  const brand = brands.find(b => b.id === brandId)
  const question = questions.find(q => q.id === questionId)
  const cards = details[brandId]?.[questionId] ?? []

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col px-5 py-10">
      {/* 뒤로가기 */}
      <button onClick={onBack} className="text-zinc-500 text-sm mb-6 flex items-center gap-1 hover:text-zinc-300 transition-colors w-fit">
        ← 질문 다시 선택
      </button>

      {/* 헤더 */}
      <div className="mb-8">
        <p className="text-orange-400 text-sm font-semibold tracking-widest mb-2">STEP 3</p>
        <h1 className="text-white text-2xl font-black leading-tight">
          <span className="text-orange-400">{brand?.name}</span>의<br />
          <span className="text-orange-300">"{question?.title}"</span>
        </h1>
        <p className="text-zinc-500 text-sm mt-2">4가지 핵심 포인트</p>
      </div>

      {/* 카드 목록 */}
      <div className="flex flex-col gap-3">
        {cards.map((card, i) => (
          <Card
            key={i}
            title={card.title}
            stat={card.stat}
            hook={card.hook}
            expanded={expanded === i}
            onClick={() => setExpanded(expanded === i ? null : i)}
            onNext={null}
          />
        ))}
      </div>

      {/* 처음부터 다시 */}
      <button
        onClick={onReset}
        className="mt-10 w-full py-3 rounded-xl border border-zinc-700 text-zinc-400 hover:border-orange-500 hover:text-orange-400 font-semibold text-sm transition-colors duration-200"
      >
        다른 브랜드 / 질문 보기
      </button>
    </div>
  )
}
