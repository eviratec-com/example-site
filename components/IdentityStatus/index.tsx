import React from 'react'

import styles from './IdentityStatus.module.css'

interface Props {
  status: string
}

export default function IdentityStatus({ status }: Props) {
  if ('UNVERIFIED' === status) {
    return (
      <span className={`${styles._} ${styles.new}`}>
        &#128970; New Customer
      </span>
    )
  }

  if ('VERIFIED' === status) {
    return (
      <span className={`${styles._} ${styles.emailVerified}`}>
        &#10004; Email Verified
      </span>
    )
  }

  if ('ID_VERIFIED' === status) {
    return (
      <span className={`${styles._} ${styles.idVerified}`}>
        &#10040; ID Verified
      </span>
    )
  }

  if ('ADMIN' === status) {
    return (
      <span className={`${styles._} ${styles.admin}`}>
        &#10033; Admin
      </span>
    )
  }
}
