import { PRACTICE } from '../lib/practice'
import Modal from './Modal'

export default function GiftCardModal({ onClose }) {
  return (
    <Modal eyebrow="GIFT CARDS" title="Give MeritMD" onClose={onClose}>
      <p style={{ color: 'var(--ink-muted)', fontSize: 14 }}>
        Gift cards aren't available for online purchase yet. Call the office and our front desk can set one
        up for you over the phone.
      </p>
      <a className="auth-submit" style={{ textDecoration: 'none', display: 'block' }} href={PRACTICE.phoneHref}>
        Call {PRACTICE.phone}
      </a>
    </Modal>
  )
}
