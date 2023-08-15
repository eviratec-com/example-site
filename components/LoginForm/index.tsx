import React, { useCallback, useContext, useId, useState } from 'react'
import { useRouter } from 'next/navigation'

import ProgressBar from '@/components/ProgressBar'

import styles from './LoginForm.module.css'

import SessionContext from '@/contexts/SessionContext'

import type { Credentials, Session } from '@/types/Session'

export default function LoginForm() {
  const router = useRouter()

  const session = useContext(SessionContext)

  const usernameInputId: string = useId()
  const passwordInputId: string = useId()

  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const handleSubmit = useCallback((event): void => {
    event.preventDefault()

    setError('')
    setLoading(true)

    const c: Credentials = {
      username: username,
      password: password,
    }

    setUsername(c.username)
    setPassword(c.password)

    fetch('/api/login', { method: 'POST', body: JSON.stringify(c), headers: {'Content-Type': 'application/json'} })
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
          session.login(json)
          router.push('/links')
        })
      })
      .catch((err) => {
        setLoading(false)
        setSuccess(false)
        setError(err.message)
      })
  }, [username, password, session, router])

  return (
    <div className={styles._}>
      <div className={styles.formWrapper}>
        <form name="login" onSubmit={handleSubmit}>
          <div className={styles.inputField}>
            <label htmlFor={usernameInputId}>Username</label>
            <input
              id={usernameInputId}
              value={username}
              name="username"
              onChange={e => setUsername(e.target.value)}
            />
          </div>

          <div className={styles.inputField}>
            <label htmlFor={passwordInputId}>Password</label>
            <input
              id={passwordInputId}
              value={password}
              name="password"
              type="password"
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div className={styles.submitButtonWrapper}>
            <button type="submit" disabled={loading}>Login</button>
          </div>
        </form>
      </div>

      {loading && (
        <div className={styles.loginResult}>
          <ProgressBar />
        </div>
      )}

      {success && (
        <div className={styles.loginResult}>
          <ProgressBar />
          <p className={styles.loginSuccess}>Login success! Redirecting...</p>
        </div>
      )}

      {error && (
        <div className={styles.loginResult}>
          <p className={styles.loginError}>Error: {error}</p>
        </div>
      )}
    </div>
  )
}
