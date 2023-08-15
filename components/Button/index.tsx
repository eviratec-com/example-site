import React from 'react'
import type { ReactDomElement } from 'react-dom'
import Link from 'next/link'

import styles from './Button.module.css'

interface Props {
  children?: ReactDomElement | ReactDomElement[]
  href?: string
  onClick?: (event: any) => void
  className?: string
}

export default function Button({ children, href, onClick, className }: Props) {
  return (
    <>
      {!href &&
        <button
          className={`${styles._} ${className ? className : ''}`}
          onClick={onClick}
        >
          {children}
        </button>
      ||
        <Link
          href={href}
          onClick={onClick}
          scroll={true}
          prefetch={false}
          className={`${styles._} ${className ? className : ''}`}
        >
          {children}
        </Link>
      }
    </>
  )
}
