export interface ViewportInsets {
  top: number
  bottom: number
}

interface CardPlacement {
  cardTop: number
  cardHeight: number
  scrollY: number
  viewportHeight: number
  insets: ViewportInsets
}

const TALL_CARD_GAP = 12

// Page scroll position that centers the card in the area not covered by fixed navs.
// A card taller than that area is aligned to its top so the day header stays visible.
// The browser clamps the result at the page edges, which keeps cards near the end fully visible.
export function scrollTargetForCard({
  cardTop,
  cardHeight,
  scrollY,
  viewportHeight,
  insets
}: CardPlacement): number {
  const visibleHeight = viewportHeight - insets.top - insets.bottom
  const cardPageTop = scrollY + cardTop

  if (cardHeight > visibleHeight) {
    return cardPageTop - insets.top - TALL_CARD_GAP
  }
  return cardPageTop - insets.top - (visibleHeight - cardHeight) / 2
}

export function fixedNavInsets(): ViewportInsets {
  const insets = { top: 0, bottom: 0 }
  for (const nav of document.querySelectorAll('nav')) {
    if (getComputedStyle(nav).position !== 'fixed') continue
    const rect = nav.getBoundingClientRect()
    if (rect.height === 0) continue
    if (rect.top <= 0) {
      insets.top = Math.max(insets.top, rect.bottom)
    } else {
      insets.bottom = Math.max(insets.bottom, window.innerHeight - rect.top)
    }
  }
  return insets
}
