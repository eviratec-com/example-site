import React from 'react'
import { useState } from 'react'

import Link from 'next/link'
import Image from 'next/image'

import styles from './Card.module.css'

import postImageLoader from '@/functions/postImageLoader'

import type { Post } from '@/types/Post'

interface Props {
  post: Post
}

export default function Card({ post }: Props) {
  const isGif: boolean = post.images && !!post.images[0].match(/\.gif/i)
  const postTitleSuffix: string = post.content.length > 30 ? '...' : ''
  const postTitle: string = post.content.substr(0,30) + postTitleSuffix
    || `Post by ${post.author.display_name}`

  // Bring this back with tags later...
  //
  // <div className={styles.tech}>
  //   <ul>
  //     {project.tech.map((tech: string, i: number) => {
  //       return (
  //         <li key={i}>
  //           {tech}
  //         </li>
  //       )
  //     })}
  //   </ul>
  // </div>

  return (
    <Link prefetch={false} className={styles._} href={`/post/${post.id}`}>
      {false === isGif && (
        <div className={styles.featureImage}>
          <div>
            <Image
              loader={postImageLoader}
              src={post.images[0]}
              alt={postTitle}
              fill
              sizes={post.images.length >= 2 ? `(max-width: 768px) 50vw,
                400px` : '800px'}
              style={{
                objectFit: 'cover',
              }}
            />
          </div>
        </div>
      ) || (
        <div className={styles.featureImage}>
          <div>
            <Image
              src={post.images[0]}
              alt={postTitle}
              fill
              unoptimized
              style={{
                objectFit: 'cover',
              }}
            />
          </div>
        </div>
      )}

      <div className={styles.details}>
        <span className={styles.title}>
          {postTitle}
        </span>

        <div className={styles.tech}>
          <ul>
            <li>{post.feed.name}</li>
          </ul>
        </div>
      </div>
    </Link>
  )
}
