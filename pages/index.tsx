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
Launch Your Own Social Network | Eviratec Social Platform"

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

      <Hero homepage={true} feeds={feeds} />

      <main className={styles.main}>
        <h1>
          Eviratec Social Platform
        </h1>

        <div className={styles.dblSection}>
          <section className={`${styles.section} ${styles.imgSection}`}>
            <figure className={styles.mobileScreenshot}>
              <div className={styles.imgWrapper}>
                <Image
                  src={`https://eviratecphotos.blob.core.windows.net/assets/marketing/promotional/ESP_20230517/eviratec-com-au-signup.jpg`}
                  alt={`A screenshot of the signup form, on a mobile device, in light mode`}
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
                  src={`https://eviratecphotos.blob.core.windows.net/assets/marketing/promotional/ESP_20230517/eviratec-com-au-feed.jpg`}
                  alt={`A screenshot of a Feed, on a mobile device, in light mode`}
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'top',
                  }}
                  unoptimized
                  fill
                />
              </div>

              <figcaption>
                Mobile feed/topic page, in light mode.
              </figcaption>
            </figure>

            <figure className={styles.mobileScreenshot}>
              <div className={styles.imgWrapper}>
                <Image
                  src={`https://eviratecphotos.blob.core.windows.net/assets/marketing/promotional/ESP_20230517/eviratec-com-au-mobile-profile.jpg`}
                  alt={`A screenshot of a User Profile, on a mobile device, in light mode`}
                  style={{
                    objectFit: 'cover',
                  }}
                  unoptimized
                  fill
                />
              </div>

              <figcaption>
                Mobile user profile page, in light mode.
              </figcaption>
            </figure>
          </section>

          <section className={styles.section}>
            <TextBlock>
              <p>
                Launch your own public or private Social Network. Complete with
                photo uploads, user registration, private messaging, public
                forums, custom profile fields, reserved usernames, custom
                domain, and BYO branding.
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
              Share &amp; Connect
            </h2>
          </TextBlock>
        </section>

        <div className={`${styles.dblSection} ${styles.reverse}`}>
          <section className={`${styles.section} ${styles.desktopImgSection}`}>
            <figure className={styles.desktopScreenshot}>
              <div className={styles.imgWrapper}>
                <Image
                  src={`https://eviratecphotos.blob.core.windows.net/assets/marketing/promotional/ESP_20230517/eviratec-net-desktop-hero.png`}
                  alt={`A screenshot of the homepage from Eviratec Network (www.eviratec.net). Showing 50 link categories, with item counts. Homepage title reads Eviratec Net, Web Directory.`}
                  style={{
                    objectFit: 'contain',
                  }}
                  unoptimized
                  fill
                />
              </div>

              <figcaption>
                Eviratec Network link directory homepage (www.eviratec.net)
              </figcaption>
            </figure>
          </section>

          <section className={styles.section}>
            <TextBlock>
              <p>
                Create your own place online to share memories, make plans,
                and connect with your friends, family, staff, or team members.
              </p>

              <p>
                Near, or far: Make your own place to connect, with the people
                you care about.
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
              Features
            </h2>
          </TextBlock>
        </section>

        <section className={`${styles.section} ${styles.featuresSection}`}>
          <TextBlock>
            <div className={styles.twoCol}>
              <div className={styles.col}>
                <h3>Platform Features</h3>

                <ul>
                  <li>BYO/Custom domain name</li>
                  <li>BYO branding<br /><span>(text, logo, &amp; colours)</span></li>
                  <li>Reserved usernames</li>
                  <li>User photo uploads<br /><span>(up to 50MB per file)</span></li>
                  <li>Automatic Photo Processing<br /><span>Automatic optimise+resize photos on user upload</span></li>
                  <li>Custom Profile Fields</li>
                  <li>Bcrypt Password Security<br /><span>Passwords stored using one-way encryption</span></li>
                  <li>Custom Account Status<br /><span>(e.g. Unverified, Admin, ID Verified)</span></li>
                  <li>Signup Age Limit</li>
                </ul>

                <h3>All Plans Include</h3>

                <ul>
                  <li>Free website</li>
                  <li>Free sub-domain<br /><span>you.eviratecsocial(.online|.life)</span></li>
                  <li>Fully-managed hosting</li>
                  <li>Fault-tolerant infrastructure</li>
                  <li>Set-up in 2 business days<br /><span>(or 20% discount for 12-months)</span></li>
                  <li>Free Technical Support</li>
                </ul>

                <h3>Technical Support</h3>

                <ul>
                  <li>Phone: <span>(+61482465983)</span><br />Monday to Friday: 9AM to 5PM<br /><span>Aus Eastern Standard Time (AEST)</span></li>
                  <li>Email: <span>(support@eviratec.com)</span><br />Monday to Friday: 9AM to 5PM<br /><span>Aus Eastern Standard Time (AEST)</span></li>
                  <li>Customer Portal:<br />Monday to Friday: 9AM to 5PM<br /><span>Aus Eastern Standard Time (AEST)</span></li>
                </ul>
              </div>

              <div className={styles.col}>
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

                  <Button href="/join" className={styles.ctaBtn}>
                    Create a new site
                  </Button>
                </div>

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

                  <Button href="/join" className={styles.ctaBtn} >
                    Create a new site
                  </Button>
                </div>

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

                  <Button href="/join" className={styles.ctaBtn} >
                    Create a new site
                  </Button>
                </div>

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

                <h3>Excess Usage</h3>

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

        <section className={styles.section} id="signup">
          <TextBlock>
            <h2 style={{textAlign: 'center'}}>
              Want to know more?
            </h2>
          </TextBlock>
        </section>

        <section className={styles.section}>
          <TextBlock>
            <p style={{textAlign: 'center'}}>
              Contact us for more information.
            </p>
          </TextBlock>
        </section>

        <section className={`${styles.section} ${styles.contact}`}>
          <TextBlock>
            <p style={{display: 'none'}}>
              Get in touch with our sales team, using the following form.
            </p>

            <p>
              Call us: <br />
              <Link href="tel:+61482465983">+61 482 465 983</Link>
            </p>

            <p>
              Email us: <br />
              <Link href="mailto:sales@eviratec.com">sales@eviratec.com</Link>
            </p>
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
