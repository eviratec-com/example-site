import type { NextApiRequest, NextApiResponse } from 'next'

import verifyReqUser from '@/functions/verifyReqUser'
import fetchConversationsByMember from '@/functions/conversations/fetchConversationsByMember'

import type { User } from '@/types/User'
import type { ConversationSummary } from '@/types/Conversation'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ConversationSummary[]|Error>
) {
  try {
    const u: User = await verifyReqUser(req)

    if (!u) {
      return res.status(400).json({
        name: 'AUTH_ERROR',
        message: 'Invalid Session'
      })
    }

    // Get the user's conversation list
    const conversations: ConversationSummary[] = await fetchConversationsByMember(u.id)

    // Return success
    res.status(200).json(conversations)
  }
  catch (err) {
    res.status(400).json({
      name: 'AUTH_ERROR',
      message: err.message
    })
  }
}
