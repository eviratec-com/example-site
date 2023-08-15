import React, { ReactNode, useCallback, useContext, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import styles from './ReplyForm.module.css'

import LoginLink from '@/components/LoginLink'
import ProgressBar from '@/components/ProgressBar'

import SessionContext from '@/contexts/SessionContext'

import type { Post } from '@/types/Post'
import type { Reply, NewReply } from '@/types/Reply' // UnsavedReply or
                                                     // DraftReply instead of
                                                     // NewReply?

interface Props {
  post: Post
  onNewReply: (newReply: Reply) => void
}

interface ApiReqHeaders {
  'X-Eviratecnet-Token': string
  'Content-Type': string
}

export default function PostForm({ post, onNewReply }: Props) {
  const session = useContext(SessionContext)

  const [submitting, setSubmitting] = useState<boolean>(false)
  const [content, setContent] = useState<string>('')
  const [success, setSuccess] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const handleSubmit = useCallback((event): void => {
    event.preventDefault()

    // Prevent duplicate submissions
    if (true === submitting) {
      return
    }

    // Disable submit button
    setSubmitting(true)

    const c: NewReply = {
      post: post.id,
      content: content,
    }

    const headers = {
      'X-Eviratecnet-Token': session.currentSession.token,
      'Content-Type': 'application/json',
    }

    fetch('/api/reply', { method: 'POST', body: JSON.stringify(c), headers: headers })
      .then((result) => {
        if (400 === result.status) {
          return result.json().then(json => {
            setSuccess(false)
            setError(json.message)
            setSubmitting(false)
          })
        }
        setSuccess(true)
        setContent('')
        setSubmitting(false)

        result.json().then(json => onNewReply(json))
      })
      .catch((err) => {
        setSuccess(false)
        setError(err.message)
        setSubmitting(false)
      })

  }, [post, content, session, submitting, onNewReply])

  return (
    <div className={styles._}>
      {session && session.currentSession &&
        <form onSubmit={handleSubmit}>
          <div className={styles.postFields}>
            <textarea
              name="content"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={`Write a comment about ${post.content} ...`}
            />

            <button type="submit" disabled={true === submitting}>
              {true === submitting &&
                <ProgressBar
                  bgClassName={styles.progressBg}
                  fgClassName={styles.progressFg}
                />
              }

              {false === submitting &&
                <>Comment</>
              }
            </button>
          </div>
        </form>
      }

      {!session || !session.currentSession &&
        <div className={styles.noticeNoAuth}>
          <p>
            Please <LoginLink /> to post a reply.
          </p>
        </div>
      }
    </div>
  )
}
