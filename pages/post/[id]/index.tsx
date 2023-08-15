import { ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { InferGetServerSidePropsType } from 'next'
import { GetServerSideProps } from 'next'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Feed.module.css'

import fetchPostById from '@/functions/fetchPostById'
import fetchRepliesByPost from '@/functions/fetchRepliesByPost'

import Footer from '@/components/Footer'
import FeedPost from '@/components/FeedPost'
import AuthorLink from '@/components/AuthorLink'
import FeedPageHeading from '@/components/FeedPageHeading'

import SessionContext from '@/contexts/SessionContext'

import type { Post } from '@/types/Post'
import type { Feed } from '@/types/Feed'
import type { Reply } from '@/types/Reply'

interface Props {
  post: Post
  replies: Reply[]
  pageTitle: string
}

const PostPage: NextPage<Props> = ({ post, replies, pageTitle }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const id = (router.query.id as string) || ''

  const session = useContext(SessionContext)

  const description: string = post.content.split(/\n/)[0]
  const image: string = post.images
    ? post.images[0].replace(/photos\-ar\/\//, 'photos-ar/')
    : "https://www.eviratecsocial.com/og.png"

  return (
    <>
      <Head>
        <title>{`${pageTitle} - Eviratec Social Platform`}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="rgba(170, 68, 33)" />
        <meta property="og:site_name" content="Eviratec Social Platform" />
        <meta property="og:title" content={`${pageTitle} - Eviratec Social Platform`} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://www.eviratecsocial.com/post/${id}`} />
        <meta property="og:image" content={image} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@eviratec" />
        <meta name="twitter:title" content={`${pageTitle} - Eviratec Social Platform`} />
        <meta name="twitter:url" content={`https://www.eviratecsocial.com/post/${id}`} />
        <meta name="twitter:description" content={description} />

      	<meta name="twitter:image" content={image} />
      </Head>

      <main className={styles.main}>
        <FeedPageHeading>
          {pageTitle}
        </FeedPageHeading>

        <div className={styles.pageInfo}>
          <AuthorLink author={post.author} />
        </div>

        <div className={styles.posts}>
          <div className={styles.postWrapper} key={post.id}>
            <FeedPost
              post={post}
              data={{replies}}
              linkToPost={false}
              showFeedLink={true}
            />
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

function postPageTitle (post: Post): string {
  const content: string[] = post.content.split(/\n/)
  const title: string = content[0]

  // Return the full first-line of content as the title: if length < 70
  if (title.length < 70) {
    return title
  }

  // Ensure only full words in page title
  // Shorten the first line length to 70 characters, and split on white space
  const words: string[] = title.substr(0, 70).split(/\s+/)

  // Short title should include all words that fit fully in the first 70
  // characters.  Assume last word is a fragment.
  const shortTitle: string = words.slice(0, words.length-1).join(' ')

  // Return short title
  return shortTitle
}

export const getServerSideProps: GetServerSideProps<{ post: Post, replies: Reply[], pageTitle: string }> = async (context) => {
  const id: string = context.params.id as string || ''
  const post: Post = await fetchPostById(Number(`${id}`))

  if (!post) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const replies: Reply[] = await fetchRepliesByPost(post.id)

  const pageTitle: string = postPageTitle(post) || `Post by ${post.author.display_name}`

  return {
    props: {
      post,
      replies,
      pageTitle,
    },
  }
}

export default PostPage
