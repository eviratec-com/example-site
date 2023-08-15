import React, { useCallback, useContext } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import styles from './LogoutLink.module.css'

import SessionContext from '@/contexts/SessionContext'

export default function LogoutLink() {
  const router = useRouter()
  const session = useContext(SessionContext)

  const logout = useCallback((event) => {
    event.preventDefault()
    session.logout()
    router.push('/')
  }, [session, router])

  return (
    <Link prefetch={false} href={`/`} className={styles._} onClick={logout}>
      Logout
    </Link>
  )
}
