import { loadStripe } from '@stripe/js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default stripePromise;
