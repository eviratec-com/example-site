import { ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { InferGetServerSidePropsType } from 'next'
import { GetServerSideProps } from 'next'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Feed.module.css'

import fetchSessionByToken from '@/functions/fetchSessionByToken'
import fetchUserProfileById from '@/functions/fetchUserProfileById'
import createConversation from '@/functions/conversations/createConversation'
import fetchUserProfileByUsername from '@/functions/fetchUserProfileByUsername'

import Footer from '@/components/Footer'
import FeedPageHeading from '@/components/FeedPageHeading'
import PrivateMessageForm from '@/components/PrivateMessageForm'

import SessionContext from '@/contexts/SessionContext'

import type { Session } from '@/types/Session'
import type { UserProfile } from '@/types/User'
import type { Conversation, Message } from '@/types/Conversation'

interface Props {
  conversation: Conversation
  uploadUrl: string
  _session: Session
}

const StartConversationPage: NextPage<Props> = ({ conversation, uploadUrl, _session }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const recipient = (router.query.recipient as string) || ''

  const session = useContext(SessionContext)

  const onNewMessage = useCallback((newMessage: Message): void => {
    router.push(`/conversation/${conversation.id}`)
  }, [router, conversation]);

  useEffect(() => {
    if (!_session) {
      return
    }

    session.login(_session)
  }, [session, _session])

  useEffect(() => {
    (async () => {
      if (!_session && (!session || !session.currentSession || !session.currentSession.token))
        return router.push('/login')
    })()
  }, [_session, session, router])

  return (
    <>
      <Head>
        <title>{`Start Conversation - Eviratec Social Platform`}</title>
        <meta name="description" content={`Start a new conversation on Eviratec Social Platform`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="rgba(170, 68, 33)" />
        <meta property="og:site_name" content="Eviratec Social Platform" />
        <meta property="og:description" content={`Start a new conversation on Eviratec Social Platform`} />
        <meta property="og:url" content={`https://www.eviratecsocial.com/start/conversation/${recipient}}`} />
        <meta property="og:image" content="https://www.eviratecsocial.com/og.png" />
      </Head>

      <main className={styles.main}>
        <FeedPageHeading>
          Start Conversation
        </FeedPageHeading>

        <div className={styles.postFormWrapper}>
          <PrivateMessageForm
            uploadUrl={uploadUrl}
            conversation={conversation.id}
            onNewMessage={onNewMessage}
          />
        </div>
      </main>

      <Footer />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<{ conversation: Conversation, uploadUrl: string, _session: Session }> = async (context) => {
  const token: string = context.req.cookies && context.req.cookies['eviratecseshid'] || ''
  if (!token) {
    // not logged in
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const session: Session = await fetchSessionByToken(token)
  if (!session) {
    // not logged in
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  // Fetch UserProfile for sender (conversation starter)
  const sender: UserProfile = await fetchUserProfileById(session.user)
  if (!sender) {
    // no sender
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  // Fetch UserProfile for receiver (first member after the conversation
  //   starter)
  const recipient: UserProfile = await fetchUserProfileByUsername(
    `${context.params.recipient}`
  )

  // Create Conversation
  const conversation: Conversation = await createConversation({
    members: [
      sender,
      recipient,
    ],
    started_by: sender,
  })

  // On error redirect to homepage
  if (!conversation) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const uploadUrl: string = `${process.env.NEXT_PUBLIC_UPLOAD_API_BASE}/upload`

  return {
    props: {
      conversation,
      uploadUrl,
      _session: session,
    },
  }
}

export default StartConversationPage
