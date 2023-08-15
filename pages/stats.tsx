import { useCallback, useContext, useEffect, useState } from 'react'
import { InferGetServerSidePropsType } from 'next'
import { GetServerSideProps } from 'next'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '@/styles/Stats.module.css'

import fetchSiteStats from '@/functions/fetchSiteStats'

import Footer from '@/components/Footer'
import ProgressBar from '@/components/ProgressBar'
import FeedPageHeading from '@/components/FeedPageHeading'

import type { SiteStats } from '@/types/Stat'

interface Props {
  stats: SiteStats[]
}

const StatsPage: NextPage<Props> = ({ stats }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()

  const [loading, setLoading] = useState<boolean>(true)

  const [today, setToday] = useState<SiteStats>({...stats[1]})
  const [allTime, setAllTime] = useState<SiteStats>({...stats[0]})
  const [yesterday, setYesterday] = useState<SiteStats>({...stats[2]})

  const fetchStats: () => Promise<SiteStats[]> = useCallback(async () => {
    return new Promise((resolve, reject) => {
      fetch('/api/stat/today')
        .then(result => {
          if (400 === result.status) {
            return result.json().then(json => {
              reject(new Error(json.message))
            })
          }

          result.json().then(json => {
            resolve(json)
          })
        })
        .catch(err => reject(err))
    })
  }, [])

  useEffect(() => {
    let interval

    (async () => {
      interval = setInterval(async () => {
        setLoading(true)

        const _stats: SiteStats[] = await fetchStats()

        setAllTime({..._stats[0]})
        setToday({..._stats[1]})
        setYesterday({..._stats[2]})
        setLoading(false)
      }, 5000)
    })()

    return () => clearInterval(interval)
  }, [fetchStats])

  return (
    <>
      <Head>
        <title>Site Stats - Eviratec Social Platform</title>
        <meta name="description" content="Site stats for Eviratec Social Platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="rgba(170, 68, 33)" />
        <meta property="og:title" content="Eviratec Social Platform Site Stats" />
        <meta property="og:description" content="Site stats for Eviratec Social Platform" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.eviratecsocial.com/conversations" />
        <meta property="og:image" content="https://www.eviratecsocial.com/og.png" />
      </Head>

      <main className={styles.main}>
        <div className={styles.stats}>
          <ul>
            <li>
              <span className={styles.label}>Support<br />Conversations</span>
              <span className={styles.count}>
                {allTime.ttl_support_conversations}
              </span>
              <div>
                <span className={styles.countToday}>
                  {today.ttl_support_conversations}
                </span>
                <span>&nbsp;/&nbsp;</span>
                <span className={styles.countYesterday}>
                  {yesterday.ttl_support_conversations}
                </span>
              </div>
            </li>

            <li>
              <span className={styles.label}>Admin<br />Conversations</span>
              <span className={styles.count}>
                {allTime.ttl_admin_conversations}
              </span>
              <div>
                <span className={styles.countToday}>
                  {today.ttl_admin_conversations}
                </span>
                <span>&nbsp;/&nbsp;</span>
                <span className={styles.countYesterday}>
                  {yesterday.ttl_admin_conversations}
                </span>
              </div>
            </li>

            <li>
              <span className={styles.label}>Signups</span>
              <span className={styles.count}>
                {allTime.ttl_signups}
              </span>
              <div>
                <span className={styles.countToday}>
                  {today.ttl_signups}
                </span>
                <span>&nbsp;/&nbsp;</span>
                <span className={styles.countYesterday}>
                  {yesterday.ttl_signups}
                </span>
              </div>
            </li>

            <li>
              <span className={styles.label}>Logins</span>
              <span className={styles.count}>
                {allTime.ttl_logins}
              </span>
              <div>
                <span className={styles.countToday}>
                  {today.ttl_logins}
                </span>
                <span>&nbsp;/&nbsp;</span>
                <span className={styles.countYesterday}>
                  {yesterday.ttl_logins}
                </span>
              </div>
            </li>

            <li>
              <span className={styles.label}>Posts</span>
              <span className={styles.count}>
                {allTime.ttl_posts}
              </span>
              <div>
                <span className={styles.countToday}>
                  {today.ttl_posts}
                </span>
                <span>&nbsp;/&nbsp;</span>
                <span className={styles.countYesterday}>
                  {yesterday.ttl_posts}
                </span>
              </div>
            </li>

            <li>
              <span className={styles.label}>Replies</span>
              <span className={styles.count}>
                {allTime.ttl_replies}
              </span>
              <div>
                <span className={styles.countToday}>
                  {today.ttl_replies}
                </span>
                <span>&nbsp;/&nbsp;</span>
                <span className={styles.countYesterday}>
                  {yesterday.ttl_replies}
                </span>
              </div>
            </li>

            <li>
              <span className={styles.label}>Conversations</span>
              <span className={styles.count}>
                {allTime.ttl_conversations}
              </span>
              <div>
                <span className={styles.countToday}>
                  {today.ttl_conversations}
                </span>
                <span>&nbsp;/&nbsp;</span>
                <span className={styles.countYesterday}>
                  {yesterday.ttl_conversations}
                </span>
              </div>
            </li>

            <li>
              <span className={styles.label}>Messages</span>
              <span className={styles.count}>
                {allTime.ttl_messages}
              </span>
              <div>
                <span className={styles.countToday}>
                  {today.ttl_messages}
                </span>
                <span>&nbsp;/&nbsp;</span>
                <span className={styles.countYesterday}>
                  {yesterday.ttl_messages}
                </span>
              </div>
            </li>
          </ul>
        </div>
      </main>

      <Footer />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const stats: SiteStats[] = await fetchSiteStats()
  if (!stats) {
    return {
      props: {
        stats: []
      },
    }
  }

  return {
    props: {
      stats,
    },
  }
}

export default StatsPage
