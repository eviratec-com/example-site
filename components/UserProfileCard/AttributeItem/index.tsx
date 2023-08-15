import React, { useCallback, useContext, useEffect, useState } from 'react'

import AttributeContext from '../AttributeContext'

import SessionContext from '@/contexts/SessionContext'

import styles from './AttributeItem.module.css'

import type { Attribute } from '@/types/Attribute'
import type { UserAttribute, UserProfile } from '@/types/User'

interface Props {
  userAttribute: UserAttribute
  onChange: (newValue: Attribute) => void
  onRemove: (attribute: number) => void
}

export default function AttributeItem({ userAttribute, onChange, onRemove }) {
  const session = useContext(SessionContext)
  const { fields, attributes } = useContext(AttributeContext)

  const [canEdit, setCanEdit] = useState<boolean>(false)
  const [editMode, setEditMode] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>(userAttribute.value)
  const [selectedAttribute, setSelectedAttribute] = useState<number>(userAttribute.attribute.id)

  const showEditor = useCallback(() => {
    if (false === canEdit) {
      return
    }

    setEditMode(true)
  }, [canEdit])

  const cancelEdit = useCallback(() => {
    if (false === editMode) {
      return
    }

    setEditMode(false)
  }, [editMode])

  const saveChanges = useCallback(() => {
    if (false === canEdit) {
      return setEditMode(false)
    }

    const route: string = `/api/user/${userAttribute.user}`
      + `/attribute/${selectedAttribute}`

    const body: UserAttribute = {
      ...userAttribute,
    }

    body.attribute.id = selectedAttribute
    body.value = inputValue

    const headers = {
      'X-Eviratecnet-Token': session.currentSession.token,
      'Content-Type': 'application/json',
    }

    const opts = {
      method: 'PUT',
      body: JSON.stringify(body),
      headers,
    }

    fetch(route, opts)
      .then((result) => {
        if (400 === result.status) {
          return result.json().then(json => {
            // handle error
          })
        }

        result.json().then(json => {
          onChange(json.filter((resultUserAttribute: UserAttribute) => {
            return resultUserAttribute.attribute.id === userAttribute.attribute.id
          })[0])
          setEditMode(false)
        })
      })
  }, [inputValue, selectedAttribute, userAttribute, onChange, canEdit, session])

  const removeFromProfile = useCallback(() => {
    if (false === canEdit) {
      return
    }

    const route: string = `/api/user/${userAttribute.user}`
      + `/attribute/${selectedAttribute}`

    const headers = {
      'X-Eviratecnet-Token': session.currentSession.token,
      'Content-Type': 'application/json',
    }

    const opts = {
      method: 'DELETE',
      headers,
    }

    fetch(route, opts)
      .then((result) => {
        if (400 === result.status) {
          return result.json().then(json => {
            // handle error
          })
        }

        result.json().then(json => {
          onRemove(selectedAttribute)
          setEditMode(false)
        })
      })
  }, [selectedAttribute, userAttribute, onRemove, canEdit, session])

  useEffect(() => {
    if (!session || !session.currentSession || !session.currentSession.token) {
      return setCanEdit(false)
    }

    setCanEdit(session.currentSession.user === userAttribute.user)
  }, [userAttribute, session])

  useEffect(() => {
    setSelectedAttribute(userAttribute.attribute.id)
  }, [userAttribute])

  useEffect(() => {
    if (0 !== userAttribute.attribute.id) {
      return
    }

    setEditMode(true)
  }, [userAttribute])

  const isAttrSelectable = useCallback((fields: UserAttribute[], attribute: number) => {
    let attrAlreadyInFields: boolean = false

    for (let field of fields) {
      // Does the attribute already have an entry in fields?
      if (field.attribute.id === attribute) {
        attrAlreadyInFields = true
      }
    }

    return attrAlreadyInFields
  }, [])

  return (
    <div className={`${styles._} ${true===editMode && styles.editing || ''}`}>
      {true === editMode &&
        <>
          <div className={styles.selectWrapper}>
            <select
              className={styles.attributeSelect}
              value={selectedAttribute}
              onChange={e => setSelectedAttribute(Number(`${e.target.value}`))}
            >
              <option
                value={0}
                key={`userAttribute/${userAttribute.id}/attr/newValue/0`}
                disabled={true}
              >
                Select one
              </option>

              {attributes.length > 0 && attributes.map((attribute: Attribute, i: number) => {
                return (
                  <option
                    value={attribute.id}
                    key={`userAttribute/${userAttribute.id}/attr/newValue/${attribute.id}`}
                    disabled={isAttrSelectable(fields, attribute.id)}
                  >
                    {attribute.label}
                  </option>
                )
              })}
            </select>
          </div>

          <div className={styles.inputWrapper}>
            <input
              className={styles.newValue}
              value={inputValue}
              onChange={e => setInputValue(String(`${e.target.value}`))}
            />
          </div>

          <span className={styles.saveButton} onClick={saveChanges}>
            Save
          </span>

          <span className={styles.cancelButton} onClick={cancelEdit}>
            Cancel
          </span>
        </>
      }

      {false === editMode &&
        <>
          <span className={styles.label}>
            {userAttribute.attribute.label}
          </span>

          <span className={styles.value}>
            {userAttribute.value}
          </span>

          {canEdit &&
            <>
              <span className={styles.editButton} onClick={removeFromProfile}>
                Hide
              </span>

              <span className={styles.editButton} onClick={showEditor}>
                Edit
              </span>
            </>
          }
        </>
      }
    </div>
  )
}
