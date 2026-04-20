import { useState } from 'react'
import { brands } from '../data'
import Card from './Card'

export default function Step1_BrandSelect({ onSelect }) {
  const [expanded, setExpanded] = useState(null)

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col px-5 py-10">
      {/* 헤더 */}
      <div className="mb-8">
        <p className="text-orange-400 text-sm font-semibold tracking-widest mb-2">STEP 1</p>
        <h1 className="text-white text-2xl font-black leading-tight">
          어떤 브랜드를<br />알아보고 싶나요?
        </h1>
        <p className="text-zinc-500 text-sm mt-2">카드를 눌러서 확인하세요</p>
      </div>

      {/* 카드 목록 */}
      <div className="flex flex-col gap-3">
        {brands.map((brand, i) => (
          <Card
            key={brand.id}
            title={`${brand.name}  ·  ${brand.tag}`}
            stat={brand.stat}
            hook={brand.hook}
            expanded={expanded === i}
            onClick={() => setExpanded(expanded === i ? null : i)}
            onNext={() => onSelect(brand.id)}
            nextLabel={`${brand.name} 파고들기 →`}
          />
        ))}
      </div>
    </div>
  )
}
