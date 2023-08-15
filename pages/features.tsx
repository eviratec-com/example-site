import { useState } from 'react'
import { InferGetServerSidePropsType } from 'next'
import { GetServerSideProps } from 'next'
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '@/styles/Features.module.css'

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
Features | Your Own Social Network | Eviratec Social Platform"

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
          Free Website Features
        </h1>





        <section className={styles.section}>
          <TextBlock>
            <h2 style={{textAlign: 'center'}}>
              Photo Uploading
            </h2>
          </TextBlock>
        </section>

        <div className={`${styles.dblSection} ${styles.reverse}`}>
          <section className={`${styles.section} ${styles.desktopImgSection}`}>
            <figure className={styles.desktopScreenshot}>
              <div className={styles.imgWrapper}>
                <Image
                  src={`https://eviratecphotos.blob.core.windows.net/assets/marketing/promotional/ESP_20230520/eviratec-upload-desktop-light.png`}
                  alt={`Photo upload input on Eviratec.com.au (desktop)`}
                  style={{
                    objectFit: 'contain',
                  }}
                  unoptimized
                  fill
                />
              </div>

              <figcaption>
                Photo upload input on Eviratec.com.au (desktop)
              </figcaption>
            </figure>
          </section>

          <section className={styles.section}>
            <TextBlock>
              <p>
                Upload and attach multiple photos, up to 50MB per image, to posts and
                private messages.
              </p>

              <ul>
                <li>Up to 50MB per image</li>
                <li>Resized on upload (jpgs only)</li>
                <li>Supports gif, png, and jpg/jpeg</li>
                <li>Multiple images per post/message</li>
              </ul>

              <p>
                <Button href="/join" className={styles.ctaBtn}>Create a new site</Button>
              </p>
            </TextBlock>
          </section>
        </div>






        <section className={styles.section}>
          <TextBlock>
            <h2 style={{textAlign: 'center'}}>
              User Registration
            </h2>
          </TextBlock>
        </section>

        <div className={`${styles.dblSection}`}>
          <section className={`${styles.section} ${styles.imgSection}`}>
            <figure className={styles.mobileScreenshot}>
              <div className={styles.imgWrapper}>
                <Image
                  src={`https://eviratecphotos.blob.core.windows.net/assets/marketing/promotional/ESP_20230520/net-signup-mobile-start.jpg`}
                  alt={`Mobile signup form, in light mode.`}
                  style={{
                    objectFit: 'cover',
                  }}
                  unoptimized
                  fill
                />
              </div>

              <figcaption>
                Mobile signup form, in light mode.
              </figcaption>
            </figure>

            <figure className={styles.mobileScreenshot}>
              <div className={styles.imgWrapper}>
                <Image
                  src={`https://eviratecphotos.blob.core.windows.net/assets/marketing/promotional/ESP_20230520/net-signup-mobile-error.jpg`}
                  alt={`Mobile signup form, input validation, in dark mode.`}
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'top',
                  }}
                  unoptimized
                  fill
                />
              </div>

              <figcaption>
                Mobile signup form, input validation, in dark mode.
              </figcaption>
            </figure>

            <figure className={styles.mobileScreenshot}>
              <div className={styles.imgWrapper}>
                <Image
                  src={`https://eviratecphotos.blob.core.windows.net/assets/marketing/promotional/ESP_20230520/net-signup-mobile-done.jpg`}
                  alt={`Mobile signup form, completed, in light mode.`}
                  style={{
                    objectFit: 'cover',
                  }}
                  unoptimized
                  fill
                />
              </div>

              <figcaption>
                Mobile signup form, completed, in light mode.
              </figcaption>
            </figure>
          </section>

          <section className={styles.section}>
            <TextBlock>
              <p>
                Let your visitors create an account.
              </p>

              <ul>
                <li>Signup Age Limit</li>
                <li>Reserved Usernames</li>
                <li>Bcrypt Password Security</li>
                <li>Custom Account Statuses</li>
              </ul>

              <p>
                <Button href="/join" className={styles.ctaBtn}>Create a new site</Button>
              </p>
            </TextBlock>
          </section>
        </div>






        <section className={styles.section}>
          <TextBlock>
            <h2 style={{textAlign: 'center'}}>
              Public Forums
            </h2>
          </TextBlock>
        </section>

        <div className={`${styles.dblSection} ${styles.reverse}`}>
          <section className={`${styles.section} ${styles.desktopImgSection}`}>
            <figure className={styles.desktopScreenshot}>
              <div className={styles.imgWrapper}>
                <Image
                  src={`https://eviratecphotos.blob.core.windows.net/assets/marketing/promotional/ESP_20230517/eviratec-net-desktop-hero.png`}
                  alt={`Eviratec Network Web Link Directory homepage (www.eviratec.net). Showing 50 link categories, with item counts. Homepage title reads Eviratec Net, Web Directory.`}
                  style={{
                    objectFit: 'contain',
                  }}
                  unoptimized
                  fill
                />
              </div>

              <figcaption>
                Eviratec Network Web Link Directory homepage
                (<Link href={`https://www.eviratec.net`}>www.eviratec.net</Link>)
              </figcaption>
            </figure>
          </section>

          <section className={styles.section}>
            <TextBlock>
              <p>
                Choose topics for your social network.
              </p>

              <ul>
                <li>Custom Links</li>
                <li>Custom URL structure<br /><span>(e.g. /forums, or /topics)</span></li>
                <li>Post photos, links, and text</li>
                <li>Comments and permalinks</li>
              </ul>

              <p>
                <Button href="/join" className={styles.ctaBtn}>Create a new site</Button>
              </p>
            </TextBlock>
          </section>
        </div>







        <section className={styles.section}>
          <TextBlock>
            <h2 style={{textAlign: 'center'}}>
              Custom Profile Fields
            </h2>
          </TextBlock>
        </section>

        <div className={`${styles.dblSection}`}>
          <section className={`${styles.section} ${styles.desktopImgSection}`}>
            <figure className={styles.desktopScreenshot}>
              <div className={styles.imgWrapper}>
                <Image
                  src={`https://eviratecphotos.blob.core.windows.net/assets/marketing/promotional/ESP_20230520/eviratec-profile-desktop.png`}
                  alt={`A screenshot of the homepage from Eviratec Social Platform (www.eviratecsocial.com). Showing 50 link categories, with item counts. Homepage title reads Eviratec Net, Web Directory.`}
                  style={{
                    objectFit: 'contain',
                  }}
                  unoptimized
                  fill
                />
              </div>

              <figcaption>
                Desktop user profile page, in dark mode
              </figcaption>
            </figure>
          </section>

          <section className={styles.section}>
            <TextBlock>
              <p>
                Let your users select profile fields to enhance their public
                profile.
              </p>

              <p>
                Add, update, and remove custom profile field types for your
                member base.
              </p>

              <p>
                <Button href="/join" className={styles.ctaBtn}>Create a new site</Button>
              </p>
            </TextBlock>
          </section>
        </div>






        <section className={styles.section}>
          <TextBlock>
            <h2 style={{textAlign: 'center'}}>
              Private Messaging
            </h2>
          </TextBlock>
        </section>

        <div className={`${styles.dblSection} ${styles.reverse}`}>
          <section className={`${styles.section} ${styles.imgSection}`}>
            <figure className={styles.mobileScreenshot}>
              <div className={styles.imgWrapper}>
                <Image
                  src={`https://eviratecphotos.blob.core.windows.net/assets/marketing/promotional/ESP_20230520/eviratec-profile-pm-mobile.jpg`}
                  alt={`Mobile Start Conversation button, in dark mode.`}
                  style={{
                    objectFit: 'cover',
                  }}
                  unoptimized
                  fill
                />
              </div>

              <figcaption>
                Mobile Start Conversation button, in dark mode.
              </figcaption>
            </figure>

            <figure className={styles.mobileScreenshot}>
              <div className={styles.imgWrapper}>
                <Image
                  src={`https://eviratecphotos.blob.core.windows.net/assets/marketing/promotional/ESP_20230520/eviratec-pms-mobile.jpg`}
                  alt={`Mobile conversation list, in light mode.`}
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'top',
                  }}
                  unoptimized
                  fill
                />
              </div>

              <figcaption>
                Mobile conversation list, in light mode.
              </figcaption>
            </figure>

            <figure className={styles.mobileScreenshot}>
              <div className={styles.imgWrapper}>
                <Image
                  src={`https://eviratecphotos.blob.core.windows.net/assets/marketing/promotional/ESP_20230520/eviratec-pm-mobile.jpg`}
                  alt={`Mobile conversation page, in dark mode`}
                  style={{
                    objectFit: 'cover',
                  }}
                  unoptimized
                  fill
                />
              </div>

              <figcaption>
                Mobile conversation page, in dark mode.
              </figcaption>
            </figure>
          </section>

          <section className={styles.section}>
            <TextBlock>
              <p>
                Members can send messages to each-other using the conversations
                functionality.
              </p>

              <p>
                Let your users interact safely, and privately without ever
                leaving your website.
              </p>

              <p>
                <Button href="/join" className={styles.ctaBtn}>Create a new site</Button>
              </p>
            </TextBlock>
          </section>
        </div>



        <section className={styles.section}>
          <TextBlock>
            <h2 style={{textAlign: 'center'}}>
              BYO Branding
            </h2>
          </TextBlock>
        </section>

        <div className={`${styles.dblSection}`}>
          <section className={`${styles.section} ${styles.desktopImgSection}`}>
            <figure className={styles.desktopScreenshot}>
              <div className={styles.imgWrapper}>
                <Image
                  src={`https://eviratecphotos.blob.core.windows.net/assets/marketing/promotional/ESP_20230520/eviratec-homepage-desktop.png`}
                  alt={`Eviratec homepage (www.eviratec.com.au)`}
                  style={{
                    objectFit: 'contain',
                  }}
                  unoptimized
                  fill
                />
              </div>

              <figcaption>
                Eviratec homepage (www.eviratec.com.au)
              </figcaption>
            </figure>
          </section>

          <section className={styles.section}>
            <TextBlock>
              <p>
                Show your customers it&apos;s really you, by adding your own logo
                and brand colours to your site.
              </p>

              <p>
                <Button href="/join" className={styles.ctaBtn}>Create a new site</Button>
              </p>
            </TextBlock>
          </section>
        </div>



        <section className={styles.section}>
          <TextBlock>
            <h2 style={{textAlign: 'center'}}>
              Platform Features
            </h2>
          </TextBlock>
        </section>

        <section className={`${styles.section} ${styles.featuresSection}`}>
          <TextBlock>
            <div className={styles.twoCol}>
              <div className={styles.col}>
                <ul>
                  <li>User photo uploads<br /><span>(up to 50MB per file)</span></li>
                  <li>Custom Profile Fields</li>
                  <li>Automatic Photo Processing<br /><span>Automatic optimise+resize photos on user upload</span></li>
                  <li>BYO branding<br /><span>(text, logo, &amp; colours)</span></li>
                  <li>BYO/Custom domain name</li>
                </ul>
              </div>

              <div className={styles.col}>
                <ul>
                  <li>Custom Account Status<br /><span>(e.g. Unverified, Admin, ID Verified)</span></li>
                  <li>Bcrypt Password Security<br /><span>Passwords stored using one-way encryption</span></li>
                  <li>Reserved usernames</li>
                  <li>Free sub-domain<br /><span>you.eviratecsocial(.online|.life)</span></li>
                  <li>Signup Age Limit</li>
                </ul>
              </div>
            </div>
          </TextBlock>
        </section>
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
