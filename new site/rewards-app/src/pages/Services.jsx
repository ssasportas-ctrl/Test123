import { useApp } from '../context/AppContext'

const CURRENCY = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export default function Services() {
  const { services } = useApp()

  const groups = services.reduce((acc, service) => {
    const key = service.category ?? 'More'
    acc[key] = acc[key] ?? []
    acc[key].push(service)
    return acc
  }, {})

  return (
    <div className="main-content">
      <div className="page-header">
        <div className="eyebrow">EXPLORE</div>
        <h1>Services</h1>
      </div>

      {services.length === 0 ? (
        <p style={{ color: 'var(--ink-muted)' }}>No services available yet.</p>
      ) : (
        Object.entries(groups).map(([category, items]) => (
          <div key={category} style={{ marginBottom: 24 }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>
              {category.toUpperCase()}
            </div>
            {items.map((service) => (
              <div key={service.$id} className="card row-card">
                <div>
                  <div className="title">{service.name}</div>
                  {service.description && <div className="desc">{service.description}</div>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  {service.price != null && (
                    <div style={{ color: 'var(--gold)', fontWeight: 700 }}>{CURRENCY.format(service.price)}</div>
                  )}
                  {service.booking_url && (
                    <a
                      className="pill-btn"
                      style={{ textDecoration: 'none', display: 'inline-block' }}
                      href={service.booking_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      BOOK
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  )
}
