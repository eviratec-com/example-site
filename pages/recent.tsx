import { useCallback, useContext, useEffect, useState } from 'react'
import { InferGetServerSidePropsType } from 'next'
import { GetServerSideProps } from 'next'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '@/styles/Feed.module.css'

import fetchPosts from '@/functions/fetchPosts'

import Footer from '@/components/Footer'
import FeedPost from '@/components/FeedPost'
import FeedPageHeading from '@/components/FeedPageHeading'

import SessionContext from '@/contexts/SessionContext'

import type { Post } from '@/types/Post'

interface Props {
  posts: Post[]
}

const RecentPostsPage: NextPage<Props> = ({ posts }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const session = useContext(SessionContext)

  const [allPosts, setAllPosts] = useState<Post[]>(posts)

  useEffect(() => {
    setAllPosts([
      ...posts
    ])
  }, [posts])

  return (
    <>
      <Head>
        <title>Recent Posts - Eviratec Social Platform</title>
        <meta name="description" content="Recent posts on Eviratec Social Platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="rgba(170, 68, 33)" />
        <meta property="og:title" content="Eviratec Social Platform Recent Links" />
        <meta property="og:description" content="Recent posts on Eviratec Social Platform" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.eviratecsocial.com/recent" />
        <meta property="og:image" content="https://www.eviratecsocial.com/og.png" />
      </Head>

      <main className={styles.main}>
        <FeedPageHeading>
          Recent Posts
        </FeedPageHeading>

        <div className={styles.posts}>
          {allPosts.map((post: Post, i: number) => {
            return (
              <div className={styles.postWrapper} key={post.id}>
                <FeedPost post={post} showFeedLink={true} />
              </div>
            )
          })}
        </div>
      </main>

      <Footer />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<{ posts: Post[] }> = async (context) => {
  const posts: Post[] = await fetchPosts(20)

  if (!posts || posts.length < 1) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      posts,
    },
  }
}

export default RecentPostsPage
