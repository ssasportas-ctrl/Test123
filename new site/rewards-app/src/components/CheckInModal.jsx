import { useApp } from '../context/AppContext'
import { IconGrid } from './icons'

export default function CheckInModal({ onClose }) {
  const { patient } = useApp()

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="card checkin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="eyebrow">SHOW AT FRONT DESK</div>
        <div className="checkin-qr"><IconGrid /></div>
        {patient?.referral_code && <div style={{ letterSpacing: 3, fontWeight: 700 }}>{patient.referral_code}</div>}
        <p style={{ color: 'var(--ink-muted)', fontSize: 14 }}>
          Staff will scan this to log your visit and add points.
        </p>
        <button className="checkin-close" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  )
}
