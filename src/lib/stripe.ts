import Stripe from 'stripe';

export const s = process.env.STRIPE_SECRET_KEY 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' as any })
  : null;
