import { useCallback, useContext, useEffect, useState } from 'react'
import { InferGetServerSidePropsType } from 'next'
import { GetServerSideProps } from 'next'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '@/styles/MySites.module.css'

import fetchSitesByUser from '@/functions/sites/fetchByUser'
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

import type { Site } from '@/types/Site'
import type { Session } from '@/types/Session'

interface Props {
  _session?: Session
  _sites?: Site[]
}

const STRIPE_PROVIDER_NUM = 10

const MySitesPage: NextPage<Props> = ({ _sites, _session }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const session = useContext(SessionContext)

  const [loading, setLoading] = useState<boolean>(true)
  const [displayName, setDisplayName] = useState<string>('')

  const [clientSecret, setClientSecret] = useState<string>('')

  const [sites, setSites] = useState<Site[]>(_sites || [])

  useEffect(() => {
    setSites([..._sites])
  }, [_sites])

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

  useEffect(() => {
    (async () => {
      setLoading(true)

      if (!_session && (!session || !session.currentSession || !session.currentSession.token))
        return router.push('/')

      if (session && session.currentUser)
        setDisplayName(session.currentUser.display_name)

      setLoading(false)
    })()
  }, [_session, session, router])

  return (
    <>
      <Head>
        <title>My Sites - Eviratec Social Platform</title>
        <meta name="description" content="Manage your sites on Eviratec Social Platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="rgba(170, 68, 33)" />
        <meta property="og:title" content="My Sites - Eviratec Social Platform" />
        <meta property="og:description" content="Manage your sites on Eviratec Social Platform" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.eviratecsocial.com/my/sites" />
        <meta property="og:image" content="https://www.eviratecsocial.com/og.png" />
      </Head>

      <main className={styles.main}>
        <FeedPageHeading>
          My Sites
        </FeedPageHeading>

        {displayName &&
          <div className={styles.intro}>
            <p>Welcome, {displayName}.</p>
          </div>
        }

        {sites && sites.length && sites.map(site => {
          const expected = new Date(site.created+((86400*2)*1000))

          return (
            <article className={styles.site} key={`site/${site.id}`}>
              <header>
                <div className={styles.siteName}>{site.name}</div>
                <div className={styles.siteFqdn}>https://{site.fqdn}</div>
              </header>

              <section className={styles.body}>
                <ProgressBar />

                <div className={styles.siteStatus}>Provisioning...</div>
                <div className={styles.expected}>
                  Expected completion: {expected.toDateString()}
                </div>
              </section>
            </article>
          )
        })}
      </main>

      <Footer />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<{ _session?: Session, _sites?: Site[] }> = async (context) => {
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

  const _sites: Site[] = await fetchSitesByUser(_session.user)

  return {
    props: {
      _session,
      _sites,
    },
  }
}

export default MySitesPage
