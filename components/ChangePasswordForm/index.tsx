import React, { useCallback, useContext, useEffect, useId, useState } from 'react'
import { useRouter } from 'next/navigation';

import ProgressBar from '@/components/ProgressBar'

import styles from './ChangePasswordForm.module.css'

import SessionContext from '@/contexts/SessionContext'

import type { Session } from '@/types/Session'

interface ChangePasswordReqBody {
  oldPassword: string
  newPassword: string
}

export default function ChangePasswordForm() {
  const router = useRouter()

  const session = useContext(SessionContext)

  const passwordInputId: string = useId()
  const newPasswordInputId: string = useId()
  const newPasswordConfirmInputId: string = useId()

  const [password, setPassword] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>('')

  const [loading, setLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const handleSubmit = useCallback((event): void => {
    event.preventDefault()

    setError('')
    setLoading(true)

    if (!password) {
      setError('Please provide your Current Password.')
      setLoading(false)
      return
    }

    if (newPassword !== newPasswordConfirm) {
      setError('New Password does not match New Password Confirmation.')
      setLoading(false)
      return
    }

    const c: ChangePasswordReqBody = {
      oldPassword: password,
      newPassword: newPassword,
    }

    const opts = {
      method: 'POST',
      body: JSON.stringify(c),
      headers: {
        'X-Eviratecnet-Token': session.currentSession.token,
        'Content-Type': 'application/json',
      },
    }

    fetch('/api/changePassword', opts)
      .then((result) => {
        if (400 === result.status) {
          return result.json().then(json => {
            setLoading(false)
            setSuccess(false)
            setError(json.message)
          })
        }

        result.json().then(json => {
          setLoading(false)
          setSuccess(true)
          router.push('/links')
        })
      })
      .catch((err) => {
        setLoading(false)
        setSuccess(false)
        setError(err.message)
      })
  }, [password, newPassword, newPasswordConfirm, session, router])

  useEffect(() => {
    if (!session || !session.currentSession) {
      router.push('/')
    }
  }, [session, router])

  return (
    <div className={styles._}>
      <div className={styles.formWrapper}>
        <form name="login" onSubmit={handleSubmit}>
          <div className={styles.inputField}>
            <label htmlFor={passwordInputId}>Current Password</label>
            <input
              id={passwordInputId}
              value={password}
              name="password"
              type="password"
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div className={styles.inputField}>
            <label htmlFor={newPasswordInputId}>New Password</label>
            <input
              id={newPasswordInputId}
              value={newPassword}
              name="newPassword"
              type="password"
              onChange={e => setNewPassword(e.target.value)}
            />
          </div>

          <div className={styles.inputField}>
            <label htmlFor={newPasswordConfirmInputId}>
              Confirm New Password
            </label>

            <input
              id={newPasswordConfirmInputId}
              value={newPasswordConfirm}
              name="newPasswordConfirm"
              type="password"
              onChange={e => setNewPasswordConfirm(e.target.value)}
            />
          </div>

          <div className={styles.submitButtonWrapper}>
            <button type="submit">Change Password</button>
          </div>
        </form>
      </div>

      {loading && (
        <div className={styles.result}>
          <ProgressBar />
        </div>
      )}

      {success && (
        <div className={styles.result}>
          <ProgressBar />
          <p className={styles.Success}>Success! Redirecting...</p>
        </div>
      )}

      {error && (
        <div className={styles.result}>
          <p className={styles.error}>Error: {error}</p>
        </div>
      )}
    </div>
  )
}
