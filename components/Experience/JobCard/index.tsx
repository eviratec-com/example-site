import React from 'react'
import { useState } from 'react'

import styles from './JobCard.module.css'

import { type Job } from '@/types/Job'

interface Props {
  job: Job
}

export default function JobCard({ job }: Props) {
  const [periodStart] = useState<string>(renderDate(job.period.start))
  const [periodEnd] = useState<string>(renderDate(job.period.end))

  function renderDate (input: Date): string {
    const dateString: string = input.toDateString()
    const month: string = dateString.split(/\s/)[1]
    const year: string = dateString.split(/\s/)[3]

    return `${month} ${year}`
  }

  return (
    <div className={styles._}>
      <div className={styles.details}>
        <span className={styles.title}>{job.title}</span>
        <span className={styles.employer}>{job.employer.name}</span>
        <ul className={styles.tech}>
          {job.tech.map((tech: string, i: number) => (
            <li key={i}>
              {tech}
            </li>
          ))}
        </ul>
        <span className={styles.period}>
          <span className={styles['period-start']}>{periodStart}</span>
          <span>-</span>
          <span className={styles['period-end']}>{periodEnd}</span>
            <span className={styles['period-duration']}>{job.period.duration}</span>
        </span>
      </div>
    </div>
  )
}
