import type { NextApiRequest, NextApiResponse } from 'next'

import setCookie from '@/functions/setCookie'
import extendSessionById from '@/functions/extendSessionById'
import fetchSessionByToken from '@/functions/fetchSessionByToken'

import type { Session } from '@/types/Session'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Session|Error>
) {
  const token: string = req.cookies['eviratecseshid'] || ''

  if (!token) {
    return res.status(400).json({
      name: 'NO_TOKEN',
      message: 'No token',
    })
  }

  const session: Session = await fetchSessionByToken(token)
  if (!session) {
    // The session is invalid
    return res.status(400).json({
      name: 'INVALID_TOKEN',
      message: 'Invalid or expired token',
    })
  }

  // Add another 24 hours to the session
  await extendSessionById(session.id)

  // Extend the cookie by another 24 hours
  setCookie(res, 'eviratecseshid', session.token, { path: '/', maxAge: 86400 })

  res.status(200).json(session)
}
