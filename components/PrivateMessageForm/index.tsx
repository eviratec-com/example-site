import React, { ReactNode, useCallback, useContext, useState } from 'react'
import Image from 'next/image'

import postImageLoader from '@/functions/postImageLoader'

import ProgressBar from '@/components/ProgressBar'

import SessionContext from '@/contexts/SessionContext'

import type { Conversation, Message } from '@/types/Conversation'

import styles from './PrivateMessageForm.module.css'

const UPLOAD_LIMIT_BYTES = 50 * 1000 * 1024

interface NewFiles {
  files: File[]
}

interface NewPrivateMessage {
  content: string
  images?: string[]
  link?: string
}

interface Props {
  uploadUrl: string
  conversation: number
  onNewMessage: (newMessage: Message) => void
}

interface ApiReqHeaders {
  'X-Eviratecnet-Token': string
  'Content-Type': string
}

enum PostFormTab {
  Main,
  ImageUpload,
}

export default function PrivateMessageForm({uploadUrl, conversation, onNewMessage}: Props) {
  const session = useContext(SessionContext)

  const [submitting, setSubmitting] = useState<boolean>(false)
  const [content, setContent] = useState<string>('')
  const [link, setLink] = useState<string>('')
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

    const c: NewPrivateMessage = {
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

    const opts = {
      method: 'POST',
      body: JSON.stringify(c),
      headers: headers,
    }

    fetch(`/api/conversation/${conversation}/message`, opts)
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
          onNewMessage(json)
        })
      })
      .catch((err) => {
        setSuccess(false)
        setError(err.message)
        setSubmitting(false)
      })

  }, [conversation, link, content, imageUrls, session, submitting, onNewMessage])

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

    if (!session || !session.currentSession || !session.currentSession.token) {
      return;
    }

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
  }, [addFiles, imageUrls, session, uploadUrl])

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

  return (
    <div className={styles._}>
      <div className={styles.tabButtons}>
        <span
          className={tabClass(PostFormTab.Main)}
          onClick={e => setActiveTab(PostFormTab.Main)}
        >Write</span>

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
                  <div className={`${imageClassName(imageUrl)}`} key={`newmessage/img/${i}`}>
                    <div>
                      <Image
                        loader={postImageLoader}
                        src={imageUrl}
                        alt={`User photo upload`}
                        fill
                        sizes={imageUrls.length >= 2 ? `(max-width: 768px) 50vw,
                          400px` : '800px'}
                        style={{
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  </div>
                ) || (
                  <div className={`${imageClassName(imageUrl)}`} key={`newmessage/img/${i}`}>
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
            <textarea
              name="content"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Start writing ..."
            />

            <button type="submit" disabled={true === submitting}>
              {true === submitting &&
                <ProgressBar
                  bgClassName={styles.progressBg}
                  fgClassName={styles.progressFg}
                />
              }

              {false === submitting &&
                <>Send</>
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
