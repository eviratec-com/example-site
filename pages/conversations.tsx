import { useCallback, useContext, useEffect, useState } from 'react'
import { InferGetServerSidePropsType } from 'next'
import { GetServerSideProps } from 'next'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '@/styles/Conversations.module.css'

import fetchSessionByToken from '@/functions/fetchSessionByToken'

import Footer from '@/components/Footer'
import ProgressBar from '@/components/ProgressBar'
import FeedPageHeading from '@/components/FeedPageHeading'

import SessionContext from '@/contexts/SessionContext'

import type { Session } from '@/types/Session'
import type { ConversationSummary } from '@/types/Conversation'

interface Props {
  _session?: Session
}

const ConversationsPage: NextPage<Props> = ({ _session }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const session = useContext(SessionContext)

  const [loading, setLoading] = useState<boolean>(false)
  const [allConversations, setAllConversations] = useState<ConversationSummary[]>([])
  const [zeroConversationsFound, setZeroConversationsFound] = useState<boolean>(false)

  const fetchConversations: () => Promise<ConversationSummary[]> = useCallback(async () => {
    return new Promise((resolve, reject) => {
      if (!session.currentSession) {
        return resolve([])
      }

      const headers = {
        'X-Eviratecnet-Token': session.currentSession.token,
        'Content-Type': 'application/json',
      }

      const opts = {
        method: 'GET',
        headers,
      }

      fetch('/api/conversations', opts)
        .then(result => {
          if (400 === result.status) {
            return result.json().then(json => {
              reject(new Error(json.message))
            })
          }

          result.json().then(json => {
            resolve(json)
          })
        })
        .catch(err => reject(err))
    })
  }, [session])

  // Log user in if the server-side has found a session cookie
  useEffect(() => {
    (async () => {
      if (session.currentSession) {
        return
      }

      if (!_session) {
        return
      }

      if (session.loggedIn) {
        return
      }

      session.login(_session)
    })()
  })

  // Load conversations for an authorised user
  useEffect(() => {
    (async () => {
      if (!session || !session.loggedIn || !session.currentSession || !session.currentSession.token)
        return router.push('/')

      if (true === loading) {
        return
      }

      setLoading(true)

      const conversations: ConversationSummary[] = await fetchConversations()

      if (conversations.length < 1) {
        setZeroConversationsFound(true)
      }

      setAllConversations([...conversations])
      setLoading(false)
    })()
  })

  return (
    <>
      <Head>
        <title>My Conversations - Eviratec Social Platform</title>
        <meta name="description" content="A list of your conversations on Eviratec Social Platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="rgba(170, 68, 33)" />
        <meta property="og:title" content="Eviratec Social Platform Conversations" />
        <meta property="og:description" content="A list of your conversations on Eviratec Social Platform" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.eviratecsocial.com/conversations" />
        <meta property="og:image" content="https://www.eviratecsocial.com/og.png" />
      </Head>

      <main className={styles.main}>
        <FeedPageHeading>
          My Conversations
        </FeedPageHeading>

        <div className={styles.conversations}>
          {true === loading && allConversations.length < 1 &&
            <div className={styles.loadingIndicator}>
              <ProgressBar /> <span>Loading Conversations...</span>
            </div>
          }

          {true === zeroConversationsFound &&
            <div className={styles.noResultsIndicator}>
              <p></p>
              <p>No conversations found.</p>
              <p>
                To start a conversation with someone:
                <br />Click the &quot;Start Conversation&quot; button on their profile
                page.
              </p>
            </div>
          }

          {allConversations.map((conversation: ConversationSummary, i: number) => {
            return (
              <div className={styles.conversation} key={conversation.id}>
                <Link prefetch={false} href={`/conversation/${conversation.id}`}>
                  <span className={styles.messageAuthor}>
                    {conversation.last_message.author} said:
                  </span>

                  <span className={styles.messageDate}>
                    {(new Date(conversation.last_message.sent)).toLocaleString()}
                  </span>

                  <p>{conversation.last_message.content}</p>
                </Link>
              </div>
            )
          })}
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

export default ConversationsPage
