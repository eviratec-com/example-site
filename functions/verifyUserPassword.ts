import type { NextApiRequest } from 'next'

import type { User } from '@/types/User'

import compareHash from './compareHash'
import fetchUserById from './fetchUserById'

import dbClient from '@/db'

export default async function verifyUserPassword(
  user: number,
  password: string
): Promise<User> {
  const u: User = await fetchUserById(user)

  // Check password matches hash
  const match: boolean = await compareHash(password, u.password)

  if (false === match) {
    throw new Error('Invalid Password')
  }

  return u
}
