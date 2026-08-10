import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { PRACTICE } from '../lib/practice'
import Modal from './Modal'

export default function ReferModal({ onClose }) {
  const { patient, loyaltySettings } = useApp()
  const [copied, setCopied] = useState(false)

  const code = patient?.referral_code ?? ''
  const link = `${PRACTICE.siteUrl}/book-appointment.html?ref=${code}`
  const bonus = loyaltySettings?.referral_bonus_points ?? 100

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Modal eyebrow="REFER A FRIEND" title={`Earn ${bonus} points`} onClose={onClose}>
      <p style={{ color: 'var(--ink-muted)', fontSize: 14 }}>
        Share your code — when a friend books their first visit, you both get rewarded.
      </p>
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: 4,
          color: 'var(--gold)',
          padding: '12px 0',
        }}
      >
        {code || '—'}
      </div>
      <button className="auth-submit" onClick={handleCopy} disabled={!code}>
        {copied ? 'Link Copied!' : 'Copy Referral Link'}
      </button>
    </Modal>
  )
}
