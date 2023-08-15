import type { UserProfile } from '@/types/User'
import type { Conversation, Message, NewMessageWithId } from '@/types/Conversation'

import { v4 as uuidv4 } from 'uuid'

import dbClient from '@/db'

import fetchUserProfileById from '../fetchUserProfileById'

export default async function createMemberMessage(
  conversation: Conversation,
  member: UserProfile,
  message: Message
): Promise<boolean> {
  const client: any = await dbClient() // check out a single client
  const m: Promise<boolean> = new Promise((resolve, reject) => {
    const query: string = 'INSERT INTO "conversation_member_messages" ('
      + '"conversation", "member", "message", "delivered") VALUES '
      + '($1::integer, $2::integer, $3::integer, CURRENT_TIMESTAMP) '
      + `RETURNING *`

    const input: number[] = [conversation.id, member.id, message.id]

    client.query(query, input, (err, res) => {
      if (err) {
        reject(err)
        client.release() // release the client
        return
      }

      resolve(true)
      client.release() // release the client
    })
  })

  const result: boolean = await m

  return result
}
