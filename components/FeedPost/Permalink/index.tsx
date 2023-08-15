import React from 'react'
import Link from 'next/link'

import styles from './Permalink.module.css'

import type { Post } from '@/types/Post'

interface Props {
  post: Post
}

export default function Permalink({ post }: Props) {
  return (
    <div className={styles._}>
       <Link prefetch={false} href={`/post/${post.id}`}>&#128279; <span>Permalink</span></Link>
    </div>
  )
}
