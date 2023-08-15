import type { NextApiRequest } from 'next'

import type { User } from '@/types/User'
import type { Session } from '@/types/Session'

import fetchUserById from './fetchUserById'
import fetchSessionByToken from './fetchSessionByToken'

import dbClient from '@/db'

export default async function verifyReqUser(req: NextApiRequest): Promise<User> {
  const token: string = req.headers['x-eviratecnet-token'] as string || ''

  if (!token) {
    throw new Error('Missing Session Token')
  }

  const s: Session = await fetchSessionByToken(token)
  const u: User = await fetchUserById(s.user)

  return u
}
