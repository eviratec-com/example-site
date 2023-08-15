import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import type { UserProfile } from '@/types/User'

import styles from './AuthorLink.module.css'

export interface Props {
  author: UserProfile
  prefix?: string
}

export default function AuthorLink({ author, prefix }: Props) {
  const [textBefore, setTextBefore] = useState<string>(prefix || '')

  useEffect(() => {
    setTextBefore(prefix || '')
  }, [prefix])

  return (
    <address className={styles._}>
      {textBefore} <Link prefetch={false} href={author.link}>{author.display_name}</Link>
    </address>
  )
}
