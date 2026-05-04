function formatManwon(value) {
  if (value === undefined || value === null) return null
  return Number(value).toLocaleString('ko-KR')
}

function formatEokManwon(manwon) {
  if (manwon === undefined || manwon === null) return null
  const eok = Math.floor(manwon / 10000)
  const rest = manwon % 10000
  if (!eok) return `${formatManwon(rest)}만원`
  if (!rest) return `${eok}억`
  return `${eok}억 ${formatManwon(rest)}만원`
}

function formatShortEokManwon(manwon) {
  if (manwon === 15000) return '1억 5천'
  const fullText = formatEokManwon(manwon)
  return fullText?.replace(/만원$/, '만') ?? null
}

function homeCardPatch(brandKey, metrics) {
  if (brandKey === '교촌치킨') {
    return {
      row1Val: `가맹점 수 ${formatManwon(metrics.storeCount)}개`,
      row1Label: `평균매출 ${formatEokManwon(metrics.averageSalesManwon)} · 총 창업비용 ${formatEokManwon(metrics.totalStartupCostManwon)}`,
    }
  }

  if (brandKey === '비비큐(BBQ)') {
    return {
      row1Val: `공식 부담금 ${formatManwon(metrics.officialBurdenManwon)}만원`,
      row1Label: '공정위 정보공개서 기준 초기 부담금 · 임대비 별도',
    }
  }

  if (brandKey === 'BHC치킨') {
    return {
      row1Val: `가맹비 ${formatManwon(metrics.franchiseFeeManwon)}만원`,
      row1Label: '공정위 정보공개서 기준 가맹비 · 총비용은 추가 확인 필요',
    }
  }

  if (brandKey === '푸라닭치킨') {
    return {
      row1Val: `가맹점 수 ${formatManwon(metrics.storeCount)}개`,
      row1Label: '공정위 정보공개서 기준 가맹점 수 · 소비자원 만족도 조사 대상 외',
    }
  }

  return null
}

function startupCostCardPatch(brandKey, metrics) {
  if (brandKey === '교촌치킨') {
    return {
      val: formatShortEokManwon(metrics.totalStartupCostManwon),
      row1Val: `총 ${formatEokManwon(metrics.totalStartupCostManwon)}`,
      row1Label: '공정위 정보공개서 기준 총 예상 창업비용',
    }
  }

  if (brandKey === 'BHC치킨') {
    return {
      val: formatShortEokManwon(metrics.totalStartupCostManwon),
      row1Val: `총 ${formatEokManwon(metrics.totalStartupCostManwon)}`,
      row1Label: '공정위 기반 비용 항목과 예비비를 함께 확인해야 합니다',
    }
  }

  if (brandKey === '비비큐(BBQ)') {
    return {
      val: `${formatManwon(metrics.officialBurdenManwon)}만`,
      row1Val: `공식 부담금 ${formatManwon(metrics.officialBurdenManwon)}만원`,
      row1Label: '공정위 정보공개서 기준 부담금 · 임대비와 예비비 별도',
    }
  }

  if (brandKey === '푸라닭치킨') {
    return {
      row1Val: `가맹비 ${formatManwon(metrics.franchiseFeeManwon)}만원`,
      row1Label: '공정위 정보공개서 기준 가맹비 · 총 창업비용은 항목별 확인 필요',
    }
  }

  return null
}

const STARTUP_COST_SCREENS = {
  '교촌치킨': 'sgyo0',
  'BHC치킨': 'sbhc0',
  '비비큐(BBQ)': 'sbbq0',
  '푸라닭치킨': 'spura0',
}

const BRAND_POWER_SCREENS = {
  '교촌치킨': 'sgyo1',
  'BHC치킨': 's1',
  '비비큐(BBQ)': 'sbbq1',
  '푸라닭치킨': 'spura1',
}

const COST_DETAIL_SCREENS = {
  '교촌치킨': 'sgyo5',
  'BHC치킨': 's5',
  '비비큐(BBQ)': 'sbbq5',
  '푸라닭치킨': 'spura5',
}

function brandPowerCardPatch(metrics) {
  if (!metrics.storeCount) return null

  return {
    row1Val: `가맹점 수 ${formatManwon(metrics.storeCount)}개`,
    row1Label: '공정위 정보공개서 기준 가맹점 수',
  }
}

function franchiseFeePatch(metrics) {
  if (!metrics.franchiseFeeManwon) return null

  return {
    val: `${formatManwon(metrics.franchiseFeeManwon)}만원`,
    row1Val: `${formatManwon(metrics.franchiseFeeManwon)}만원 일시납`,
    row1Label: '공정위 정보공개서 기준 가맹비',
  }
}

