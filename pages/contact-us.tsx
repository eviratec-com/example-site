import { useState } from 'react'
import { InferGetServerSidePropsType } from 'next'
import { GetServerSideProps } from 'next'
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'

import fetchFeeds from '@/functions/fetchFeeds'

import Hero from '@/components/Hero'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import Example from '@/components/Example'
import TextBlock from '@/components/TextBlock'
import Experience from '@/components/Experience'
import SocialProfiles from '@/components/SocialProfiles'

import type { Feed } from '@/types/Feed'

interface Props {
  feeds: Feed[]
}

const META_TITLE = "\
Contact Us | Eviratec Social Platform"

const META_DESCRIPTION = "\
Launch your own public or private Social Network. Complete with photo uploads, \
user registration, private messaging, public feeds (aka boards, or forums), \
custom profile fields, reserved usernames, custom domains, and BYO branding."

const META_OG_IMAGE = "\
https://www.eviratecsocial.com/og.png"

const HomePage: NextPage<Props> = ({ feeds }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [allFeeds, setAllFeeds] = useState<Feed[]>(feeds)

  return (
    <>
      <Head>
        <title>{META_TITLE}</title>
        <meta name="description" content={`${META_DESCRIPTION}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="rgba(170, 68, 33,1)" />
        <meta property="og:title" content={`${META_TITLE}`} />
        <meta property="og:description" content={`${META_DESCRIPTION}`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.eviratecsocial.com" />
        <meta property="og:image" content={`${META_OG_IMAGE}`} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@eviratec" />
        <meta name="twitter:creator" content="@eviratec" />
        <meta name="twitter:title" content={`${META_TITLE}`} />
        <meta name="twitter:url" content="https://www.eviratecsocial.com" />
        <meta name="twitter:description" content={`${META_DESCRIPTION}`} />

        <meta name="twitter:image" content={`${META_OG_IMAGE}`} />
      </Head>

      <main className={styles.main}>
        <h1>
          Contact Us
        </h1>

        <section className={`${styles.section} ${styles.featuresSection}`}>
          <TextBlock>
            <p style={{display: 'none'}}>
              Get in touch with our sales team, using the following form.
            </p>

            <div className={styles.twoCol}>
              <div className={styles.col}>
                <p>
                  Call us: <br />
                  <Link href="tel:+61482465983">+61 482 465 983</Link>
                </p>
              </div>
              <div className={styles.col}>
                <p>
                  Email us: <br />
                  <Link href="mailto:sales@eviratec.com">sales@eviratec.com</Link>
                </p>
              </div>
            </div>
          </TextBlock>
        </section>

        <section className={styles.section}>
          <TextBlock>
            <h2 style={{textAlign: 'center'}}>
              Social Profiles
            </h2>
          </TextBlock>
        </section>

        <div className={styles.section} id="profiles">
          <SocialProfiles />
        </div>

        <section className={styles.section}>
          <TextBlock>
            <h2 style={{textAlign: 'center'}}>
              Legal
            </h2>
          </TextBlock>
        </section>

        <div className={`${styles.section} ${styles.contact}`} id="legal">
          <ul>
            <li><Link href={`/terms`}>Terms of Use</Link></li>
            <li><Link href={`/privacy`}>Privacy Policy</Link></li>
          </ul>
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
      props: {
        feeds: [],
      },
    }
  }

  return {
    props: {
      feeds,
    },
  }
}

export default HomePage
