import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'

import styles from './UserProfileCard.module.css'

import LastActivity from './LastActivity'
import AttributeItem from './AttributeItem'

import SessionContext from '@/contexts/SessionContext'

import AttributeContext from './AttributeContext'

import IdentityStatus from '@/components/IdentityStatus'

import type { Attribute } from '@/types/Attribute'
import type { UserActivity, UserAttribute, UserProfile } from '@/types/User'

interface Props {
  profile: UserProfile
}

export default function UserProfileCard({ profile }: Props) {
  const session = useContext(SessionContext)

  const [fields, setFields] = useState<UserAttribute[]>([])
  const [attributes, setAttributes] = useState<Attribute[]>([])
  const [userActivity, setUserActivity] = useState<UserActivity|null>(null)

  const [error, setError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const contextValue = useMemo(() => ({
    fields,
    attributes,
  }), [fields, attributes])

  const onAttributeChange = useCallback((attribute: UserAttribute, newValue: UserAttribute) => {
    if (attribute.id && attribute.id !== newValue.id) {
      return // do nothing
    }

    // Replace the original version of the attribute that's changed, with
    // newValue
    const _newFields: UserAttribute[] = [...fields].map((field: UserAttribute) => {
      if (attribute.id === field.id) {
        return newValue
      }

      return field
    })

    if (0 === attribute.id) {
      _newFields.push(newValue)
    }

    setFields(_newFields)
  }, [fields, setFields])

  const addField = useCallback(() => {
    const newField: UserAttribute = {
      user: profile.id,
      attribute: {
        id: 0,
        label: ''
      },
      value: '',
      updated: Date.now(),
    }

    setFields([...fields, newField])
  }, [fields, profile, setFields])

  const onRemoveAttribute = useCallback((attribute) => {
    const newFields: UserAttribute[] = [...fields.filter(field => {
      return attribute !== field.attribute.id
    })]

    setFields(newFields)
  }, [fields, setFields])

  useEffect(() => {
    setLoading(true)

    fetch(`/api/user/${profile.id}/attributes`)
      .then((result) => {
        if (400 === result.status) {
          return result.json().then(json => {
            // on error: see: json.message
            setError(json.message)
            setLoading(false)
          })
        }

        result.json().then(json => {
          const fields: UserAttribute[] = [...json]
          setLoading(false)
          setFields(fields)
        })
      })
      .catch((err) => {
        // on error: see: json.message
        setError(err.message)
        setLoading(false)
      })

  }, [profile])

  useEffect(() => {
    fetch(`/api/attributes`)
      .then((result) => {
        if (400 === result.status) {
          return result.json().then(json => {
            // on error: see: json.message
          })
        }

        result.json().then(json => {
          const fields: Attribute[] = [...json]
          setAttributes(fields)
        })
      })
  }, [])

  return (
    <div className={styles._}>
      <header>
        <div className={styles.avatarWrapper}>
          <Image
            height={48}
            width={48}
            src={'/icon.png'}
            alt={`Profile picture for ${profile.display_name}`}
          />
        </div>

        <div className={styles.headlineWrapper}>
          <div className={styles.title}>
            <h1>{profile.display_name}</h1>

            <span className={styles.username}>
              ({profile.link})
            </span>
          </div>
          <div className={styles.subtitle}>
            <IdentityStatus status={profile.status} /> | <LastActivity profile={profile} />
          </div>
        </div>
      </header>

      <section className={styles.main}>
        <AttributeContext.Provider value={contextValue}>
          <ul className={styles.attributes}>
            {fields.map((field: UserAttribute, i: number) => {
              return (
                <li
                  className={styles.attribute}
                  key={`u/${profile.id}/attr/${field.attribute.id}`}
                >
                  <AttributeItem
                    userAttribute={field}
                    onChange={newValue => onAttributeChange(field, newValue)}
                    onRemove={attribute => onRemoveAttribute(attribute)}
                  />
                </li>
              )
            })}

            {error && (
              <li className={`${styles.attribute} ${styles.wide}`}>
                <span className={styles.label}>
                  Error
                </span>

                <span className={styles.value}>
                  {error}
                </span>
              </li>
            )}

            {session && session.currentSession && session.currentSession.user && session.currentSession.user === profile.id && fields.length < attributes.length &&
              <li className={`${styles.attribute} ${styles.addFieldBtnWrapper}`} onClick={e => addField()}>
                <span className={styles.addFieldBtn}>
                  + Add Field
                </span>
              </li>
            }
          </ul>
        </AttributeContext.Provider>
      </section>

      <footer>

      </footer>
    </div>
  )
}
