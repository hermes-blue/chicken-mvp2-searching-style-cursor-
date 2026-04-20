export default function Card({ title, stat, hook, expanded, onClick, onNext, nextLabel = '자세히 보기 →' }) {
  return (
    <div
      onClick={onClick}
      className={`
        relative cursor-pointer rounded-2xl border transition-all duration-300 select-none
        ${expanded
          ? 'bg-zinc-900 border-orange-500 shadow-lg shadow-orange-500/20'
          : 'bg-zinc-900/60 border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900'}
        ${expanded ? 'p-6' : 'p-5'}
      `}
    >
      {/* 제목 */}
      <p className={`font-bold text-white transition-all duration-300 ${expanded ? 'text-xl mb-4' : 'text-base mb-2'}`}>
        {title}
      </p>

      {/* 핵심 수치 */}
      <p className={`font-black text-orange-400 transition-all duration-300 ${expanded ? 'text-3xl mb-3' : 'text-lg mb-1'}`}>
        {stat}
      </p>

      {/* 현실 해석 문장 */}
      <p className={`text-zinc-300 leading-relaxed transition-all duration-300 ${expanded ? 'text-base opacity-100' : 'text-sm opacity-70 line-clamp-1'}`}>
        {hook}
      </p>

      {/* 다음 단계 버튼 */}
      {expanded && onNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="mt-5 w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm transition-colors duration-200"
        >
          {nextLabel}
        </button>
      )}

      {/* 축소 상태 화살표 힌트 */}
      {!expanded && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 text-lg">›</span>
      )}
    </div>
  )
}
