# Stripe Payment Integration Setup

## Frontend Setup (Already Done)

✅ Installed: `@stripe/react-stripe-js`, `@stripe/js`
✅ Created: `src/lib/stripe.js` - Stripe initialization
✅ Created: `src/components/CheckoutButton.jsx` - Checkout component
✅ Created: `.env.example` - Environment variables template

## Backend Setup Required

### 1. Install Stripe SDK
```bash
npm install stripe
```

### 2. Create Checkout Session API Endpoint

**Example (Node.js/Express):**

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/api/checkout-session', async (req, res) => {
  try {
    const { serviceId, serviceName, price, quantity } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: serviceName,
              metadata: {
                serviceId: serviceId,
              },
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity: quantity || 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.DOMAIN}/services`,
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

### 3. Environment Variables

Copy `.env.example` to `.env.local` and add:
```
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
```

Get keys from: https://dashboard.stripe.com/apikeys

### 4. Webhook Setup (Recommended)

Handle completed payments:

```javascript
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // Create appointment/order record in base44
    console.log('Payment successful for session:', session.id);
  }

  res.json({received: true});
});
```

### 5. Update Services Page

The `CheckoutButton` component is ready to use. Replace booking links in `Services.jsx`:

```jsx
import CheckoutButton from '../components/CheckoutButton'

// In Services.jsx, replace booking_url check with:
{service.price != null && (
  <CheckoutButton service={service} />
)}
```

## Testing

1. Use Stripe test card: `4242 4242 4242 4242`
2. Future date for expiry
3. Any 3-digit CVC

## Production Checklist

- [ ] Switch to live Stripe keys
- [ ] Update success/cancel URLs
- [ ] Set up webhook for order creation in base44
- [ ] Add appointment creation after payment
- [ ] Implement email receipts
- [ ] Add refund handling

## Base44 Integration

After successful payment, create appointment:

```javascript
const appointment = await createAppointment({
  serviceId: session.metadata.serviceId,
  patientId: userId,
  locationId: locationId,
  paymentId: session.id,
  amount: session.amount_total / 100,
});
```
