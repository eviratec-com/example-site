import { useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import React from 'react'

import Link from 'next/link'

import LogoutLink from '@/components/LogoutLink'

import FeedsContext from '@/contexts/FeedsContext'
import SessionContext from '@/contexts/SessionContext'

import styles from './Hero.module.css'

import type { Feed } from '@/types/Feed'

type MenuItem = {
  label: string
  link: string
}

const ANON_MENU_ITEMS: MenuItem[] = [{
  label: 'Sign-up',
  link: '/join',
},{
  label: 'Features',
  link: '/features',
},{
  label: 'Contact Us',
  link: '/contact-us',
},{
  label: 'Plans & Pricing',
  link: '/plans-and-pricing',
}, {
  label: 'Customer Login',
  link: '/login',
}]

const USER_MENU_ITEMS: MenuItem[] = [{
  label: 'My Profile',
  link: '/me',
}, {
  label: 'My Account',
  link: '/my/account',
}, {
  label: 'Message Inbox',
  link: '/conversations',
}, {
  label: 'Support Forum',
  link: '/forum',
}]

const MENU_ITEMS: MenuItem[] = []

interface Props {
  feeds?: Feed[]
  onClick?: (e: any) => void
  homepage?: boolean
}

export default function Hero({ onClick, homepage, feeds }: Props) {
  const router = useRouter()
  const feedsCtx = useContext(FeedsContext)
  const session = useContext(SessionContext)

  const [allFeeds, setAllFeeds] = useState<Feed[]>(feeds || [])
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([...MENU_ITEMS])

  const logout = useCallback((event) => {
    event.preventDefault()
    session.logout()
    router.push('/')
  }, [session, router])

  useEffect(() => {
    const _loggedIn: boolean = session && session.currentSession
      && session.currentSession.token

    setLoggedIn(_loggedIn)

    if (_loggedIn) {
      const userMenuItems: MenuItem[] = [
        ...USER_MENU_ITEMS,
      ]

      return setMenuItems([
        ...userMenuItems,
        ...MENU_ITEMS,
      ])
    }

    setMenuItems([
      ...ANON_MENU_ITEMS,
      ...MENU_ITEMS,
    ])
  }, [session, setLoggedIn])

  useEffect(() => {
    (async () => {
      setAllFeeds([...feedsCtx.allFeeds])
    })()
  }, [setAllFeeds, feedsCtx])

  return (
    <div className={styles._}>
      <div className={styles.main}>
        <div className={styles.logo}></div>

        {allFeeds && allFeeds.length > 0 &&
          <div className={styles.feeds}>
            <div className={styles.feed}>
              <Link prefetch={false} href={`/announcements`}>Announcements</Link>
            </div>

            {[...allFeeds].slice(0, 45).map((feed: Feed, i: number) => {
              if ('announcements' === feed.slug) {
                return // We're already showing the announcements feed
              }


              // if (feed.slug.match(/\//g)) {
              //   return // Only show top-level feeds
              // }

              return (
                <div className={styles.feed} key={feed.id}>
                  <Link prefetch={false} href={`/${feed.slug}`}>
                    <span>{feed.name}</span>

                    {'postCount' in feed && Number(feed.postCount) > 0 &&
                      <span className={styles.postCount}>
                        [{feed.postCount}]
                      </span>
                    }
                  </Link>
                </div>
              )
            })}
          </div>
        }

        <div className={styles.text}>
          {homepage && (
            <h1 className={styles.primary}>Eviratec ESP</h1>
          ) || (
            <p className={styles.primary}>Eviratec ESP</p>
          )}
          <p className={styles.secondary}>EviratecSocial.Life</p>
        </div>

        <div className={styles.navigation}>
          <ol>
            {loggedIn &&
              <li>
                <Link prefetch={false} href={`/`} scroll={true} onClick={e => { logout(e); onClick && onClick(e) }}>
                  Logout &rsaquo;
                </Link>
              </li>
            }

            {menuItems.map((item: MenuItem, index: number) => {
              return (
                <li key={`menuitem-${index}`}>
                  <Link prefetch={false} href={item.link} scroll={true} onClick={e => onClick && onClick(e)}>
                    {item.label} &rsaquo;
                  </Link>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </div>
  )
}
