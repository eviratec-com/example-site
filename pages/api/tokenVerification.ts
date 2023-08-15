import type { NextApiRequest, NextApiResponse } from 'next'
import type { User, UserProfile } from '@/types/User'

import verifyReqUser from '@/functions/verifyReqUser'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserProfile|Error>
) {
  try {
    const u: User = await verifyReqUser(req)

    res.status(200).json({
      id: u.id,
      dob: u.dob,
      link: u.link,
      status: u.status,
      display_name: u.display_name,
    })
  }
  catch (err) {
    res.status(400).json({
      name: 'LOGIN_ERR',
      message: 'Invalid Login'
    })
  }
}
