import React from 'react'
import type { ReactDomElement } from 'react-dom'

import Link from 'next/link'

import styles from './TextBlock.module.css'

interface Props {
  children?: ReactDomElement | ReactDomElement[]
}

export default function TextBlock({ children }: Props) {
  return (
    <div className={styles._}>
      {children}
    </div>
  )
}
