import { ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { InferGetServerSidePropsType } from 'next'
import { GetServerSideProps } from 'next'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/UserProfilePage.module.css'

import fetchPostsByAuthor from '@/functions/fetchPostsByAuthor'
import fetchUserByUsername from '@/functions/fetchUserByUsername'
import fetchUserProfileById from '@/functions/fetchUserProfileById'

import Footer from '@/components/Footer'
import Button from '@/components/Button'
import FeedPost from '@/components/FeedPost'
import FeedPageHeading from '@/components/FeedPageHeading'
import UserProfileCard from '@/components/UserProfileCard'

import SessionContext from '@/contexts/SessionContext'

import type { Post } from '@/types/Post'
import type { User, UserProfile } from '@/types/User'

interface Props {
  profile: UserProfile
  posts: Post[]
}

const UserProfilePage: NextPage<Props> = ({ profile, posts }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()

  const username = (router.query.username as string) || ''
  const description: string = `${profile.display_name} on Eviratec Social Platform.com`

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [allPosts, setAllPosts] = useState<Post[]>(posts)

  const session = useContext(SessionContext)

  useEffect(() => {
    setAllPosts([...posts])
  }, [posts])

  useEffect(() => {
    setIsLoggedIn(session && session.currentSession && session.currentSession.token)
  }, [session])

  return (
    <>
      <Head>
        <title>{`${profile.display_name} on Eviratec Social Platform`}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="rgba(170, 68, 33)" />
        <meta property="og:site_name" content="Eviratec Social Platform" />
        <meta property="og:title" content={`${profile.display_name} on Eviratec Social Platform`} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={`https://www.eviratecsocial.com/u/${username}`} />
        <meta property="og:image" content="https://www.eviratecsocial.com/og.png" />
      </Head>

      <main className={styles.main}>
        <div className={styles.profileCardWrapper}>
          <UserProfileCard profile={profile} />
        </div>

        {isLoggedIn && session && session.currentSession && profile.id !== session.currentSession.user &&
          <p className={styles.sendMessage}>
            <button
              className={styles.sendMessageButton}
              onClick={() => router.push(`/start/conversation/${username}`)}>
              &#9993; Start Conversation
            </button>

            Send a message to {profile.display_name}
          </p>
        }

        {isLoggedIn && session && session.currentSession && profile.id  === session.currentSession.user && false &&
          <div className={styles.verificationButtons}>
            {(['ID_VERIFIED', 'VERIFIED'].indexOf(profile.status) < 0) &&
              <Button className={styles.verifyButton} href={`/verify/email`}>
                &#10022; Verify Email Address
              </Button>
            }

            {'ID_VERIFIED' !== profile.status &&
              <Button className={styles.verifyButton} href={`/verify/identity`}>
                &#10022; Verify Personal Identity
              </Button>
            }
          </div>
        }

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

export const getServerSideProps: GetServerSideProps<{ profile: UserProfile, posts: Post[] }> = async (context) => {
  const username: string = context.params.username as string || ''
  const user: User = await fetchUserByUsername(username)

  if (!user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const profile: UserProfile = await fetchUserProfileById(user.id)

  delete profile.dob

  const posts: Post[] = await fetchPostsByAuthor(user.id)

  return {
    props: {
      profile,
      posts,
    },
  }
}

export default UserProfilePage
