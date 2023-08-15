import type { NextApiRequest, NextApiResponse } from 'next'

import createPaymentIntent from '@/functions/payments/stripe/createIntent'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ clientSecret: string }|Error>
) {
  try {
    const amount: number = Number(req.query.amt)
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

    const intent = await createPaymentIntent(stripe)(amount)

    res.status(200).json({
      clientSecret: intent.client_secret,
    })
  }
  catch (err) {
    console.log(err)
    res.status(400).json({
      name: 'CREATE_PAYMENT_INTENT_ERR',
      message: 'Failed to create payment intent'
    })
  }
}
