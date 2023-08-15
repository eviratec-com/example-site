import { useCallback, useContext, useEffect, useState } from 'react'
import { InferGetServerSidePropsType } from 'next'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import type { NextPage } from 'next'
import * as Stripe from 'stripe'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '@/styles/MyAccount.module.css'

import fetchSessionByToken from '@/functions/fetchSessionByToken'
import fetchUserMetaValue from '@/functions/users/meta/fetchMetaValue'
import createSubscription from '@/functions/payments/stripe/createSubscription'
import updateSiteSubscriptionById from '@/functions/sites/updateSubscriptionById'
import fetchUserAccountsByProvider from '@/functions/users/fetchAccountsByProvider'

import SessionContext from '@/contexts/SessionContext'
import PaymentIntentContext from '@/contexts/PaymentIntentContext'

import type { Session } from '@/types/Session'
import type { UserAccount } from '@/types/User'

interface Props {}

const MySubscriptionsCreateSuccessPage: NextPage<Props> = ({}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Head>
        <title>Success - Eviratec Social Platform</title>
      </Head>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const token: string = context.req.cookies && context.req.cookies['eviratecseshid'] || ''
  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const _session: Session = await fetchSessionByToken(token)
  if (!_session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const setupIntent = context.query.setup_intent || ''
  const setupIntentClientSecret = context.query.setup_intent_client_secret || ''

  if (setupIntent) {
    // attempt to charge for plan
    const stripeCustomerId = await fetchUserMetaValue(
      _session.user,
      'stripe_customer_id'
    )

    const nextPlanPriceId = await fetchUserMetaValue(
      _session.user,
      'next_plan_price_id'
    )

    const nextPlanForSite = await fetchUserMetaValue(
      _session.user,
      'next_plan_for_site'
    )

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

    // const intent = await stripe.paymentIntents.update(
    //   paymentIntent,
    //   {customer: stripeCustomerId}
    // )

    const setupResult = await stripe.setupIntents.retrieve(
      setupIntent
    )

    // const setupResult = await stripe.confirmCardSetup(
    //   setupIntentClientSecret,
    //   {
    //     payment_method: {
    //       customer: stripeCustomerId,
    //     },
    //   }
    // )
    //
    // if (setupResult.error) {
    //   return {
    //     redirect: {
    //       destination: '/my/account/subscriptions?error=',
    //       permanent: false,
    //     },
    //   }
    // }
    //
    // const paymentMethod = await stripe.paymentMethods.attach(
    //   setupResult.payment_method,
    //   {customer: stripeCustomerId}
    // );

    const subscription = await createSubscription(stripe)(
      stripeCustomerId,
      setupResult.payment_method,
      nextPlanPriceId,
      _session.user,
      nextPlanForSite
    )

    await updateSiteSubscriptionById(
      Number(nextPlanForSite),
      subscription.id
    )
  }

  return {
    redirect: {
      destination: '/my/sites',
      permanent: false,
    },
  }
}

export default MySubscriptionsCreateSuccessPage
