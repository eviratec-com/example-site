import type { NextApiRequest, NextApiResponse } from 'next'

import signup from '@/functions/signup'
import setCookie from '@/functions/setCookie'
import createSession from '@/functions/createSession'
import checkUsername from '@/functions/users/checkUsername'
import sendWelcomeEmail from '@/functions/email/send/welcome'
import createCustomer from '@/functions/payments/stripe/createCustomer'
import createSite from '@/functions/sites/createSite'
import claimSiteById from '@/functions/users/claimSiteById'
import setUserMetaValue from '@/functions/users/meta/setMetaValue'

import type { Session } from '@/types/Session'
import type { NewSite, Site } from '@/types/Site'
import type { User, UserRegistration } from '@/types/User'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ session: Session, stripe: { customer: string } }|Error>
) {
  try {
    const {
      billing_address,
      email_address,
      display_name,
      username,
      password,
      site_name,
      site_plan,
      site,
      dob
    } = req.body

    // Check the username is available
    const usernameAvailable = await checkUsername(username)

    if (!usernameAvailable) {
      return res.status(400).json({
        name: 'SIGNUP_ERROR',
        message: `Username '${username}' is not available.`
      })
    }

    // Create the user account
    const u: User = await signup({
      billing_address,
      email_address,
      display_name,
      username,
      password,
      site_name,
      site_plan,
      site,
      dob,
    })

    if (!u) {
      return res.status(400).json({
        name: 'SIGNUP_ERROR',
        message: `Failed to create account: ${username}`
      })
    }

    // Create a session
    const s: Session = await createSession({
      user: u.id
    })

    setCookie(res, 'eviratecseshid', s.token, { path: '/', maxAge: 86400*3 })

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    const _stripeCust = await createCustomer(stripe)({
      email: email_address,
      user: u.id,
      name: display_name,
    }, {
      line1: billing_address.line1,
      line2: billing_address.line2,
      city: billing_address.city,
      zip: billing_address.zip,
      state: billing_address.state,
      country: billing_address.country,
    })

    await setUserMetaValue(u.id, 'stripe_customer_id', _stripeCust.id)
    await setUserMetaValue(u.id, 'next_plan_price_id', site_plan)

    const userSite: Site = await createSite({
      name: site_name,
      plan: site_plan,
      fqdn: site,
      subscription: 'PENDING'
    })

    await claimSiteById(u.id, userSite.id)

    await setUserMetaValue(u.id, 'next_plan_for_site', `${userSite.id}`)

    // Send response body
    res.status(200).json({
      session: s,
      stripe: {
        customer: _stripeCust.id,
      },
    })

    // Send welcome email
    sendWelcomeEmail(
      {
        displayName: display_name,
        address: email_address
      },
      display_name,
      site
    )
  }
  catch (err) {
    res.status(400).json({
      name: 'JOIN_ERROR',
      message: err.message
    })
  }
}