function interiorPatch(brandKey, metrics) {
  if (!metrics.interiorCostManwon) return null

  const prefix = brandKey === '비비큐(BBQ)' ? '15평 기준 ' : brandKey === '푸라닭치킨' ? '33㎡ 기준 ' : ''
  const label = brandKey === '비비큐(BBQ)'
    ? '공정위 정보공개서 기준 올리브치킨 타입 인테리어비'
    : '공정위 정보공개서 기준 인테리어비'

  return {
    val: `${formatManwon(metrics.interiorCostManwon)}만원`,
    row1Val: `${prefix}${formatManwon(metrics.interiorCostManwon)}만원`,
    row1Label: label,
  }
}

function equipmentPatch(metrics) {
  if (!metrics.equipmentCostManwon) return null

  return {
    val: `${formatManwon(metrics.equipmentCostManwon)}만원`,
    row1Val: `${formatManwon(metrics.equipmentCostManwon)}만원`,
    row1Label: '공정위 정보공개서 기준 올리브치킨 타입 주방기기·집기',
  }
}

function hiddenCostPatch(brandKey, metrics) {
  if (metrics.depositManwon === undefined || metrics.depositManwon === null) return null

  if (brandKey === '교촌치킨') {
    return {
      row1Val: `보증금 ${formatManwon(metrics.depositManwon)}만 + 예비금 별도`,
      row1Label: '공정위 정보공개서 기준 보증금 · 임대보증금과 권리금 별도',
    }
  }

  if (brandKey === '비비큐(BBQ)') {
    return {
      row1Val: `보증금 ${formatManwon(metrics.depositManwon)}만 + 예비금 별도`,
      row1Label: '공정위 정보공개서 기준 보증금 · 전기·가스·냉난방 별도',
    }
  }

  if (brandKey === '푸라닭치킨') {
    return {
      row1Val: '보증금 없음 + 운영 예비금 별도',
      row1Label: '공정위 정보공개서 기준 보증금 없음 · 서울보증보험 가입 대체',
    }
  }

  return null
}

function costDetailCardPatches(brandKey, metrics) {
  return Object.fromEntries(
    [
      ['가맹비', franchiseFeePatch(metrics)],
      ['인테리어', interiorPatch(brandKey, metrics)],
      ['장비/설비', equipmentPatch(metrics)],
      ['숨겨진 비용', hiddenCostPatch(brandKey, metrics)],
    ].filter(([, patch]) => patch),
  )
}

export function buildMetricScreenPatches(brandMetricColumns = {}) {
  const homeCards = Object.fromEntries(
    Object.entries(brandMetricColumns)
      .map(([brandKey, metrics]) => {
        const patch = homeCardPatch(brandKey, metrics)
        return patch
          ? [brandKey, { ...patch, _meta: { origin: metrics.sourceType, source: metrics.source } }]
          : null
      })
      .filter(Boolean),
  )
  const startupCostPatches = Object.fromEntries(
    Object.entries(brandMetricColumns)
      .map(([brandKey, metrics]) => {
        const screenKey = STARTUP_COST_SCREENS[brandKey]
        const patch = startupCostCardPatch(brandKey, metrics)
        return screenKey && patch
          ? [
              screenKey,
              {
                cardsByTitle: {
                  '얼마 드나?': {
                    ...patch,
                    _meta: { origin: metrics.sourceType, source: metrics.source },
                  },
                },
              },
            ]
          : null
      })
      .filter(Boolean),
  )
  const brandPowerPatches = Object.fromEntries(
    Object.entries(brandMetricColumns)
      .map(([brandKey, metrics]) => {
        const screenKey = BRAND_POWER_SCREENS[brandKey]
        const patch = brandPowerCardPatch(metrics)
        return screenKey && patch
          ? [
              screenKey,
              {
                cardsByTitle: {
                  '브랜드 파워': {
                    ...patch,
                    _meta: { origin: metrics.sourceType, source: metrics.source },
                  },
                },
              },
            ]
          : null
      })
      .filter(Boolean),
  )
  const costDetailPatches = Object.fromEntries(
    Object.entries(brandMetricColumns)
      .map(([brandKey, metrics]) => {
        const screenKey = COST_DETAIL_SCREENS[brandKey]
        const cardsByTitle = costDetailCardPatches(brandKey, metrics)
        return screenKey && Object.keys(cardsByTitle).length
          ? [
              screenKey,
              {
                cardsByTitle: Object.fromEntries(
                  Object.entries(cardsByTitle).map(([cardTitle, patch]) => [
                    cardTitle,
                    {
                      ...patch,
                      _meta: { origin: metrics.sourceType, source: metrics.source },
                    },
                  ]),
                ),
              },
            ]
          : null
      })
      .filter(Boolean),
  )

  return {
    generatedAt: 'runtime',
    patchMode: 'metric-column-derived',
    patches: {
      s0: {
        cardsByTitle: homeCards,
      },
      ...startupCostPatches,
      ...brandPowerPatches,
      ...costDetailPatches,
    },
  }
}
