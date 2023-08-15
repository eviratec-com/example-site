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

import Footer from '@/components/Footer'
import Button from '@/components/Button'
import ProgressBar from '@/components/ProgressBar'
import LogoutButton from '@/components/LogoutButton'
import FeedPageHeading from '@/components/FeedPageHeading'

import SessionContext from '@/contexts/SessionContext'

import type { Session } from '@/types/Session'

interface Props {
  _session?: Session
}

const MyAccountPage: NextPage<Props> = ({ _session }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const session = useContext(SessionContext)

  const [loading, setLoading] = useState<boolean>(true)
  const [displayName, setDisplayName] = useState<string>('')

  useEffect(() => {
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
        <title>My Account - Eviratec Social Platform</title>
        <meta name="description" content="Manage your user account on Eviratec Social Platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="rgba(170, 68, 33)" />
        <meta property="og:title" content="My Account - Eviratec Social Platform" />
        <meta property="og:description" content="Manage your user account on Eviratec Social Platform" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.eviratecsocial.com/my/account" />
        <meta property="og:image" content="https://www.eviratecsocial.com/og.png" />
      </Head>

      <main className={styles.main}>
        <FeedPageHeading>
          My Account
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

        <div className={styles.tools}>
          <ul>
            <li>
              <Button
                className={styles.accountBtn}
                href={`/my/sites`}
              >
                My Sites
              </Button>
            </li>
          </ul>
        </div>

        <div className={styles.tools}>
          <h2>&#127759; Account Settings</h2>
          <ul>
            <li>
              <Button
                className={styles.accountBtn}
                href={`/me`}
              >
                My Profile
              </Button>
            </li>
            <li>
              <Button
                className={styles.accountBtn}
                href={`/my/account/subscriptions`}
              >
                My Subscriptions
              </Button>
            </li>
          </ul>
        </div>

        <div className={styles.tools}>
          <h2>&#128274; Security Settings</h2>
          <ul>
            <li>
              <Button
                className={styles.accountBtn}
                href={`/change-password`}
              >
                Change Password
              </Button>
            </li>
          </ul>
        </div>

        <div className={styles.tools}>
          <h2>&#9203; Session</h2>
          <ul>
            <li>
              <LogoutButton className={styles.accountBtn} />
            </li>
          </ul>
        </div>
      </main>

      <Footer />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<{ _session?: Session }> = async (context) => {
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

  return {
    props: {
      _session,
    },
  }
}

export default MyAccountPage
