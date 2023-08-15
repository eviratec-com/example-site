import type { NextApiRequest, NextApiResponse } from 'next'

import verifyReqUser from '@/functions/verifyReqUser'
import fetchMessagesByMember from '@/functions/conversations/fetchMessagesByMember'

import type { User } from '@/types/User'
import type { Message } from '@/types/Conversation'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Message[]|Error>
) {
  try {
    const u: User = await verifyReqUser(req)

    if (!u) {
      return res.status(400).json({
        name: 'AUTH_ERROR',
        message: 'Invalid Session'
      })
    }

    // Get the messages
    const messages: Message[] = await fetchMessagesByMember(
      Number(`${req.query.id}`),
      u.id
    )

    // Return success
    res.status(200).json(messages)
  }
  catch (err) {
    res.status(400).json({
      name: 'AUTH_ERROR',
      message: err.message
    })
  }
}
