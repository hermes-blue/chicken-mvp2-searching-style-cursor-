import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import { screens } from "../src/data.js"

const __dir = dirname(fileURLToPath(import.meta.url))
const root = join(__dir, "..")
const news = JSON.parse(
  fs.readFileSync(join(root, "src", "news-copy-candidates.json"), "utf8")
)

/** s0 랜딩 카드 title → news JSON brand 키 */
const s0TitleToNewsBrand = {
  교촌치킨: "교촌치킨",
  "비비큐(BBQ)": "BBQ치킨",
  "BHC치킨": "BHC",
  푸라닭치킨: "푸라닭",
}

const screenIdToDefaultBrand = {
  s0: null,
  sbhc0: "BHC",
  s1: "BHC",
  s5: "BHC",
  s9: "BHC",
  s13: "BHC",
  sgyo0: "교촌치킨",
  sgyo1: "교촌치킨",
  sgyo5: "교촌치킨",
  sgyo9: "교촌치킨",
  sgyo13: "교촌치킨",
  sbbq0: "BBQ치킨",
  sbbq1: "BBQ치킨",
  sbbq5: "BBQ치킨",
  sbbq9: "BBQ치킨",
  sbbq13: "BBQ치킨",
  spura0: "푸라닭",
  spura1: "푸라닭",
  spura5: "푸라닭",
  spura9: "푸라닭",
  spura13: "푸라닭",
}

/** 카드·화면 → 선호 뉴스 category (복수) */
function preferredCategories({ screenKey, flowTitle, cardTitle }) {
  const t = cardTitle
  if (t === "브랜드 파워" || t.includes("해볼 만할까") && !t.includes("얼마"))
    return ["brand", "store", "product"]
  if (t === "초보자 난이도") return ["store", "law", "franchise"]
  if (t === "경쟁 강도") return ["market", "store"]
  if (t === "폐업 위험도" || flowTitle === "어디서 망하나?")
    return ["market", "law", "franchise", "price", "store"]
  if (flowTitle === "얼마 드나?" || ["가맹비", "인테리어", "장비/설비", "숨겨진 비용"].includes(t))
    return ["franchise", "price", "cost", "store"]
  if (
    ["재료비", "인건비", "임대료", "광고비", "실제 순이익", "얼마 남나?"].some((x) => t.includes(x)) ||
    flowTitle === "얼마 남나?"
  ) {
    return ["cost", "price", "market", "franchise", "product", "store"]
  }
  return ["brand", "franchise", "price", "market", "store", "law", "product", "cost"]
}

function poolFor(brand) {
  return news.filter((n) => n.brand === brand)
}

function uniqueCopyByCategory(brand) {
  const p = poolFor(brand)
  const by = {}
  for (const n of p) {
    const c = n.category || "other"
    if (!by[c]) by[c] = new Map()
    if (n.copyLine) by[c].set(n.copyLine, n)
  }
  return by
}

const cache = {}
function linesFor(brand) {
  if (!cache[brand]) cache[brand] = uniqueCopyByCategory(brand)
  return cache[brand]
}

function pickLine(brand, categories, usedKey, fallbackAll) {
  for (const cat of categories) {
    const m = linesFor(brand)[cat]
    if (!m) continue
    const lines = [...m.keys()].filter((l) => !fallbackAll._skip?.has(l))
    if (lines.length) {
      const i = usedKey % lines.length
      return { line: lines[i], category: cat }
    }
  }
  const all = poolFor(brand)
    .map((n) => n.copyLine)
    .filter(Boolean)
  const unique = [...new Set(all)]
  if (!unique.length) return { line: "(해당 브랜드 뉴스 없음)", category: "—" }
  const j = usedKey % unique.length
  return { line: unique[j], category: "any" }
}

const rows = []
let idx = 0
for (const [screenKey, flow] of Object.entries(screens)) {
  if (!flow.cards) continue
  const flowTitle = flow.title || ""
  const defBrand = screenIdToDefaultBrand[screenKey]

  for (const card of flow.cards) {
    if (!card.insights) continue
    const cardTitle = card.title

    const brandKeyToNews = {
      BHC치킨: "BHC",
      교촌치킨: "교촌치킨",
      "비비큐(BBQ)": "BBQ치킨",
      푸라닭치킨: "푸라닭",
    }
    const brandFromCard =
      screenKey === "s0"
        ? s0TitleToNewsBrand[cardTitle]
        : card.brandKey
          ? brandKeyToNews[card.brandKey]
          : defBrand

    const brand = brandFromCard || defBrand
    if (!brand) continue

    const cats = preferredCategories({ screenKey, flowTitle, cardTitle })

    card.insights.forEach((ins, insIdx) => {
      idx += 1
      const ukey = idx + insIdx * 7 + (cardTitle?.length || 0)
      const { line, category: picked } = pickLine(brand, cats, ukey, {})
      const before = ins.text
      const after = line
      rows.push({
        no: idx,
        screen: screenKey,
        flow: flowTitle,
        card: cardTitle,
        brand,
        dot: ins.dot,
        before,
        after,
        newsCategory: picked,
        hadSource: Boolean(ins.source),
        sourceLabel: ins.source || "—",
      })
    })
  }
}

// Markdown
const lines = [
  "# 인사이트 교체 후보 (뉴스 copyLine 제안)",
  "",
  "자동 매핑: 화면·카드 제목 → `news-copy-candidates.json`의 `category`·`copyLine` 휴리스틱. **내용은 달라도 됨** / 문체(`~이에요`, 짧은 두 문장)는 뉴스 쪽이 이미 구어체.",
  "",
  `총 ${rows.length}줄 (data.js 인사이트 전체).`,
  "",
  "| no | screen | flow | card | brand | dot | 교체전 | 교체후 (copyLine) | 뉴스 cat | 기존 source |",
  "|----|--------|------|------|-------|-----|--------|-------------------|----------|-------------|",
]

for (const r of rows) {
  const esc = (s) =>
    String(s)
      .replace(/\|/g, "\\|")
      .replace(/\n/g, " ")
  lines.push(
    `| ${r.no} | ${r.screen} | ${esc(r.flow)} | ${esc(r.card)} | ${r.brand} | ${r.dot} | ${esc(r.before)} | ${esc(r.after)} | ${r.newsCategory} | ${esc(r.sourceLabel)} |`
  )
}

const out = join(root, "src", "insight-replacement-candidates.md")
fs.writeFileSync(out, lines.join("\n"), "utf8")
console.log("Wrote", out, "rows", rows.length)
