import React, { ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import Link from 'next/link'

import styles from './Toolbar.module.css'

import Hero from '@/components/Hero'

import SessionContext from '@/contexts/SessionContext'

export default function Toolbar() {
  const router = useRouter()
  const session = useContext(SessionContext)

  const [pageLoading, setPageLoading] = useState<boolean>(false)
  const [menuVisible, setMenuVisible] = useState<boolean>(false)
  const [showMessagesIcon, setShowMessagesIcon] = useState<boolean>(false)

  const toggleMenu = useCallback((e) => {
    e.preventDefault()
    setMenuVisible(!menuVisible)
  }, [menuVisible])

  const onClick = useCallback((e) => {
    setMenuVisible(!menuVisible)
  }, [menuVisible])

  useEffect(() => {
    const isLoggedIn: boolean = !(!session || !session.currentSession
      || !session.currentSession.token)

    setShowMessagesIcon(isLoggedIn)
  }, [session])

  useEffect(() => {
    if (!router) {
      return
    }

    const handleRouteChangeStart = (url, { shallow }) => {
      setPageLoading(true)
    }

    const handleRouteChangeComplete = (url, { shallow }) => {
      setPageLoading(false)
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)
    router.events.on('routeChangeComplete', handleRouteChangeComplete)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
    }
  }, [router])

  return (
    <div className={styles._}>
      {pageLoading &&
        <div className={styles.pageLoadingAnimation}>
          <div className={styles.loader}></div>
        </div>
      }

      <div className={styles.logo}>
        <Link prefetch={false} href='/' scroll={true}>Eviratec Social</Link>
      </div>

      <div className={styles.spacer}></div>

      {showMessagesIcon &&
        <div className={styles.messagesBtn}>
          <Link prefetch={false} href='/conversations' scroll={true}>
            &#9993;
          </Link>
        </div>
      }

      <div className={`${styles.menuBtn} ${menuVisible ? styles.closeMenuBtn : ''}`}>
        <Link
          href='/'
          scroll={true}
          prefetch={false}
          onClick={toggleMenu}
        >
          <div></div>
          <div></div>
          <div></div>
        </Link>
      </div>

      {true === menuVisible &&
        <div className={styles.menuWrapper} onClick={onClick}>
          <Hero />
        </div>
      }
    </div>
  )
}
