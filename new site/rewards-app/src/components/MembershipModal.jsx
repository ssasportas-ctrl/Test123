import { useApp } from '../context/AppContext'
import { PRACTICE } from '../lib/practice'
import Modal from './Modal'

const CURRENCY = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export default function MembershipModal({ onClose }) {
  const { membership, membershipPlans } = useApp()
  const activePlan = membershipPlans.find((p) => p.$id === membership?.plan_id)

  return (
    <Modal eyebrow="MEMBERSHIP" title={activePlan ? activePlan.name : 'Membership'} onClose={onClose}>
      {membership ? (
        <>
          <p style={{ color: 'var(--ink-muted)', fontSize: 14 }}>
            Your membership is <strong style={{ color: 'var(--ink)' }}>{membership.status}</strong>
            {membership.current_period_end &&
              ` through ${new Date(membership.current_period_end).toLocaleDateString()}`}
            .
          </p>
          {activePlan?.description && (
            <p style={{ color: 'var(--ink-muted)', fontSize: 14 }}>{activePlan.description}</p>
          )}
        </>
      ) : (
        <>
          <p style={{ color: 'var(--ink-muted)', fontSize: 14 }}>You don't have an active membership yet.</p>
          {membershipPlans.map((plan) => (
            <div key={plan.$id} className="card" style={{ padding: 14, textAlign: 'left', width: '100%' }}>
              <div style={{ fontWeight: 700 }}>{plan.name}</div>
              {plan.description && (
                <div style={{ fontSize: 13, color: 'var(--ink-muted)' }}>{plan.description}</div>
              )}
              {plan.monthly_price != null && (
                <div style={{ color: 'var(--gold)', fontWeight: 700, marginTop: 4 }}>
                  {CURRENCY.format(plan.monthly_price)}/mo
                </div>
              )}
            </div>
          ))}
          <a className="auth-submit" style={{ textDecoration: 'none', display: 'block' }} href={PRACTICE.bookingUrl} target="_blank" rel="noreferrer">
            Ask About Membership
          </a>
        </>
      )}
    </Modal>
  )
}
