import { useCallback, useContext, useEffect, useState } from 'react'
import { InferGetServerSidePropsType } from 'next'
import { GetServerSideProps } from 'next'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '@/styles/VerifyEmail.module.css'

import fetchSessionByToken from '@/functions/fetchSessionByToken'
import fetchUserProfileById from '@/functions/fetchUserProfileById'

import Footer from '@/components/Footer'
import Button from '@/components/Button'
import FeedPageHeading from '@/components/FeedPageHeading'

import SessionContext from '@/contexts/SessionContext'

import type { UserProfile } from '@/types/User'
import type { Session } from '@/types/Session'

interface Props {
  profile: UserProfile
  token: string
  _session: Session
}

const VERIFIED_STATUSES: string[] = [
  'VERIFIED',
  'ID_VERIFIED',
]

const VerifyEmailPage: NextPage<Props> = ({ profile, token, _session }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const session = useContext(SessionContext)

  return (
    <>
      <Head>
        <title>Email Verification - Eviratec Social Platform</title>
        <meta name="description" content="Verify your email address on Eviratec Social Platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="rgba(170, 68, 33)" />
        <meta property="og:title" content="Eviratec Social Platform Email Verification" />
        <meta property="og:description" content="Verify your email address on Eviratec Social Platform" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.eviratecsocial.com/verify/email" />
        <meta property="og:image" content="https://www.eviratecsocial.com/og.png" />
      </Head>

      <main className={styles.main}>
        <FeedPageHeading>
          Email Verification
        </FeedPageHeading>

        {VERIFIED_STATUSES.indexOf(profile.status) > 0 &&
          <>
            <p>You have already verified your email address.</p>
            <p><Button href={'/me'}>&#10554; Return to my profile</Button></p>
          </>
        ||
          <>
            <p>Email verification is coming soon...</p>
            <p><Button href={'/me'}>&#10554; Return to my profile</Button></p>
          </>
        }
      </main>

      <Footer />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
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

  const profile: UserProfile = await fetchUserProfileById(_session.user)
  if (!profile) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      profile,
      token,
      _session
    },
  }
}

export default VerifyEmailPage
