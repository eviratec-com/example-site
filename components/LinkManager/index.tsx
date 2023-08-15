import React, { useCallback } from 'react'

import type { WebPageLink } from '@/types/WebPage'

import Button from '@/components/Button'

import styles from './LinkManager.module.css'

interface Props {
  links: WebPageLink[]
  onNewForm?: (initialLink: string) => void
}

export default function LinkManager({ links, onNewForm }: Props) {
  const describeLink = useCallback((e, link: string) => {
    onNewForm && onNewForm(link)
  }, [onNewForm])

  return (
    <>
      <div className={styles.header}>
        Link{ links && links.length > 0 && 's' || ''} found on page
      </div>

      <ol className={styles._}>
        {links && links.map((link: WebPageLink) => {
          return (
            <li key={`link/${encodeURIComponent(link.href)}/${Math.random()}`}>
              <span className={styles.cursor}>&gt;</span>
              <span className={styles.linkTitle}>{link.title}</span>
              <span className={styles.linkHref}>&lt;{link.href}&gt;</span>

              <span style={{display: 'flex', flex: '1 1'}}></span>

              <Button onClick={e => describeLink(e, link.href)} className={styles.smallButton}>
                Describe
              </Button>
            </li>
          )
        })}
      </ol>
    </>
  )
}
