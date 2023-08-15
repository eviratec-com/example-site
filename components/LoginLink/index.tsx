import React from 'react'
import Link from 'next/link'

import styles from './LoginLink.module.css'

export default function LoginLink() {
  return (
    <Link href={`/login`} className={styles._}>
      Login
    </Link>
  )
}
