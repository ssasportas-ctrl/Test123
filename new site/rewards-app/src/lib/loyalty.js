export function computeSummary({ ledger, redemptions, milestones }) {
  const pointsBalance = Math.max(0, ledger.reduce((sum, entry) => sum + entry.points, 0))
  const visitCount = ledger.filter((entry) => entry.entry_type === 'earn').length
  const creditBalance = redemptions
    .filter((r) => r.status === 'active')
    .reduce((sum, r) => sum + Number(r.credit_value), 0)
  const nextMilestone = milestones.find((m) => m.visit_count > visitCount) ?? null

  return {
    pointsBalance,
    creditBalance,
    visitCount,
    tierLabel: 'Insider',
    nextMilestone,
  }
}
