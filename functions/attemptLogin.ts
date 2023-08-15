import type { User } from '@/types/User'
import type { Credentials, Session } from '@/types/Session'

import compareHash from './compareHash'
import createSession from './createSession'
import fetchUserByUsername from './fetchUserByUsername'

export default async function attemptLogin(c: Credentials): Promise<Session> {
  // Fetch user by username
  const user: User = await fetchUserByUsername(c.username)

  // Check password matches hash
  const match: boolean = await compareHash(c.password, user.password)

  if (false === match) {
    throw new Error('Invalid Login')
  }

  // Create session
  const session: Session = await createSession({
    user: user.id
  })

  // Return session
  return session
}
