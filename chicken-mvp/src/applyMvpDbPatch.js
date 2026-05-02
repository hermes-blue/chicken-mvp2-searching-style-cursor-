const INTERNAL_PATCH_KEYS = new Set(['_meta'])

function mergeCard(baseCard, patchCard) {
  if (!patchCard) return baseCard

  const visiblePatchEntries = Object.entries(patchCard).filter(
    ([key, value]) => !INTERNAL_PATCH_KEYS.has(key) && value !== undefined,
  )

  return {
    ...baseCard,
    ...Object.fromEntries(visiblePatchEntries),
    _meta: patchCard._meta ?? baseCard._meta,
  }
}

export function applyMvpDbPatch(baseScreens, patchPayload) {
  const patchScreens = patchPayload?.patches ?? {}

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
            mergeCard(card, screenPatch.cardsByTitle[card.title]),
          ),
        },
      ]
    }),
  )
}
