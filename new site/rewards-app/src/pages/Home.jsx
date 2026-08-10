import { useState } from 'react'
import { useApp } from '../context/AppContext'
import CheckInModal from '../components/CheckInModal'
import MembershipModal from '../components/MembershipModal'
import GiftCardModal from '../components/GiftCardModal'
import ReferModal from '../components/ReferModal'
import { PRACTICE } from '../lib/practice'
import { IconStar, IconGrid, IconCalendar, IconSparkle, IconGift, IconUsers } from '../components/icons'

const CURRENCY = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export default function Home() {
  const { patient, summary, services, setActivePage } = useApp()
  const [showCheckIn, setShowCheckIn] = useState(false)
  const [activeModal, setActiveModal] = useState(null) // 'membership' | 'giftcards' | 'refer' | null

  const progress = summary.nextMilestone
    ? Math.min(1, summary.visitCount / summary.nextMilestone.visit_count)
    : 1

  const featured = services.filter((s) => s.featured).slice(0, 6)

  return (
    <div className="main-content">
      <div className="page-header">
        <div className="eyebrow">WELCOME BACK</div>
        <h1>{patient?.full_name ?? 'Guest'}</h1>
        <div className="rule" />
      </div>

      <div className="card insider-card">
        <div className="insider-body">
          <div className="insider-tier">
            <IconStar />
            <span className="eyebrow">{summary.tierLabel.toUpperCase()}</span>
          </div>

          <div className="insider-stats">
            <div>
              <div className="eyebrow muted">POINTS</div>
              <div className="value">{summary.pointsBalance}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="eyebrow muted">CREDITS</div>
              <div className="value">{CURRENCY.format(summary.creditBalance)}</div>
            </div>
          </div>

          <div className="insider-progress">
            <div className="insider-progress-labels">
              <span>{summary.visitCount} visits</span>
              {summary.nextMilestone && (
                <span style={{ color: 'var(--gold-foil)' }}>
                  {Math.max(0, summary.nextMilestone.visit_count - summary.visitCount)} more visits to{' '}
                  +{summary.nextMilestone.bonus_points} bonus points
                </span>
              )}
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
            </div>
          </div>
        </div>
        <div className="insider-footer">
          <button onClick={() => setActivePage('rewards')}>
            <IconStar /> REWARDS
          </button>
          <button onClick={() => setShowCheckIn(true)}>
            <IconGrid /> CHECK IN
          </button>
        </div>
      </div>

      <div className="quick-actions">
        <a
          className="card quick-action"
          style={{ textDecoration: 'none', color: 'inherit' }}
          href={PRACTICE.bookingUrl}
          target="_blank"
          rel="noreferrer"
        >
          <span className="icon"><IconCalendar /></span>
          BOOK
        </a>
        <button className="card quick-action" onClick={() => setActiveModal('membership')}>
          <span className="icon"><IconSparkle /></span>
          MEMBERSHIP
        </button>
        <button className="card quick-action" onClick={() => setActiveModal('giftcards')}>
          <span className="icon"><IconGift /></span>
          GIFT CARDS
        </button>
        <button className="card quick-action" onClick={() => setActiveModal('refer')}>
          <span className="icon"><IconUsers /></span>
          REFER
        </button>
      </div>

      <div>
        <div className="section-heading">
          <div>
            <div className="eyebrow">CURATED FOR YOU</div>
            <h2>Featured Treatments</h2>
          </div>
          <div className="eyebrow">SEE ALL</div>
        </div>

        {featured.length === 0 ? (
          <p style={{ color: 'var(--ink-muted)' }}>Featured treatments will appear here.</p>
        ) : (
          <div className="treatment-row">
            {featured.map((service) => (
              <div key={service.id} className="card treatment-card">
                <div className="treatment-thumb"><IconSparkle /></div>
                <div className="title">{service.name}</div>
                {service.price != null && (
                  <div className="desc">{CURRENCY.format(service.price)}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showCheckIn && <CheckInModal onClose={() => setShowCheckIn(false)} />}
      {activeModal === 'membership' && <MembershipModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'giftcards' && <GiftCardModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'refer' && <ReferModal onClose={() => setActiveModal(null)} />}
    </div>
  )
}
