import React from 'react'

import styles from './PostReply.module.css'

import AuthorLink from '@/components/AuthorLink'

import type { Reply } from '@/types/Reply'

interface Props {
  reply: Reply
}

export default function PostReply({ reply }: Props) {
  function replyDate (input: number): string {
    const d = new Date(input)

    const _date: string = String(d.getDate())
    const _month: string = String(d.getMonth()+1)
    const _year: string = String(d.getFullYear())

    const _hours: string = String(d.getHours()).padStart(2, '0')
    const _minutes: string = String(d.getMinutes()).padStart(2, '0')

    return `${_date}/${_month}/${_year} at ${_hours}:${_minutes}`
  }

  return (
    <article className={styles._}>
      <header className={styles.replyHeader}>
        <h3>{reply.content}</h3>
      </header>

      <footer className={styles.replyFooter}>
        <time dateTime={(new Date(reply.created)).toISOString()}>
          {replyDate(reply.created)}
        </time>
        <span>&nbsp;|&nbsp;</span>
        <AuthorLink author={reply.author} />
      </footer>
    </article>
  )
}
