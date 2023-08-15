import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

import dbClient from '@/db'

export default async function changeUserAttribute(
  user: number,
  attribute: number,
  newValue: string
): Promise<boolean> {
  const client: any = await dbClient() // check out a single client
  const result: Promise<boolean> = new Promise((resolve, reject) => {
    const query: string = 'UPDATE "user_attributes" '
      + 'SET "value" = $3::text, "updated" = CURRENT_TIMESTAMP, "hidden" = NULL '
      + 'WHERE "user" = $1::integer AND "attribute" = $2::integer '
      + 'RETURNING *'

    client.query(query, [user, attribute, newValue], (err, res) => {
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
