import type { NextApiRequest, NextApiResponse } from 'next'

import setCookie from '@/functions/setCookie'
import expireSessionById from '@/functions/expireSessionById'
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
    return res.status(400).json({
      name: 'INVALID_TOKEN',
      message: 'Invalid or expired token',
    })
  }

  await expireSessionById(session.id)

  setCookie(res, 'eviratecseshid', '', { path: '/', maxAge: -1 })

  res.status(200).json(session)
}
