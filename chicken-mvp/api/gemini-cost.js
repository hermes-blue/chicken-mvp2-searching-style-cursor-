const ALLOWED_BRANDS = new Set([
  '교촌치킨',
  'BHC치킨',
  '비비큐(BBQ)',
  '푸라닭치킨',
])

function parseCostToManwon(text = '') {
  const normalized = String(text).replace(/,/g, '').replace(/\s+/g, '')
  const rangeMatch = normalized.match(/(\d+(?:\.\d+)?)억~(\d+(?:\.\d+)?)억/)
  if (rangeMatch) {
    return Math.round(((Number(rangeMatch[1]) + Number(rangeMatch[2])) / 2) * 10000)
  }

  const eokMatch = normalized.match(/(\d+(?:\.\d+)?)억/)
  const cheonMatch = normalized.match(/(\d+(?:\.\d+)?)천/)
  const manMatch = normalized.match(/(\d+(?:\.\d+)?)만/)

  let total = 0
  if (eokMatch) total += Number(eokMatch[1]) * 10000
  if (cheonMatch) total += Number(cheonMatch[1]) * 1000
  if (manMatch) total += Number(manMatch[1])
  if (total > 0) return Math.round(total)

  const numeric = normalized.match(/(\d+(?:\.\d+)?)/)
  if (!numeric) return null
  const value = Number(numeric[1])
  return value < 100 ? Math.round(value * 10000) : Math.round(value)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { brandName } = req.body ?? {}
  if (!ALLOWED_BRANDS.has(brandName)) {
    return res.status(400).json({ error: 'Unsupported brand' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key is not configured' })
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`
  const body = {
    contents: [{
      parts: [{
        text: `${brandName} 창업비용을 대표값 하나로 추정해서 JSON만 답해줘. 형식: {"costText":"2.2억","totalManwon":22000}. costText는 억 단위 한국어 짧은 표기, totalManwon은 만원 단위 숫자.`,
      }],
    }],
  }

  try {
    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await geminiRes.json()
    if (!geminiRes.ok) {
      return res.status(geminiRes.status).json({
        error: data.error?.message ?? 'Gemini request failed',
      })
    }

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    if (!rawText) {
      return res.status(502).json({ error: 'Gemini response did not include a cost' })
    }

    const jsonText = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim()
    let parsed = null
    try {
      parsed = JSON.parse(jsonText)
    } catch {
      parsed = null
    }

    const costText = parsed?.costText ? String(parsed.costText).trim() : rawText
    const totalManwon = Number.isFinite(parsed?.totalManwon)
      ? Math.round(parsed.totalManwon)
      : parseCostToManwon(costText)

    if (!totalManwon) {
      return res.status(502).json({ error: 'Gemini response could not be parsed as a cost' })
    }

    return res.status(200).json({ costText, totalManwon })
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Unexpected error' })
  }
}
