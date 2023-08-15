import type { NextApiRequest, NextApiResponse } from 'next'

import compareHash from '@/functions/compareHash'
import verifyReqUser from '@/functions/verifyReqUser'
import changePassword from '@/functions/changePassword'

import type { User } from '@/types/User'
import type { UpdateSuccessResponse } from '@/types/Api'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UpdateSuccessResponse|Error>
) {
  try {
    const oldPassword: string = req.body.oldPassword
    const newPassword: string = req.body.newPassword

    const u: User = await verifyReqUser(req)

    if (!u) {
      return res.status(400).json({
        name: 'AUTH_ERROR',
        message: 'Invalid Session'
      })
    }

    // Check old password matches user current password hash
    const match: boolean = await compareHash(oldPassword, u.password)

    // Return HTTP/1.1 400 Bad Request if old password is incorrect
    if (false === match) {
      return res.status(400).json({
        name: 'INVALID_POST',
        message: 'Invalid Password',
      })
    }

    // Change the user password
    const success: boolean = await changePassword(u.id, newPassword)

    // Return success
    res.status(200).json({
      success: success,
    })
  }
  catch (err) {
    res.status(400).json({
      name: 'AUTH_ERROR',
      message: err.message
    })
  }
}
