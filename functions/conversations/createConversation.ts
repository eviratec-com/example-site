import type { UserProfile } from '@/types/User'
import type { Message, NewConversation, Conversation, ConversationMember } from '@/types/Conversation'

import { v4 as uuidv4 } from 'uuid'

import dbClient from '@/db'

import fetchUserProfileById from '../fetchUserProfileById'
import fetchConversationById from './fetchConversationById'

export default async function createConversation(d: NewConversation): Promise<Conversation> {
  const m: UserProfile[] = [...d.members]

  // Insert conversation
  const c: Conversation = await insertConversation(d)

  // Insert conversation members
  m.forEach(async (member) => await insertConversationMember(c, member))

  return await fetchConversationById(c.id)
}

async function insertConversation(d: NewConversation): Promise<Conversation> {
  const client: any = await dbClient() // check out a single client
  const u: UserProfile = await fetchUserProfileById('number' === typeof d.started_by ? d.started_by : d.started_by.id)
  const c: Promise<Conversation> = new Promise((resolve, reject) => {
    const query: string = 'INSERT INTO "conversations" '
      + '("started_by", "started") VALUES '
      + '($1::integer, CURRENT_TIMESTAMP) '
      + `RETURNING *`

    client.query(query, [u.id], (err, res) => {
      if (err) {
        reject(err)
        client.release() // release the client
        return
      }

      const result = {...res.rows[0]}

      result.members = [...d.members]
      result.started_by = u

      result.started = (new Date(result.started)).getTime()

      resolve(result)
      client.release() // release the client
    })
  })

  const result: Conversation = await c

  return result
}

async function insertConversationMember(c: Conversation, d: UserProfile): Promise<ConversationMember> {
  const client: any = await dbClient() // check out a single client
  const startedByUserId: number = 'number' === typeof c.started_by ? c.started_by : c.started_by.id
  const cm: Promise<ConversationMember> = new Promise((resolve, reject) => {
    const query: string = 'INSERT INTO "conversation_members" '
      + '("member", "invited", "accepted", "invited_by", "conversation") '
      + 'VALUES ($1::integer, CURRENT_TIMESTAMP, '
      + ((d.id === startedByUserId) ? 'CURRENT_TIMESTAMP, ' : 'NULL, ')
      + '$2::integer, $3::integer) RETURNING *'

    const input: number[] = [
      d.id,
      startedByUserId,
      c.id,
    ]

    client.query(query, input, (err, res) => {
      if (err) {
        reject(err)
        client.release() // release the client
        return
      }

      const result = {...res.rows[0]}

      result.invited = (new Date(result.invited)).getTime()
      result.accepted = null !== result.accepted
        ? (new Date(result.accepted)).getTime()
        : null

      resolve(result)
      client.release() // release the client
    })
  })

  const result: ConversationMember = await cm

  return result
}
