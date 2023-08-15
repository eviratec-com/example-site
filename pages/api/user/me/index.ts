import type { NextApiRequest, NextApiResponse } from 'next'

import verifyReqUser from '@/functions/verifyReqUser'

import type { User } from '@/types/User'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User|Error>
) {
  try {
    const u: User = await verifyReqUser(req)

    if (!u) {
      return res.status(400).json({
        name: 'AUTH_ERROR',
        message: 'Invalid Session'
      })
    }

    res.status(200).json(u)
  }
  catch (err) {
    res.status(400).json({
      name: 'FAILED_TO_FETCH_CURRENT_USER',
      message: `An unknown error occurred while fetching the current user.`
    })
  }
}
