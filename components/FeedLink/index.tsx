import React from 'react'
import Link from 'next/link'

import styles from './FeedLink.module.css'

import type { Feed } from '@/types/Feed'

interface Props {
  feed: Feed
}

export default function FeedLink({ feed }: Props) {
  return (
    <div className={styles._}>
      <Link prefetch={false} href={`/${feed.slug}`}>{feed.name}</Link>
    </div>
  )
}
