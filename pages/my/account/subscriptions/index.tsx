import { useCallback, useContext, useEffect, useState } from 'react'
import { InferGetServerSidePropsType } from 'next'
import { GetServerSideProps } from 'next'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '@/styles/MyAccount.module.css'

import fetchSessionByToken from '@/functions/fetchSessionByToken'
import fetchUserAccountsByProvider from '@/functions/users/fetchAccountsByProvider'

import Footer from '@/components/Footer'
import Button from '@/components/Button'
import ProgressBar from '@/components/ProgressBar'
import LogoutButton from '@/components/LogoutButton'
import PlanSelection from '@/components/PlanSelection'
import FeedPageHeading from '@/components/FeedPageHeading'

import SessionContext from '@/contexts/SessionContext'
import PaymentIntentContext from '@/contexts/PaymentIntentContext'

import type { Session } from '@/types/Session'
import type { UserAccount } from '@/types/User'

interface Props {
  _session?: Session
  _accounts?: UserAccount[]
}

const STRIPE_PROVIDER_NUM = 10

const MySubscriptionsPage: NextPage<Props> = ({ _accounts, _session }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const session = useContext(SessionContext)

  const [loading, setLoading] = useState<boolean>(true)
  const [displayName, setDisplayName] = useState<string>('')

  const [clientSecret, setClientSecret] = useState<string>('')

  const [accounts, setAccounts] = useState<UserAccount[]>(_accounts || [])

  // const createPaymentIntent = useCallback(async () => {
  //   const opts = {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ items: [{  }]})
  //   }
  //
  //   const result = await fetch('/api/createPaymentIntent', opts)
  //   if (200 !== result.status) {
  //     console.log(result)
  //     return
  //   }
  //
  //   const json = await result.json()
  //
  //   setClientSecret(json.clientSecret)
  // }, [])
  //
  // const contextValue = useMemo(() => ({
  //   clientSecret,
  //   createPaymentIntent,
  // }), [clientSecret, createPaymentIntent])

  useEffect(() => {
    if (session && session.currentSession && session.currentSession.token) {
      return
    }

    if (!_session) {
      setDisplayName('')
      return
    }

    session.login(_session)
  }, [session, _session])

  // const fetchAccounts = useCallback(async (token) => {
  //   setLoading(true)
  //
  //   const data = {
  //     headers: {
  //       'X-Eviratecnet-Token': token,
  //       'Content-Type': 'application/json',
  //     }
  //   }
  //
  //   const res = fetch('/api/my/accounts', data)
  //   if (200 !== res.status) {
  //     setLoading(false)
  //     return
  //   }
  //
  //   const json = res.json()
  //   const a: UserAccount[] = [...json]
  //
  //   setAccounts(a)
  //   setLoading(false)
  // }, [setAccounts])

  useEffect(() => {
    (async () => {
      setLoading(true)

      if (!_session && (!session || !session.currentSession || !session.currentSession.token))
        return router.push('/')

      if (session && session.currentUser)
        setDisplayName(session.currentUser.display_name)

      // fetchAccounts(_session || session.currentSession.token)
    })()
  }, [_session, session, router])

  return (
    <>
      <Head>
        <title>My Subscriptions - Eviratec Social Platform</title>
        <meta name="description" content="Manage your subscriptions on Eviratec Social Platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="rgba(170, 68, 33)" />
        <meta property="og:title" content="My Subscriptions - Eviratec Social Platform" />
        <meta property="og:description" content="Manage your subscriptions on Eviratec Social Platform" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.eviratecsocial.com/my/account/subscriptions" />
        <meta property="og:image" content="https://www.eviratecsocial.com/og.png" />
      </Head>

      <main className={styles.main}>
        <FeedPageHeading>
          My Subscriptions
        </FeedPageHeading>

        {displayName &&
          <div className={styles.intro}>
            <p>Welcome back, {displayName}.</p>
          </div>
        ||
          <div className={styles.intro}>
            <ProgressBar />
          </div>
        }



      </main>

      <Footer />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<{ _session?: Session, _accounts?: UserAccount[] }> = async (context) => {
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

  const _accounts: UserAccount[] = []

  return {
    props: {
      _session,
      _accounts,
    },
  }
}

export default MySubscriptionsPage
