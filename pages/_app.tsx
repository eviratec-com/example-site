import '@/styles/globals.css'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { AppProps } from 'next/app'

import Layout from '@/components/Layout'
import FeedsContext from '@/contexts/FeedsContext'
import SessionContext from '@/contexts/SessionContext'

import type { Feed } from '@/types/Feed'
import type { User } from '@/types/User'
import type { Session } from '@/types/Session'

interface Props extends AppProps {
  session?: Session
}

function App({ Component, pageProps }: Props) {
  const [allFeeds, setAllFeeds] = useState<Feed[]>([])
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [currentUser, setCurrentUser] = useState<User|null>(null)
  const [currentSession, setCurrentSession] = useState<Session|null>(null)

  const fetchCurrentUser = useCallback(async () => {
    if (!currentSession) {
      return setCurrentUser(null)
    }

    const opts = {
      method: 'GET',
      headers: {
        'X-EviratecNet-Token': currentSession.token,
      }
    }

    const r = await fetch('/api/user/me', opts)
    if (200 !== r.status) {
      return
    }

    const s: User = await r.json()
    setCurrentUser(s)
  }, [currentSession])

  const login = useCallback((session) => {
    setCurrentSession(session)
    fetchCurrentUser()
  }, [setCurrentSession, fetchCurrentUser])

  const logout = useCallback(() => {
    (async () => {
      const r = await fetch('/api/logout', {method: 'POST'})
      if (200 !== r.status) {
        return
      }

      setCurrentUser(null)
      setCurrentSession(null)
    })()
  }, [setCurrentSession])

  const contextValue = useMemo(() => ({
    currentSession,
    currentUser,
    loggedIn,
    login,
    logout,
  }), [currentSession, currentUser, loggedIn, login, logout])

  // Check for session (uses cookies)
  useEffect(() => {
    (async () => {
      const r = await fetch('/api/session')
      if (200 !== r.status) {
        return
      }

      const s: Session = await r.json()
      setCurrentSession(s)
    })()
  }, [])

  const refreshFeeds = useCallback(() => {
    (async () => {
      const r = await fetch('/api/feeds')
      if (200 !== r.status) {
        return
      }

      const feeds: Feed[] = await r.json()
      setAllFeeds(feeds)
    })()
  }, [setAllFeeds])

  const feedsContextValue = useMemo(() => ({
    allFeeds,
    refreshFeeds,
  }), [allFeeds, refreshFeeds])

  // Load list of feeds
  useEffect(() => {
    if (allFeeds.length > 0) {
      return
    }

    refreshFeeds()
  }, [refreshFeeds, allFeeds.length])

  return (
    <>
      <SessionContext.Provider value={contextValue}>
        <FeedsContext.Provider value={feedsContextValue}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </FeedsContext.Provider>
      </SessionContext.Provider>
    </>
  )
}

export default App
