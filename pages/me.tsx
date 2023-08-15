import { useCallback, useContext, useEffect, useState } from 'react'
import { InferGetServerSidePropsType } from 'next'
import { GetServerSideProps } from 'next'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '@/styles/Feeds.module.css'

import fetchUserById from '@/functions/fetchUserById'
import fetchSessionByToken from '@/functions/fetchSessionByToken'

import Footer from '@/components/Footer'
import FeedPageHeading from '@/components/FeedPageHeading'

import SessionContext from '@/contexts/SessionContext'

import type { User } from '@/types/User'
import type { Session } from '@/types/Session'

interface Props {}

const MePage: NextPage<Props> = ({}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  // This page will redirect to /u/(username) or / if no user logged in
  return (
    <>

    </>
  )
}

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const token: string = context.req.cookies && context.req.cookies['eviratecseshid'] || ''
  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const _session: Session = await fetchSessionByToken(token)
  if (!_session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const user: User = await fetchUserById(_session.user)
  if (!user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    redirect: {
      destination: `/u/${user.username}`,
      permanent: false,
    },
  }
}

export default MePage
