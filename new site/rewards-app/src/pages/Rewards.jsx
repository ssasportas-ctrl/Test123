import { useApp } from '../context/AppContext'

export default function Rewards() {
  const { rewards, redemptions, summary, redeem } = useApp()

  const handleRedeem = (reward) => {
    if (summary.pointsBalance < reward.points_cost) return
    const confirmed = window.confirm(`Redeem "${reward.title}" for ${reward.points_cost} points?`)
    if (confirmed) redeem(reward)
  }

  return (
    <div className="main-content">
      <div className="page-header">
        <div className="eyebrow">{summary.pointsBalance} POINTS AVAILABLE</div>
        <h1>Rewards</h1>
      </div>

      {rewards.length === 0 ? (
        <p style={{ color: 'var(--ink-muted)' }}>No rewards available yet.</p>
      ) : (
        rewards.map((reward) => {
          const canAfford = summary.pointsBalance >= reward.points_cost
          return (
            <div key={reward.$id} className="card row-card">
              <div>
                <div className="title">{reward.title}</div>
                {reward.description && <div className="desc">{reward.description}</div>}
                <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: 13, marginTop: 4 }}>
                  {reward.points_cost} points
                </div>
              </div>
              <button className="pill-btn" disabled={!canAfford} onClick={() => handleRedeem(reward)}>
                REDEEM
              </button>
            </div>
          )
        })
      )}

      {redemptions.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            YOUR REDEMPTIONS
          </div>
          {redemptions.map((r) => (
            <div key={r.$id} className="info-row" style={{ borderBottom: '1px solid var(--hairline)' }}>
              <span style={{ fontWeight: 700 }}>{r.code}</span>
              <span className="label">{r.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
