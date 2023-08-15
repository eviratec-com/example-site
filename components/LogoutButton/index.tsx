import React, { useCallback, useContext } from 'react'
import type { ReactDomElement } from 'react-dom'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import Button from '@/components/Button'

import SessionContext from '@/contexts/SessionContext'

interface Props {
  children?: ReactDomElement | ReactDomElement[]
  className?: string
}

export default function LogoutButton({ children, className }: Props) {
  const router = useRouter()
  const session = useContext(SessionContext)

  const logout = useCallback((event) => {
    event.preventDefault()
    session.logout()
    router.push('/')
  }, [session, router])

  return (
    <>
      <Button
        href={`/`}
        onClick={logout}
        className={className}
      >
        {children || 'Logout'}
      </Button>
    </>
  )
}
