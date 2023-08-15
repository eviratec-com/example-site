import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

import dbClient from '@/db'

export default async function hideUserAttribute(
  user: number,
  attribute: number
): Promise<boolean> {
  const client: any = await dbClient() // check out a single client
  const result: Promise<boolean> = new Promise((resolve, reject) => {
    const query: string = 'UPDATE "user_attributes" '
      + 'SET "hidden" = CURRENT_TIMESTAMP, "updated" = CURRENT_TIMESTAMP '
      + 'WHERE "user" = $1::integer AND "attribute" = $2::integer '
      + 'RETURNING *'

    client.query(query, [user, attribute], (err, res) => {
      if (err) {
        reject(err)
        client.release() // release the client
        return
      }

      resolve(true)
      client.release() // release the client
    })
  })

  return await result
}
