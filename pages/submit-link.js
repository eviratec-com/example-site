import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '@/styles/Legal.module.css'

import Footer from '@/components/Footer'

export default function TermsOfUsePage() {
  return (
    <>
      <Head>
        <title>Submit Link - Eviratec Social Platform</title>
        <meta name="description" content="Eviratec Social Platform Link Submission" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="rgba(170, 68, 33)" />
        <meta property="og:title" content="Submit Link - Eviratec Social Platform" />
        <meta property="og:description" content="Eviratec Social Platform Link Submission" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.eviratecsocial.com/terms" />
        <meta property="og:image" content="https://www.eviratecsocial.com/og.png" />
      </Head>

      <main className={styles.main}>
        <h1>Submit Link</h1>
        <p>Last updated: April 20, 2023</p>

        <section className={styles.legal}>
           <p>
            To submit your link, please contact us via email:&nbsp;
            <Link href="mailto:info@eviratec.com">info@eviratec.com</Link>.
          </p>
         </section>
      </main>

      <Footer />
    </>
  )
}
