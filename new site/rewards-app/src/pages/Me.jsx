import { useApp } from '../context/AppContext'

export default function Me() {
  const { patient, membership, signOut } = useApp()

  return (
    <div className="main-content">
      <div className="page-header">
        <div className="eyebrow">ACCOUNT</div>
        <h1>Me</h1>
      </div>

      <div className="card" style={{ padding: 18, marginBottom: 16 }}>
        <div className="info-row" style={{ borderBottom: '1px solid var(--hairline)' }}>
          <span className="label">Name</span>
          <span className="value">{patient?.full_name ?? '—'}</span>
        </div>
        <div className="info-row" style={{ borderBottom: '1px solid var(--hairline)' }}>
          <span className="label">Email</span>
          <span className="value">{patient?.email ?? '—'}</span>
        </div>
        <div className="info-row">
          <span className="label">Referral Code</span>
          <span className="value">{patient?.referral_code ?? '—'}</span>
        </div>
      </div>

      {membership && (
        <div className="card" style={{ padding: 18, marginBottom: 16 }}>
          <div className="eyebrow">MEMBERSHIP</div>
          <h3 style={{ marginTop: 6 }}>{membership.status}</h3>
        </div>
      )}

      <button className="signout-btn" onClick={signOut}>
        Sign Out
      </button>
    </div>
  )
}
