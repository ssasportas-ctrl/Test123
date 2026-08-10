export default function Modal({ eyebrow, title, onClose, children }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="card checkin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="eyebrow">{eyebrow}</div>
        <h2 style={{ fontSize: 24 }}>{title}</h2>
        {children}
        <button className="checkin-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}
