import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Login.module.css'

import Footer from '@/components/Footer'
import LoginForm from '@/components/LoginForm'

export default function Home() {
  return (
    <>
      <Head>
        <title>Member Login - Eviratec Social Platform</title>
        <meta name="description" content="Eviratec Social Platform Member Login Form" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="rgba(170, 68, 33)" />
        <meta property="og:title" content="Eviratec Social Platform Member Login" />
        <meta property="og:description" content="Eviratec Social Platform Member Login Form" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.eviratecsocial.com/login" />
        <meta property="og:image" content="https://www.eviratecsocial.com/og.png" />
      </Head>

      <main className={styles.main}>
        <h1>Member Login</h1>

        <LoginForm />
      </main>

      <Footer />
    </>
  )
}
