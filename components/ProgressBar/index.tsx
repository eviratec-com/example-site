import React from 'react'

import styles from './ProgressBar.module.css'

interface Props {
  bgClassName?: string
  fgClassName?: string
}

export default function ProgressBar({ bgClassName, fgClassName }: Props) {

  return (
    <div className={styles._}>
      <div className={`${styles.circle} ${fgClassName || ''}`}>
        <div className={bgClassName || ''}></div>
      </div>
    </div>
  )
}
