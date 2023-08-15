import React, { ReactNode, useEffect, useCallback, useContext, useState } from 'react'
import Image from 'next/image'

import postImageLoader from '@/functions/postImageLoader'

import ProgressBar from '@/components/ProgressBar'
import LinkManager from '@/components/LinkManager'

import styles from './PostForm.module.css'

import SessionContext from '@/contexts/SessionContext'

import type { Post, NewPost } from '@/types/Post'
import type { WebPageLink } from '@/types/WebPage'

const UPLOAD_LIMIT_BYTES = 50 * 1000 * 1024

interface NewFiles {
  files: File[]
}

interface Props {
  feed: string
  uploadUrl: string
  defaultLink?: string
  onNewPost: (newPost: Post) => void
  onNewForm?: (initialLink: string) => void
}

interface ApiReqHeaders {
  'X-Eviratecnet-Token': string
  'Content-Type': string
}

enum PostFormTab {
  Main,
  ImageUpload,
}

export default function PostForm({ feed, defaultLink, onNewPost, onNewForm, uploadUrl }: Props) {
  const session = useContext(SessionContext)

  const [links, setLinks] = useState<WebPageLink[]>([])

  const [content, setContent] = useState<string>('')
  const [link, setLink] = useState<string>(defaultLink || '')

  const [submitting, setSubmitting] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [files, setFiles] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<PostFormTab>(PostFormTab.Main)

  const handleSubmit = useCallback((event): void => {
    event.preventDefault()

    // Prevent duplicate submissions
    if (true === submitting) {
      return
    }

    // Disable submit button
    setSubmitting(true)

    const c: NewPost = {
      feed: feed,
      content: content,
    }

    const headers = {
      'X-Eviratecnet-Token': session.currentSession.token,
      'Content-Type': 'application/json',
    }

    if (imageUrls.length > 0) {
      c.images = [...imageUrls]
    }

    if (link.length > 0) {
      c.link = link
    }

    fetch('/api/post', { method: 'POST', body: JSON.stringify(c), headers: headers })
      .then((result) => {
        if (400 === result.status) {
          return result.json().then(json => {
            setSuccess(false)
            setError(json.message)
            setSubmitting(false)
          })
        }
        setSuccess(true)
        setContent('')
        setImageUrls([])
        setLink('')
        setSubmitting(false)

        result.json().then(json => {
          onNewPost(json)
        })
      })
      .catch((err) => {
        setSuccess(false)
        setError(err.message)
        setSubmitting(false)
      })

  }, [feed, link, content, imageUrls, session, submitting, onNewPost])

  const addFiles = useCallback((newFiles: File[]): void => {
    setFiles([...newFiles, ...files])
  }, [files, setFiles])

  const exceedsUploadLimit = (f: File[]): boolean => {
    const uploadSize: number = [...f].reduce((accumulator, currentValue) => {
      accumulator += currentValue.size
      return accumulator
    }, 0)

    return uploadSize >= UPLOAD_LIMIT_BYTES
  }

  const onSelectFiles = useCallback((event): void => {
    const f: File[] = event.target.files
    const formData: FormData = new FormData()

    if (exceedsUploadLimit(f)) {
      return alert(`Max upload size: ${UPLOAD_LIMIT_BYTES/1024000}MB`)
    }

    addFiles(f) // for upload preview

    // Add files to form data for submission
    Array.from(f).forEach(file => {
      formData.append("files", file, file.name)
    })

    // Set auth token header
    const headers = {
      'X-Token-Header': 'X-Eviratecnet-Token',
      'X-Eviratecnet-Token': session.currentSession.token,
      'X-Callback-Url': process.env.NEXT_PUBLIC_UPLOAD_SVC_CALLBACK_URL,
      'X-Esp-Site-Id': process.env.NEXT_PUBLIC_ESP_SITE_ID,
    }

    // Post the multipart/form-data (including the files)
    fetch(uploadUrl, { method: 'POST', body: formData, headers: headers })
      .then((result) => {
        if (400 === result.status) {
          return result.json().then(json => {
            setSuccess(false)
            setError(json.message)
          })
        }

        setSuccess(true)
        setFiles([])
        setActiveTab(PostFormTab.Main)

        result.json().then(json => {
          setImageUrls([...json.uris, ...imageUrls])
        })
      })
      .catch((err) => {
        setSuccess(false)
        setError(err.message)
      })
  }, [addFiles, imageUrls, session.currentSession.token, uploadUrl])

  const fetchLinkInfo = useCallback(() => {
    (async () => {
      if (!link) {
        return
      }

      setSubmitting(true)

      const url = `/api/describeWebPage?url=${encodeURIComponent(link)}`

      // Set auth token header
      const headers = {
        'X-Eviratecnet-Token': session.currentSession.token,
      }

      const opts = {
        method: 'GET',
        headers: headers
      }

      const result = await fetch(url, opts)
      const json = await result.json()

      if (400 === result.status) {
        setSubmitting(false)
        return
      }

      if ('' !== content) {
        setSubmitting(false)
        return
      }

      setContent(json.meta.og && json.meta.og.title || json.meta.title)

      json.links
        && setLinks(json.links)

      setSubmitting(false)
    })()
  }, [link, content, setContent, session])

  const tabClass = useCallback((tab: PostFormTab): string => {
    const isSelected: boolean = activeTab === tab
    const className: string = isSelected
      ? `${styles.tabButton} ${styles.activeTab}`
      : styles.tabButton

    return className
  }, [activeTab])

  function imageClassName (imageUrl: string): string {
    if (!imageIsGif(imageUrl)) {
      return styles.postImage
    }

    return `${styles.postImage} ${styles.wideImage}`
  }

  function imageIsGif (imageUrl: string): boolean {
    return !!imageUrl.match(/\.gif/i)
  }

  useEffect(() => {
    if (!defaultLink) {
      return setLink('')
    }

    setLink(defaultLink)
  }, [defaultLink])

  // useEffect(() => {
  //   if (!link) {
  //     return
  //   }
  //
  //
  //   fetchLinkInfo()
  // }, [link])

  return (
    <div className={styles._}>
      <div className={styles.tabButtons}>
        <span
          className={tabClass(PostFormTab.Main)}
          onClick={e => setActiveTab(PostFormTab.Main)}
        >Publish</span>

        <span
          className={tabClass(PostFormTab.ImageUpload)}
          onClick={e => setActiveTab(PostFormTab.ImageUpload)}
        >Upload</span>
      </div>

      {PostFormTab.Main === activeTab &&
        <form onSubmit={handleSubmit}>
          {imageUrls && imageUrls.length > 0 &&
            <div className={`${styles.postImages} ${1 === imageUrls.length ? styles.fullSize : ''}`}>
              {imageUrls.map((imageUrl: string, i: number): ReactNode => {
                const isGif: boolean = imageIsGif(imageUrl)

                return false === isGif && (
                  <div className={`${imageClassName(imageUrl)}`} key={`newpost/img/${i}`}>
                    <div>
                      <Image
                        src={imageUrl}
                        alt={`User photo upload`}
                        fill
                        unoptimized
                        style={{
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  </div>
                ) || (
                  <div className={`${imageClassName(imageUrl)}`} key={`newpost/img/${i}`}>
                    <div>
                      <Image
                        src={imageUrl}
                        alt={`User photo upload`}
                        fill
                        unoptimized
                        style={{
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          }

          <div className={styles.postFields}>
            <div className={styles.inputFields}>
              <textarea
                name="link"
                value={link}
                onChange={e => { setLink(e.target.value)}}
                placeholder="<Link> e.g. https://www.eviratecsocial.com/"
              />

              <textarea
                name="content"
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="<Content> e.g. This is our parent brand website."
                onFocus={fetchLinkInfo}
              />
            </div>

            <button type="submit" disabled={true === submitting}>
              {true === submitting &&
                <ProgressBar
                  bgClassName={styles.progressBg}
                  fgClassName={styles.progressFg}
                />
              }

              {false === submitting &&
                <>Publish</>
              }
            </button>
          </div>
        </form>
      }

      {PostFormTab.ImageUpload === activeTab &&
        <form>
          <div className={styles.imageUploader}>
            {files.length < 1 &&
              <div className={styles.uploaderForm}>
                <input
                  className={styles.fileUpload}
                  name="upload"
                  type="file"
                  accept="image/*"
                  onChange={onSelectFiles}
                  multiple
                />

                <div className={styles.instructions}>
                  <p>
                    Drop files here, or click to select.<br />
                    <span className={styles.limit}>
                      Limit: {UPLOAD_LIMIT_BYTES / 1024000}MB per upload
                    </span>
                  </p>
                </div>
              </div>
            }

            {files && files.length > 0 &&
              <>
                <div className={styles.notice}><p>Uploading...</p></div>
                <div className={styles.fileList}>
                  {files.map((file: File, i: number): ReactNode => {
                    /* eslint-disable @next/next/no-img-element */
                    return (
                      <div className={styles.fileListItem} key={i}>
                        <img
                          src={URL.createObjectURL(file)}
                          height="100"
                          alt="User upload"
                        />
                      </div>
                    )
                    /* eslint-enable @next/next/no-img-element */
                  })}
                </div>
              </>
            }
          </div>
        </form>
      }
    </div>
  )
}
