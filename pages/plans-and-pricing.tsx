import { useState } from 'react'
import { InferGetServerSidePropsType } from 'next'
import { GetServerSideProps } from 'next'
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '@/styles/PlansAndPricing.module.css'

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
Plans and Pricing | Your Own Social Network | Eviratec Social Platform"

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
          Plans &amp; Pricing
        </h1>

        <section className={`${styles.section}`}>
          <TextBlock>
            <div className={styles.plans}>
              <div className={styles.planWrapper}>
                <div className={styles.plan}>
                  <h3>Lite</h3>

                  <div className={styles.price}>
                    <span>&#x24;13.80</span>
                    <span>Per month</span>
                    <span>Including GST</span>
                  </div>

                  <ul>
                    <li>20GB Storage</li>
                    <li>60GB Bandwidth</li>
                    <li>Email Support</li>
                  </ul>

                  <div className={styles.spacer}></div>

                  <Button href="/join" className={styles.ctaBtn}>
                    Create your site now
                  </Button>
                </div>
              </div>

              <div className={styles.planWrapper}>
                <div className={styles.plan}>
                  <h3>Standard</h3>

                  <div className={styles.price}>
                    <span>&#x24;26.80</span>
                    <span>Per month</span>
                    <span>Including GST</span>
                  </div>

                  <ul>
                    <li>40GB Storage</li>
                    <li>120GB Bandwidth</li>
                    <li>Phone & Email Support</li>
                  </ul>

                  <div className={styles.spacer}></div>

                  <Button href="/join" className={styles.ctaBtn}>
                    Create your site now
                  </Button>
                </div>
              </div>

              <div className={styles.planWrapper}>
                <div className={styles.plan}>
                  <h3>Premium</h3>

                  <div className={styles.price}>
                    <span>&#x24;48.80</span>
                    <span>Per month</span>
                    <span>Including GST</span>
                  </div>

                  <ul>
                    <li>80GB Storage</li>
                    <li>240GB Bandwidth</li>
                    <li>Phone & Email Support</li>
                  </ul>

                  <div className={styles.spacer}></div>

                  <Button href="/join" className={styles.ctaBtn}>
                    Create your site now
                  </Button>
                </div>
              </div>

              <div className={styles.planWrapper}>
                <div className={styles.plan}>
                  <h3>Enterprise</h3>

                  <div className={styles.price}>
                    <span>Call Us</span>
                    <span>For a quote</span>
                    <span>+61 482 465 983</span>
                  </div>

                  <ul>
                    <li>350GB Storage</li>
                    <li>1TB Bandwidth</li>
                    <li>Enterprise Support</li>
                    <li>Staging Site</li>
                  </ul>

                  <Button href="/contact-us" className={styles.ctaBtn}>
                    Contact us for a quote
                  </Button>
                </div>
              </div>
            </div>
          </TextBlock>
        </section>

        <section className={`${styles.section}`}>
          <TextBlock>
            <div className={styles.twoCol}>
              <div className={styles.col}>
                <h2>Platform Features</h2>

                <ul>
                  <li>BYO/Custom domain name<br /><span>Bring your own fully-qualified domain name</span></li>
                  <li>BYO branding<br /><span>(text, logo, &amp; colours)</span></li>
                  <li>Reserved usernames</li>
                  <li>User photo uploads<br /><span>(up to 50MB per file)</span></li>
                  <li>Automatic Photo Processing<br /><span>Automatic optimise+resize photos on user upload</span></li>
                  <li>Custom Profile Fields</li>
                  <li>Bcrypt Password Security<br /><span>Passwords stored using one-way encryption</span></li>
                  <li>Custom Account Status<br /><span>(e.g. Unverified, Email Verified, ID Verified)</span></li>
                  <li>Signup Age Limit</li>
                </ul>

                <h2>Excess Usage</h2>
                <ul>
                  <li>
                    Storage: &#x24;1.00<br />
                    <span>Per month, per gigabyte (GB)</span>
                  </li>
                  <li>
                    Transfer (outbound): &#x24;1.00<br />
                    <span>Per month, per gigabyte (GB)</span>
                  </li>
                </ul>
              </div>

              <div className={styles.col}>
                <h2>All Plans Include</h2>

                <ul>
                  <li>Free website</li>
                  <li>Free sub-domain<br /><span>you.eviratecsocial(.online|.life)</span></li>
                  <li>Fully-managed hosting</li>
                  <li>Free Technical Support</li>
                  <li>Fault-tolerant infrastructure</li>
                  <li>Set-up in 2 business days<br /><span>(or 20% discount for 12-months)</span></li>
                </ul>

                <h2>Technical Support</h2>

                <ul>
                  <li>Phone: <span>(+61482465983)</span><br />Monday to Friday: 9AM to 5PM<br /><span>Aus Eastern Standard Time (AEST)</span></li>
                  <li>Email: <span>(support@eviratec.com)</span><br />Monday to Friday: 9AM to 5PM<br /><span>Aus Eastern Standard Time (AEST)</span></li>
                  <li>Customer Portal:<br />Monday to Friday: 9AM to 5PM<br /><span>Aus Eastern Standard Time (AEST)</span></li>
                </ul>
              </div>
            </div>
          </TextBlock>
        </section>

        <section className={styles.section}>
          <TextBlock>
            <p className={styles.priceAsterisk}>
              * All prices quoted in Australian Dollars (AUD), inclusive of GST.
            </p>
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

export default HomePage
