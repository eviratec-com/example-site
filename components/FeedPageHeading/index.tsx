import React, { ReactNode } from 'react'

import styles from './FeedPageHeading.module.css'

interface Props {
  children?: ReactNode
}

export default function FeedPageHeading({ children }: Props) {
  return (
    <h1 className={styles._}>
      {children}
    </h1>
  )
}
