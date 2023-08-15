import type { NextApiRequest, NextApiResponse } from 'next'

import verifyReqUser from '@/functions/verifyReqUser'
import createMessage from '@/functions/conversations/createMessage'
import createMemberMessage from '@/functions/conversations/createMemberMessage'
import fetchConversationById from '@/functions/conversations/fetchConversationById'

import type { User, UserProfile } from '@/types/User'
import type { Conversation, Message, NewMessageWithId } from '@/types/Conversation'

function userIsConversationMember (u: User, c: Conversation): boolean {
  for (let i = 0; i < c.members.length; i++) {
    let member: UserProfile = c.members[i]

    if (u.id === member.id) {
      return true
    }
  }

  return false
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Message|Error>
) {
  try {
    const u: User = await verifyReqUser(req)

    if (!u) {
      return res.status(400).json({
        name: 'AUTH_ERROR',
        message: 'Invalid Session'
      })
    }

    const c: Conversation = await fetchConversationById(Number(req.query.id))

    if (!userIsConversationMember(u, c)) {
      return res.status(400).json({
        name: 'AUTH_ERROR',
        message: 'Auth\'d user is not a member of this conversation',
      })
    }

    const d: NewMessageWithId = {
      conversation: c.id,
      author: {
        id: u.id,
        dob: u.dob,
        link: u.link,
        status: u.status,
        display_name: u.display_name,
      },
      content: req.body.content,
    }

    if (req.body.images && req.body.images.length > 0) {
      d.images = req.body.images
    }

    if (req.body.link && req.body.link.length > 0) {
      d.link = req.body.link
    }

    // Create the message
    const m: Message = await createMessage(d)

    // Create the member messages
    // for (let member in c.members) {
    for (let i = 0; i < c.members.length; i++) {
      let member: UserProfile = c.members[i]
      let memberMessage = await createMemberMessage(c, member, m)
    }

    res.status(200).json(m)
  }
  catch (err) {
    res.status(400).json({
      name: 'AUTH_ERROR',
      message: err.message
    })
  }
}
