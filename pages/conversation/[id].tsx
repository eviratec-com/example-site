import { ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { InferGetServerSidePropsType } from 'next'
import { GetServerSideProps } from 'next'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Feed.module.css'

import fetchSessionByToken from '@/functions/fetchSessionByToken'
import fetchConversationById from '@/functions/conversations/fetchConversationById'

import Footer from '@/components/Footer'
import PrivateMessage from '@/components/PrivateMessage'
import FeedPageHeading from '@/components/FeedPageHeading'
import PrivateMessageForm from '@/components/PrivateMessageForm'

import SessionContext from '@/contexts/SessionContext'

import type { Session } from '@/types/Session'
import type { Conversation, Message } from '@/types/Conversation'

interface Props {
  conversation: Conversation
  uploadUrl: string
  _session?: Session
}

const ConversationPage: NextPage<Props> = ({ conversation, uploadUrl, _session }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const slug = (router.query.slug as string[]) || []

  const session = useContext(SessionContext)

  const [allMessages, setAllMessages] = useState<Message[]>([])

  const onNewMessage = useCallback((newMessage: Message): void => {
    setAllMessages([
      newMessage,
      ...allMessages
    ])
  }, [allMessages, setAllMessages]);

  const fetchMessages: () => Promise<Message[]> = useCallback(async () => {
    return new Promise((resolve, reject) => {
      if (!session && !_session) {
        return resolve([])
      }

      const headers = {
        'X-Eviratecnet-Token': _session && _session.token || session.currentSession.token,
        'Content-Type': 'application/json',
      }

      const opts = {
        method: 'GET',
        headers,
      }

      fetch(`/api/conversation/${conversation.id}/messages`, opts)
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
  }, [_session, session, conversation])

  useEffect(() => {
    if (!_session) {
      return
    }

    session.login(_session)
  }, [session, _session])

  useEffect(() => {
    (async () => {
      if (!_session && (!session || !session.currentSession || !session.currentSession.token))
        return router.push('/')

      const messages: Message[] = await fetchMessages()

      setAllMessages([...messages])
    })()
  }, [_session, session, router, fetchMessages, setAllMessages])

  return (
    <>
      <Head>
        <title>{`Conversation - Eviratec Social Platform`}</title>
        <meta name="description" content={`User conversation on Eviratec Social Platform`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="rgba(170, 68, 33)" />
        <meta property="og:site_name" content="Eviratec Social Platform" />
        <meta property="og:description" content={`User conversation on Eviratec Social Platform`} />
        <meta property="og:url" content={`https://www.eviratecsocial.com/${slug.join('/')}`} />
        <meta property="og:image" content="https://www.eviratecsocial.com/og.png" />
      </Head>

      <main className={styles.main}>
        <div className={styles.postFormWrapper}>
          <PrivateMessageForm
            uploadUrl={uploadUrl}
            conversation={conversation.id}
            onNewMessage={onNewMessage}
          />
        </div>

        <div className={styles.posts}>
          {allMessages.map((message: Message, i: number) => {
            return (
              <div
                className={styles.postWrapper}
                key={`conversation/${conversation.id}/message/${message.id}`}
              >
                <PrivateMessage message={message} />
              </div>
            )
          })}
        </div>
      </main>

      <Footer />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<{ conversation: Conversation, uploadUrl: string, _session?: Session }> = async (context) => {
  const id: number = Number(`${context.params.id}`)
  const conversation: Conversation = await fetchConversationById(id)

  if (!conversation) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const uploadUrl: string = `${process.env.NEXT_PUBLIC_UPLOAD_API_BASE}/upload`

  conversation.started = (new Date(conversation.started)).getTime()

  const token: string = context.req.cookies && context.req.cookies['eviratecseshid'] || ''
  if (token) {
    const _session: Session = await fetchSessionByToken(token)
    if (_session) {
      return {
        props: {
          conversation,
          uploadUrl,
          _session,
        },
      }
    }
  }

  return {
    props: {
      conversation,
      uploadUrl,
    },
  }
}

export default ConversationPage
