import { describe, expect, it } from 'vitest'
import { scrollTargetForCard } from './scrollToCard'

// Phone-sized viewport with the mobile bottom nav
const mobile = {
  viewportHeight: 800,
  insets: { top: 0, bottom: 80 }
}

describe('scrollTargetForCard', () => {
  it('centers the card in the area above the bottom nav', () => {
    // Visible area is 720px; a 320px card leaves 200px above and below
    const target = scrollTargetForCard({
      ...mobile,
      cardTop: 1500,
      cardHeight: 320,
      scrollY: 400
    })
    expect(target).toBe(400 + 1500 - 200)
  })

  it('accounts for a fixed top nav when centering', () => {
    const target = scrollTargetForCard({
      cardTop: 900,
      cardHeight: 300,
      scrollY: 0,
      viewportHeight: 900,
      insets: { top: 100, bottom: 0 }
    })
    // Visible area is 800px starting at 100px, so 250px sits above the card
    expect(target).toBe(900 - 100 - 250)
  })

  it('aligns a card taller than the visible area to its top', () => {
    const target = scrollTargetForCard({
      ...mobile,
      cardTop: 300,
      cardHeight: 1100,
      scrollY: 200
    })
    expect(target).toBe(200 + 300 - 12)
  })

  it('can return a position above the page top, which the browser clamps', () => {
    const target = scrollTargetForCard({
      ...mobile,
      cardTop: 40,
      cardHeight: 200,
      scrollY: 0
    })
    expect(target).toBeLessThan(0)
  })
})
