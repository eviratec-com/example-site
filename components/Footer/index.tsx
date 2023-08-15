import React, { useContext } from 'react'

import Link from 'next/link'

import LogoutLink from '@/components/LogoutLink'

import SessionContext from '@/contexts/SessionContext'

import styles from './Footer.module.css'

export default function Footer() {
  const session = useContext(SessionContext)

  return (
    <div className={styles._}>
      <div className={styles.lhs}>
        <div className={styles.developer}>
          <Link prefetch={false} href="https://www.eviratecsocial.com/">
            EviratecSocial.com
          </Link>
        </div>

        <div className={styles.links}>
          <Link prefetch={false} href={`/recent`}>Recent Posts</Link>
          <span className={styles.linkSeparator}> | </span>
          <Link prefetch={false} href={`/forum`}>Support Forum</Link>
        </div>
      </div>

      <div className={styles.center}>
        <div>
          Powered by&nbsp;
          <Link prefetch={false} href="https://www.eviratecsocial.com/">
            Eviratec Social
          </Link>.
        </div>
      </div>

      <div className={styles.rhs}>
        <div className={styles.login}>
          <div className={styles.links}>
            <>
              {(!session.currentSession || !session.currentSession.token) &&
                <>
                  <Link prefetch={false} href={`/login`}>Login</Link>
                  <span className={styles.linkSeparator}> | </span>
                  <Link prefetch={false} href={`/join`}>Create Account</Link>
                </>
              }
            </>

            <>
              {session.currentSession && session.currentSession.token &&
                <>
                  <LogoutLink />
                  <span className={styles.linkSeparator}> | </span>
                  <Link prefetch={false} href={`/my/account`}>My Account</Link>
                </>
              }
            </>
          </div>
        </div>

        <div className={styles.copyright}>
          Copyright &copy; 2023
        </div>
      </div>
    </div>
  )
}
