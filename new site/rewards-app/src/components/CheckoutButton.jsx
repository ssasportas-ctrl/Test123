import { useCallback } from 'react'
import stripePromise from '../lib/stripe'

export default function CheckoutButton({ service, quantity = 1 }) {
  const handleCheckout = useCallback(async () => {
    try {
      const stripe = await stripePromise
      if (!stripe) {
        alert('Stripe failed to load')
        return
      }

      // Call your backend to create a checkout session
      const response = await fetch('/api/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service.$id,
          serviceName: service.name,
          price: service.price,
          quantity,
        }),
      })

      const { sessionId } = await response.json()

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({ sessionId })

      if (result.error) {
        alert(result.error.message)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Checkout failed. Please try again.')
    }
  }, [service, quantity])

  return (
    <button
      onClick={handleCheckout}
      className="pill-btn"
      style={{ textDecoration: 'none', display: 'inline-block' }}
    >
      BOOK & PAY
    </button>
  )
}
