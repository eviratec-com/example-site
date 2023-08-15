import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Login.module.css'

import Footer from '@/components/Footer'
import ChangePasswordForm from '@/components/ChangePasswordForm'

export default function ChangePassword() {
  return (
    <>
      <Head>
        <title>Change Password - Eviratec Social Platform</title>
        <meta name="description" content="Eviratec Social Platform Social Feed Change Password Form" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="rgba(170, 68, 33)" />
        <meta property="og:title" content="Change Password - Eviratec Social Platform" />
        <meta property="og:description" content="Eviratec Social Platform Social Feed Change Password Form" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.eviratecsocial.com/change-password" />
        <meta property="og:image" content="https://www.eviratecsocial.com/og.png" />
      </Head>

      <main className={styles.main}>
        <h1>Change Password</h1>

        <ChangePasswordForm />
      </main>

      <Footer />
    </>
  )
}
