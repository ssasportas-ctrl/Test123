import { useApp } from '../context/AppContext'
import CheckoutButton from '../components/CheckoutButton'

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
              <div key={service.$id} className="card" style={{ overflow: 'hidden' }}>
                {service.image_url && (
                  <img
                    src={service.image_url}
                    alt={service.name}
                    style={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover',
                      marginBottom: 12,
                    }}
                  />
                )}
                <div style={{ padding: service.image_url ? '0 12px 12px' : 0 }}>
                  <div className="title">{service.name}</div>
                  {service.description && <div className="desc">{service.description}</div>}
                  {service.duration_minutes && (
                    <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 4 }}>
                      {service.duration_minutes} min
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: service.image_url ? '0 12px 12px' : 0, gap: 8 }}>
                  <div>
                    {service.price != null && (
                      <div style={{ color: 'var(--gold)', fontWeight: 700 }}>
                        {CURRENCY.format(service.price)}
                      </div>
                    )}
                    {service.member_price != null && service.member_price < service.price && (
                      <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
                        Member: {CURRENCY.format(service.member_price)}
                      </div>
                    )}
                  </div>
                  {service.price != null && (
                    <CheckoutButton service={service} />
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
