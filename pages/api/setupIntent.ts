import type { NextApiRequest, NextApiResponse } from 'next'

import createSetupIntent from '@/functions/payments/stripe/createSetupIntent'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ clientSecret: string }|Error>
) {
  try {
    const customer: string = req.body.customer
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

    const intent = await createSetupIntent(stripe)(customer)

    res.status(200).json({
      clientSecret: intent.client_secret,
    })
  }
  catch (err) {
    console.log(err)
    res.status(400).json({
      name: 'CREATE_SETUP_INTENT_ERR',
      message: 'Failed to create setup intent'
    })
  }
}
