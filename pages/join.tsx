import { useCallback, useContext, useEffect, useState } from 'react'
import { InferGetServerSidePropsType } from 'next'
import { GetServerSideProps } from 'next'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import styles from '@/styles/FormPage.module.css'

import fetchPosts from '@/functions/fetchPosts'

import Footer from '@/components/Footer'
import SignupForm from '@/components/SignupForm'
import FeedPageHeading from '@/components/FeedPageHeading'

import SessionContext from '@/contexts/SessionContext'

import type { Plan } from '@/types/Plan'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
)

interface StripeOptions {
  amount: number
  mode: 'setup' | 'payment' | 'subscription'
  currency: string
}

const JoinPage: NextPage = () => {
  const [options, setOptions] = useState<StripeOptions>({
    amount: 1500,
    mode: 'subscription',
    currency: 'aud',
  })

  // useEffect(() => {
  //   fetch('/api/setupIntent?amt=1500')
  //     .then((res) => res.json())
  //     .then((data) => setOptions({ clientSecret: data.clientSecret }))
  // }, [])
  //
  // const refreshPaymentIntent = useCallback((newAmount: number) => {
  //   fetch(`/api/setupIntent?amt=${newPlan.ppm}00`)
  //     .then((res) => res.json())
  //     .then((data) => setOptions({ clientSecret: data.clientSecret }))
  // }, [])

  const refreshIntent = useCallback((newAmount: number) => {
    setOptions({
      amount: newAmount,
      mode: 'subscription',
      currency: 'aud',
    })
  }, [setOptions])

  return (
    <>
      <Head>
        <title>Create Yours - Eviratec Social Platform</title>
        <meta name="description" content="Create an account on Eviratec Social Platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="rgba(170, 68, 33)" />
        <meta property="og:title" content="Join Eviratec Social Platform" />
        <meta property="og:description" content="Create an account on Eviratec Social Platform" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.eviratecsocial.com/join" />
        <meta property="og:image" content="https://www.eviratecsocial.com/og.png" />
      </Head>

      <main className={styles.main}>
        <FeedPageHeading>
          Create Your Site
        </FeedPageHeading>

        <Elements stripe={stripePromise} options={options}>
          <SignupForm onChangeAmount={newAmount => refreshIntent(newAmount)} />
        </Elements>
      </main>

      <Footer />
    </>
  )
}

export default JoinPage
