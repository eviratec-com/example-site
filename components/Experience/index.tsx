import React from 'react'
import { useState } from 'react'

import JobCard from './JobCard'

import styles from './Experience.module.css'

import { type Job } from '@/types/Job'

export default function Experience() {
  const [jobs] = useState<Job[]>([{
    title: 'Full Stack Engineer',
    tech: ['React', 'TypeScript', 'Next.js'],
    employer: {
      name: 'Nova Entertainment'
    },
    period: {
      start: new Date('July 1 2022'),
      end: new Date('Jan 1 2023'),
      duration: '6 months'
    }
  }, {
    title: 'Web Developer',
    tech: ['React', 'TypeScript', 'Next.js', 'Web3'],
    employer: {
      name: 'Block Ape Scissors'
    },
    period: {
      start: new Date('December 1 2021'),
      end: new Date('May 1 2022'),
      duration: '6 months'
    }
  }, {
    title: 'Integration Engineer',
    tech: ['React', 'TypeScript', 'Next.js'],
    employer: {
      name: 'LOKE'
    },
    period: {
      start: new Date('June 1 2021'),
      end: new Date('November 1 2021'),
      duration: '5 months'
    }
  }, {
    title: 'WordPress Developer',
    tech: ['WordPress', 'PHP', 'JavaScript'],
    employer: {
      name: 'Private Media'
    },
    period: {
      start: new Date('June 1 2020'),
      end: new Date('August 1 2020'),
      duration: '3 months'
    }
  }, {
    title: 'Web Developer',
    tech: ['Node.js', 'PHP', 'MySQL'],
    employer: {
      name: 'Crocmedia Pty Ltd'
    },
    period: {
      start: new Date('August 1 2019'),
      end: new Date('March 1 2020'),
      duration: '8 months'
    }
  }, {
    title: 'Web Developer',
    tech: ['WordPress', 'PHP', 'JavaScript'],
    employer: {
      name: 'Volume New Media'
    },
    period: {
      start: new Date('November 1 2018'),
      end: new Date('February 1 2019'),
      duration: '4 months'
    }
  }])

  return (
    <div className={styles._}>
      {jobs.map((job: Job, i: number) => {
        return (
          <div className={styles.job} key={i}>
            <JobCard job={job} />
          </div>
        )
      })}
    </div>
  )
}
