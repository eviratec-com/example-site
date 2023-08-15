import { useCallback, useContext, useEffect, useState } from 'react'
import { InferGetServerSidePropsType } from 'next'
import { GetServerSideProps } from 'next'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '@/styles/Feeds.module.css'

import fetchFeeds from '@/functions/fetchFeeds'

import Footer from '@/components/Footer'
import FeedPageHeading from '@/components/FeedPageHeading'

import SessionContext from '@/contexts/SessionContext'

import type { Feed } from '@/types/Feed'

interface Props {
  feeds: Feed[]
}

const FeedsPage: NextPage<Props> = ({ feeds }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const session = useContext(SessionContext)

  const [allFeeds, setAllFeeds] = useState<Feed[]>(feeds)

  return (
    <>
      <Head>
        <title>Support Forum - Eviratec Social Platform</title>
        <meta name="description" content="List of popular links on Eviratec Social Platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="rgba(170, 68, 33)" />
        <meta property="og:title" content="Browse Links on Eviratec Social Platform" />
        <meta property="og:description" content="List of popular links on Eviratec Social Platform" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.eviratecsocial.com/links" />
        <meta property="og:image" content="https://www.eviratecsocial.com/og.png" />
      </Head>

      <main className={styles.main}>
        <FeedPageHeading>
          Support Forum
        </FeedPageHeading>

        <div className={styles.feeds}>
          {allFeeds.map((feed: Feed, i: number) => {
            // if (feed.slug.match(/\//g)) {
            //   return // Only show top-level feeds
            // }

            return (
              <div className={styles.feed} key={feed.id}>
                <Link prefetch={false} href={`/${feed.slug}`}>
                  {feed.name}

                  {'postCount' in feed && Number(feed.postCount) > 0 &&
                    <span className={styles.postCount}>
                      [{feed.postCount}]
                    </span>
                  ||
                    <span className={styles.postCount}>
                      [0]
                    </span>
                  }
                </Link>
              </div>
            )
          })}
        </div>
      </main>

      <Footer />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<{ feeds: Feed[] }> = async (context) => {
  const feeds: Feed[] = await fetchFeeds()

  if (!feeds || feeds.length < 1) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      feeds,
    },
  }
}

export default FeedsPage
