const INTERNAL_PATCH_KEYS = new Set(['_meta'])

function normalizeBrandName(value = '') {
  return String(value).replace(/\s+/g, '').toLowerCase()
}

function buildBrandLookup(brandMetricColumns = {}) {
  return Object.fromEntries(
    Object.entries(brandMetricColumns).flatMap(([brandKey, metrics]) => {
      const names = [brandKey, metrics.displayName, ...(metrics.aliases ?? [])]
      return names
        .filter(Boolean)
        .map((name) => [normalizeBrandName(name), { brandKey, metrics }])
    }),
  )
}

function mergeScreenPatchPayloads(screenPatchPayloads = []) {
  return screenPatchPayloads.reduce((merged, payload) => {
    const patches = payload?.patches ?? {}

    for (const [screenKey, screenPatch] of Object.entries(patches)) {
      const currentScreenPatch = merged[screenKey] ?? {}
      const currentCards = currentScreenPatch.cardsByTitle ?? {}
      const nextCards = screenPatch.cardsByTitle ?? {}

      merged[screenKey] = {
        ...currentScreenPatch,
        ...screenPatch,
        cardsByTitle: Object.fromEntries(
          Object.entries({
            ...currentCards,
            ...nextCards,
          }).map(([cardTitle, cardPatch]) => [
            cardTitle,
            {
              ...(currentCards[cardTitle] ?? {}),
              ...cardPatch,
              _meta: {
                ...(currentCards[cardTitle]?._meta ?? {}),
                ...(cardPatch?._meta ?? {}),
              },
            },
          ]),
        ),
      }
    }

    return merged
  }, {})
}

function findBrandMetrics(card, brandLookup) {
  const candidates = [card.brandKey, card.title]

  for (const candidate of candidates) {
    const match = brandLookup[normalizeBrandName(candidate)]
    if (match) return match
  }

  return null
}

function mergeCard(baseCard, patchCard, brandLookup) {
  const brandMatch = findBrandMetrics(baseCard, brandLookup)
  const nextMeta = {
    ...(baseCard._meta ?? {}),
    ...(patchCard?._meta ?? {}),
    ...(brandMatch
      ? { brandKey: brandMatch.brandKey, brandMetrics: brandMatch.metrics }
      : {}),
  }

  if (!patchCard) {
    return Object.keys(nextMeta).length
      ? { ...baseCard, _meta: nextMeta }
      : baseCard
  }

  const visiblePatchEntries = Object.entries(patchCard).filter(
    ([key, value]) => !INTERNAL_PATCH_KEYS.has(key) && value !== undefined,
  )

  return {
    ...baseCard,
    ...Object.fromEntries(visiblePatchEntries),
    _meta: nextMeta,
  }
}

export function applyMvpDbPatch(baseScreens, patchPayload) {
  const screenPatchPayloads = Array.isArray(patchPayload?.screenPatches)
    ? patchPayload.screenPatches
    : [patchPayload?.screenPatches ?? patchPayload]
  const patchScreens = mergeScreenPatchPayloads(screenPatchPayloads)
  const brandLookup = buildBrandLookup(patchPayload?.brandMetricColumns)

  return Object.fromEntries(
    Object.entries(baseScreens).map(([screenKey, screen]) => {
      const screenPatch = patchScreens[screenKey]

      if (!screenPatch?.cardsByTitle || !Array.isArray(screen.cards)) {
        return [screenKey, screen]
      }

      return [
        screenKey,
        {
          ...screen,
          cards: screen.cards.map((card) =>
            mergeCard(card, screenPatch.cardsByTitle[card.title], brandLookup),
          ),
        },
      ]
    }),
  )
}
