import type { UserProfile } from '@/types/User'
import type { Reply, NewReplyWithAuthor } from '@/types/Reply'

import { v4 as uuidv4 } from 'uuid'

import dbClient from '@/db'

import fetchUserProfileById from './fetchUserProfileById'

export default async function createReply(d: NewReplyWithAuthor): Promise<Reply> {
  return await insertReply(d)
}

async function insertReply(d: NewReplyWithAuthor): Promise<Reply> {
  const a: UserProfile = await fetchUserProfileById(d.author)

  const client: any = await dbClient() // check out a single client
  const r: Promise<Reply> = new Promise((resolve, reject) => {
    const fields: ([string, string, (string|number)]|[string, string, number])[] = [
      ["post", "integer", d.post],
      ["author", "integer", d.author],
      ["content", "text", d.content],
    ]

    const query: string = 'INSERT INTO "replies" ('
      + fields.map((f, i) => `"${f[0]}"`).join(', ')
      + `, "created") VALUES (`
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

      result.author = a

      result.created = (new Date(result.created)).getTime()

      delete result.deleted

      resolve(result)

      client.release() // release the client
    })
  })

  const result: Reply = await r

  return result
}
