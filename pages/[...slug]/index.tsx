import { ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { InferGetServerSidePropsType } from 'next'
import { GetServerSideProps } from 'next'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Feed.module.css'

import fetchFeedBySlug from '@/functions/fetchFeedBySlug'
import fetchPostsByFeedSlug from '@/functions/fetchPostsByFeedSlug'

import Footer from '@/components/Footer'
import FeedPost from '@/components/FeedPost'
import PostForm from '@/components/PostForm'
import FeedPageHeading from '@/components/FeedPageHeading'

import SessionContext from '@/contexts/SessionContext'

import type { Post } from '@/types/Post'
import type { Feed } from '@/types/Feed'

interface Props {
  posts: Post[]
  feed: Feed
  uploadUrl: string
}

const Feed: NextPage<Props> = ({ feed, posts, uploadUrl }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const slug = (router.query.slug as string[]) || []

  const session = useContext(SessionContext)

  const [allPosts, setAllPosts] = useState<Post[]>(posts)

  const [forms, setForms] = useState<{ link: string }[]>([])

  const onNewPost = useCallback((newPost: Post): void => {
    setAllPosts([
      newPost,
      ...allPosts
    ])
  }, [allPosts, setAllPosts]);

  const onNewForm = useCallback((newFormInitialLink: string): void => {
    setForms([
      { link: newFormInitialLink },
      ...forms
    ])
  }, [forms, setForms]);

  useEffect(() => {
    setAllPosts([...posts])
  }, [posts])

  return (
    <>
      <Head>
        <title>{`${feed.name} - Eviratec Social Platform`}</title>
        <meta name="description" content={`${feed.name} on Eviratec Social Platform`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="rgba(170, 68, 33)" />
        <meta property="og:site_name" content="Eviratec Social Platform" />
        <meta property="og:title" content={feed.name} />
        <meta property="og:description" content={`${feed.name} on Eviratec Social Platform`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.eviratecsocial.com/${slug.join('/')}`} />
        <meta property="og:image" content="https://www.eviratecsocial.com/og.png" />
      </Head>

      <main className={styles.main}>
        <FeedPageHeading>
          {feed.name}
        </FeedPageHeading>

        {session.currentSession && session.currentSession.token && [100000000,100000001,100000002,100000003].indexOf(session.currentSession.user) > -1 &&
          <>
            <div className={styles.postFormWrapper}>
              <PostForm
                uploadUrl={uploadUrl}
                feed={slug.join('/')}
                onNewPost={onNewPost}
              />
            </div>
          </>
        }

        {allPosts.length > 0 &&
          <div className={styles.posts}>
            {allPosts.map((post: Post, i: number) => {
              return (
                <div className={styles.postWrapper} key={post.id}>
                  <FeedPost post={post} showFeedLink={false} />
                </div>
              )
            })}
          </div>
        }

        {0 === allPosts.length &&
          <div className={styles.noPostsFound}>
            <p>There haven&apos;t been any posts in {feed.name}, yet.</p>
          </div>
        }
      </main>

      <Footer />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<{ feed: Feed, posts: Post[], uploadUrl: string }> = async (context) => {
  const slug: string[] = context.params.slug as string[] || []

  const feed: Feed = await fetchFeedBySlug(slug.join('/'))

  if (!feed) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const posts: Post[] = await fetchPostsByFeedSlug(slug.join('/'))

  feed.created = (new Date(feed.created)).getTime()

  const uploadUrl: string = `${process.env.NEXT_PUBLIC_UPLOAD_API_BASE}/upload`

  return {
    props: {
      feed,
      posts,
      uploadUrl,
    },
  }
}

export default Feed
