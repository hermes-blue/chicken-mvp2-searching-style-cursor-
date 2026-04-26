const ALLOWED_BRANDS = new Set([
  '교촌치킨',
  'BHC치킨',
  '비비큐(BBQ)',
  '푸라닭치킨',
])

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
        text: `${brandName} 창업비용을 딱 하나의 숫자로만 답해줘. 단위는 억원으로. 예: 2.2억. 범위 말고 대표값 하나만.`,
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

    const cost = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    if (!cost) {
      return res.status(502).json({ error: 'Gemini response did not include a cost' })
    }

    return res.status(200).json({ cost })
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Unexpected error' })
  }
}
