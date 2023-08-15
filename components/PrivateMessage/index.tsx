import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import Image from 'next/image'

import AuthorLink from '@/components/AuthorLink'

import type { Message } from '@/types/Conversation'

import styles from './PrivateMessage.module.css'

import postImageLoader from '@/functions/postImageLoader'

interface Props {
  message: Message
}

export default function PrivateMessage({ message }: Props) {
  function messageDate (input: number): string {
    const d = new Date(input)

    const _date: string = String(d.getDate())
    const _month: string = String(d.getMonth()+1)
    const _year: string = String(d.getFullYear())

    const _hours: string = String(d.getHours()).padStart(2, '0')
    const _minutes: string = String(d.getMinutes()).padStart(2, '0')

    return `${_date}/${_month}/${_year} at ${_hours}:${_minutes}`
  }

  function imageClassName (imageUrl: string): string {
    if (!imageIsGif(imageUrl)) {
      return styles.postImage
    }

    return `${styles.postImage} ${styles.wideImage}`
  }

  function imageIsGif (imageUrl: string): boolean {
    return !!imageUrl.match(/\.gif/i)
  }

  return (
    <div className={styles._}>
      <header className={styles.messageHeader}>
        <AuthorLink author={message.author} /> said:
      </header>

      <section className={styles.messageBody}>
        <p>{message.content}</p>
      </section>

      {message.images && message.images.length > 0 &&
        <section className={`${styles.postImages} ${1 === message.images.length ? styles.fullSize : ''}`}>
          {message.images.map((imageUrl: string, i: number): ReactNode => {
            const isGif: boolean = imageIsGif(imageUrl)

            return false === isGif && (
              <div className={`${imageClassName(imageUrl)}`} key={`message/${message.id}/image/${i}`}>
                <div>
                  <Image
                    loader={postImageLoader}
                    src={imageUrl}
                    alt={`User photo upload`}
                    fill
                    sizes={message.images.length >= 2 ? `(max-width: 768px) 50vw,
                      400px` : '800px'}
                    style={{
                      objectFit: 'cover',
                    }}
                  />
                </div>
              </div>
            ) || (
              <div className={`${imageClassName(imageUrl)}`} key={`message/${message.id}/image/${i}`}>
                <div>
                  <Image
                    src={imageUrl}
                    alt={`User photo upload`}
                    fill
                    unoptimized
                    sizes={message.images.length >= 2 ? `(max-width: 768px) 50vw,
                      400px` : '800px'}
                    style={{
                      objectFit: 'cover',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </section>
      }

      <footer className={styles.messageFooter}>
        <time dateTime={(new Date(message.sent)).toISOString()}>
          {messageDate(message.sent)}
        </time>
      </footer>
    </div>
  )
}
