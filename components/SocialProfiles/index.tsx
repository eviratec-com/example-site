import React from 'react'

import { useState } from 'react'

import ProfileLink from './ProfileLink'

import { type SocialProfile } from '@/types/SocialProfile'

import styles from './SocialProfiles.module.css'

export default function SocialProfiles() {
  const [profiles] = useState<SocialProfile[]>([{
    service: {
      icon: 'linkedin',
      link: 'https://linkedin.com',
      name: 'LinkedIn',
    },
    link: 'https://www.linkedin.com/showcase/eviratec-social-platform/',
    user: 'Eviratec Social Platform'
  }, {
    service: {
      icon: 'facebook',
      link: 'https://www.facebook.com',
      name: 'Facebook',
    },
    link: 'https://www.facebook.com/eviratecsocial',
    user: 'Eviratec Social'
  }, {
    service: {
      icon: 'twitter',
      link: 'https://www.twitter.com',
      name: 'Twitter',
    },
    link: 'https://www.twitter.com/eviratec',
    user: '@eviratec'
  }])

  const [coderProfiles] = useState<SocialProfile[]>([{
    service: {
      icon: 'github',
      link: 'https://www.github.com',
      name: 'GitHub',
    },
    link: 'https://github.com/eviratec-com',
    user: 'eviratec-com',
  }])

  return (
    <div className={styles._}>
      <div className={styles.col}>
        <ol className={styles['link-list']}>
          {profiles.map((profile: SocialProfile, i: number) => {
            return (
              <li key={i}>
                <ProfileLink profile={profile} />
              </li>
            )
          })}
        </ol>
      </div>

      <div className={styles.col}>
        <ol className={styles['link-list']}>
          {coderProfiles.map((profile: SocialProfile, i: number) => {
            return (
              <li key={i}>
                <ProfileLink profile={profile} />
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
