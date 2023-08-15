import React from 'react'
import { useState } from 'react'

import Card from './Card'

import styles from './FeatureBlock.module.css'

import type { Post } from '@/types/Post'

interface Props {
  posts: Post[]
}

export default function FeatureBlock({ posts }: Props) {
  return (
    <div className={styles._}>
      {posts.map((post: Post, i: number) => {
        return (
          <div className={styles.cardWrapper} key={`feature/${i}/${post.id}`}>
            <Card post={post} />
          </div>
        )
      })}
    </div>
  )
}
