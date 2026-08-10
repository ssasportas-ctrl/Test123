import { describe, expect, it } from 'vitest'
import { computeSummary } from './loyalty'

const earn = (points) => ({ entry_type: 'earn', points })
const redemption = (creditValue, status = 'active') => ({ credit_value: creditValue, status })
const milestone = (visitCount, bonusPoints) => ({ visit_count: visitCount, bonus_points: bonusPoints })

describe('computeSummary', () => {
  it('sums points across ledger entries', () => {
    const summary = computeSummary({ ledger: [earn(100), earn(100)], redemptions: [], milestones: [] })
    expect(summary.pointsBalance).toBe(200)
  })

  it('never returns a negative points balance', () => {
    const ledger = [earn(100), { entry_type: 'redeem', points: -250 }]
    const summary = computeSummary({ ledger, redemptions: [], milestones: [] })
    expect(summary.pointsBalance).toBe(0)
  })

  it('counts visits as the number of "earn" entries only', () => {
    const ledger = [earn(100), earn(100), { entry_type: 'referral_bonus', points: 50 }]
    const summary = computeSummary({ ledger, redemptions: [], milestones: [] })
    expect(summary.visitCount).toBe(2)
  })

  it('sums only active redemptions into the credit balance', () => {
    const redemptions = [redemption(25, 'active'), redemption(10, 'redeemed'), redemption(5, 'active')]
    const summary = computeSummary({ ledger: [], redemptions, milestones: [] })
    expect(summary.creditBalance).toBe(30)
  })

  it('picks the nearest milestone above the current visit count', () => {
    const ledger = [earn(100), earn(100), earn(100)]
    const milestones = [milestone(2, 20), milestone(5, 50), milestone(10, 100)]
    const summary = computeSummary({ ledger, redemptions: [], milestones })
    expect(summary.nextMilestone).toEqual(milestone(5, 50))
  })

  it('returns null nextMilestone once every milestone has been passed', () => {
    const ledger = [earn(100), earn(100), earn(100)]
    const milestones = [milestone(1, 10)]
    const summary = computeSummary({ ledger, redemptions: [], milestones })
    expect(summary.nextMilestone).toBeNull()
  })
})
