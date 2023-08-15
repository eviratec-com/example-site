import React, { useCallback, useEffect, useState } from 'react'

import styles from './LastActivity.module.css'

import type { UserActivity, UserProfile } from '@/types/User'

interface Props {
  profile: UserProfile
}

export default function LastActivity({ profile }: Props) {
  const [onlineNow, setOnlineNow] = useState<boolean>(false)
  const [lastActivity, setLastActivity] = useState<UserActivity|null>(null)

  useEffect(() => {
    setOnlineNow(false)
    setLastActivity(null)

    fetch(`/api/user/${profile.id}/lastOnline`)
      .then((result) => {
        if (400 === result.status) {
          return result.json().then(json => {
            // on error: see: json.message
          })
        }

        result.json().then(json => {
          const userActivity: UserActivity = {...json}

          if (userActivity.lastRenewal > (Date.now()-900000)) {
            setOnlineNow(true)
          }

          setLastActivity(userActivity)
        })
      })
  }, [profile])

  const howLongAgo = useCallback(() => {
    if (!lastActivity) {
      return ''
    }

    const now: number = Date.now()

    const timeBetween: number = now - lastActivity.lastRenewal

    const ONE_YEAR_IN_MS: number = 31536000000
    const ONE_MONTH_IN_MS: number = 2592000000
    const ONE_DAY_IN_MS: number = 86400000
    const ONE_HOUR_IN_MS: number = 3600000
    const ONE_MIN_IN_MS: number = 60000

    const years: number = Math.floor(timeBetween / ONE_YEAR_IN_MS)
    const yld: number = timeBetween - (years * ONE_YEAR_IN_MS)

    const months: number = Math.floor(yld / ONE_MONTH_IN_MS)
    const mld: number = yld - (months * ONE_MONTH_IN_MS)

    const days: number = Math.floor(mld / ONE_DAY_IN_MS)
    const dld: number = mld - (days * ONE_DAY_IN_MS)

    const hours: number = Math.floor(dld / ONE_HOUR_IN_MS)
    const hld: number = dld - (hours * ONE_HOUR_IN_MS)

    const mins: number = Math.floor(hld / ONE_MIN_IN_MS)
    const minld: number = hld - (mins * ONE_MIN_IN_MS)

    const str: string[] = []

    if (years) {
      str.push(`${years} year${years !== 1 ? 's' : ''}`)
    }

    if (months) {
      str.push(`${months} month${months !== 1 ? 's' : ''}`)
    }

    if (days) {
      str.push(`${days} day${days !== 1 ? 's' : ''}`)
    }

    if (str.length > 0) {
      return str.join(', ')
    }

    if (hours) {
      str.push(`${hours} hour${hours !== 1 ? 's' : ''}`)
    }

    if (str.length > 0) {
      return str.join(', ')
    }

    if (mins) {
      str.push(`${mins} mins`)
    }

    return str.join(', ')
  }, [lastActivity])

  return (
    <>
      {onlineNow && (
        <span className={styles._}>Online Now</span>
      ) || howLongAgo() && (
        <span className={styles._}>Last seen {howLongAgo()} ago</span>
      ) || (
        <span className={styles._}></span>
      )}
    </>
  )
}
