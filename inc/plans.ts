import type { Plan } from '@/types/Plan'

export const LITE_PLAN: Plan = {
  title: 'Lite',
  ppm: 13.80,
  features: [
    '20GB Storage',
    '60GB Bandwidth',
  ],
  externalId: {
    stripe: process.env.NEXT_PUBLIC_STRIPE_ESP_LITE_PLAN,
  },
}

export const STANDARD_PLAN: Plan = {
  title: 'Standard',
  ppm: 26.80,
  features: [
    '40GB Storage',
    '120GB Bandwidth',
  ],
  externalId: {
    stripe: process.env.NEXT_PUBLIC_STRIPE_ESP_STANDARD_PLAN,
  },
}

export const PREMIUM_PLAN: Plan = {
  title: 'Premium',
  ppm: 48.80,
  features: [
    '80GB Storage',
    '240GB Bandwidth',
  ],
  externalId: {
    stripe: process.env.NEXT_PUBLIC_STRIPE_ESP_PREMIUM_PLAN,
  },
}
