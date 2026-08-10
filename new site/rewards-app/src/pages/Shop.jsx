import { useApp } from '../context/AppContext'
import { IconBag } from '../components/icons'

const CURRENCY = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export default function Shop() {
  const { products } = useApp()

  return (
    <div className="main-content">
      <div className="page-header">
        <div className="eyebrow">MERITMD</div>
        <h1>Shop</h1>
      </div>

      {products.length === 0 ? (
        <p style={{ color: 'var(--ink-muted)' }}>No products available yet.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="card product-card">
              <div className="product-thumb"><IconBag /></div>
              <div className="title" style={{ fontSize: 14 }}>
                {product.name}
              </div>
              <div className="desc">{CURRENCY.format(product.price)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
