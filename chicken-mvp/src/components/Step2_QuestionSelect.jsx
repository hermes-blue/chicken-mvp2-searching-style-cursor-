import { useState } from 'react'
import { brands, questions } from '../data'
import Card from './Card'

export default function Step2_QuestionSelect({ brandId, onSelect, onBack }) {
  const [expanded, setExpanded] = useState(null)
  const brand = brands.find(b => b.id === brandId)

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col px-5 py-10">
      {/* 뒤로가기 */}
      <button onClick={onBack} className="text-zinc-500 text-sm mb-6 flex items-center gap-1 hover:text-zinc-300 transition-colors w-fit">
        ← 브랜드 다시 선택
      </button>

      {/* 헤더 */}
      <div className="mb-8">
        <p className="text-orange-400 text-sm font-semibold tracking-widest mb-2">STEP 2</p>
        <h1 className="text-white text-2xl font-black leading-tight">
          <span className="text-orange-400">{brand?.name}</span>에 대해<br />뭐가 궁금한가요?
        </h1>
        <p className="text-zinc-500 text-sm mt-2">하나만 골라서 파고드세요</p>
      </div>

      {/* 카드 목록 */}
      <div className="flex flex-col gap-3">
        {questions.map((q, i) => (
          <Card
            key={q.id}
            title={q.title}
            stat={q.stat}
            hook={q.hook}
            expanded={expanded === i}
            onClick={() => setExpanded(expanded === i ? null : i)}
            onNext={() => onSelect(q.id)}
            nextLabel={`"${q.title}" 파고들기 →`}
          />
        ))}
      </div>
    </div>
  )
}
