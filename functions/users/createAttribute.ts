import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

import dbClient from '@/db'

export default async function createUserAttribute(
  user: number,
  attribute: number,
  value: string
): Promise<boolean> {
  const client: any = await dbClient() // check out a single client
  const result: Promise<boolean> = new Promise((resolve, reject) => {
    const query: string = 'INSERT INTO "user_attributes" '
      + '("user", "attribute", "value", "updated", "hidden") VALUES '
      + '($1::integer, $2::integer, $3::text, CURRENT_TIMESTAMP, NULL) '
      + 'ON CONFLICT ("user", "attribute") '
      + 'DO UPDATE SET "value" = EXCLUDED."value", '
      + '"hidden" = NULL, "updated" = CURRENT_TIMESTAMP '
      + 'WHERE "user_attributes"."user" = $1::integer '
      + 'AND "user_attributes"."attribute" = $2::integer '
      + 'RETURNING *'

    client.query(query, [user, attribute, value], (err, res) => {
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
