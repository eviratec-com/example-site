import type { NextApiRequest, NextApiResponse } from 'next'
import type { UsernameAvailabilityResponse } from '@/types/Api'

import checkUsername from '@/functions/users/checkUsername'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UsernameAvailabilityResponse|Error>
) {
  try {
    const username: string = req.body.username
    const available: boolean = await checkUsername(username)

    res.status(200).json({
      username,
      available,
    })
  }
  catch (err) {
    res.status(400).json({
      name: 'CHECK_USERNAME_ERR',
      message: 'Username Check Failed'
    })
  }
}
