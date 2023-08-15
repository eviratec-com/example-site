import type { UserProfile } from '@/types/User'
import type { Message, NewMessageWithId } from '@/types/Conversation'

import { v4 as uuidv4 } from 'uuid'

import dbClient from '@/db'

import fetchUserProfileById from '../fetchUserProfileById'

export default async function createMessage(d: NewMessageWithId): Promise<Message> {
  const m: Message = await insertMessage(d)

  const cm: boolean = await insertConversationMessage(d.conversation, m.id)

  m.sent = (new Date(m.sent)).getTime()

  return m
}

async function insertConversationMessage(conversation: number, message: number): Promise<boolean> {
  const client: any = await dbClient() // check out a single client
  const m: Promise<boolean> = new Promise((resolve, reject) => {
    const query: string = 'INSERT INTO "conversation_messages" '
      + '("conversation", "message") VALUES ($1::integer, $2::integer) '
      + `RETURNING *`

    client.query(query, [conversation, message], (err, res) => {
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


async function insertMessage(d: NewMessageWithId): Promise<Message> {
  const client: any = await dbClient() // check out a single client
  const a: UserProfile = await fetchUserProfileById(d.author.id)
  const m: Promise<Message> = new Promise((resolve, reject) => {
    const fields: ([string, string, (string|number)]|[string, string, number])[] = [
      ["author", "integer", d.author.id],
      ["content", "text", d.content],
    ]

    if (d.images) {
      fields.push(["images", "text", d.images.join("\n")])
    }

    if (d.link) {
      fields.push(["link", "text", d.link])
    }

    const query: string = 'INSERT INTO "messages" ('
      + fields.map((f, i) => `"${f[0]}"`).join(', ')
      + `, "sent") VALUES (`
      + fields.map((f, i) => `$${i+1}::${f[1]}`).join(', ')
      + `, CURRENT_TIMESTAMP) `
      + `RETURNING *`

    client.query(query, [...fields.map(f => f[2])], (err, res) => {
      if (err) {
        reject(err)
        client.release() // release the client
        return
      }

      const result = {...res.rows[0]}

      result.conversation = d.conversation
      result.author = a

      if (!result.link)
        delete result.link

      if (!result.images)
        delete result.images
      else
        result.images = result.images.split(/\n/)

      resolve(result)
      client.release() // release the client
    })
  })

  const result: Message = await m

  return result
}
