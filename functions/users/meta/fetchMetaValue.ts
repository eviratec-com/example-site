import type { UserAttribute } from '@/types/User'

import dbClient from '@/db'

export default async function fetchUserMetaValue(
  user: number,
  key: string
): Promise<string> {
  const client: any = await dbClient() // check out a single client
  const um: Promise<string> = new Promise((resolve, reject) => {
    const query = `SELECT "user_meta"."value" `
      + `FROM "user_meta" `
      + `WHERE "user" = $1::integer AND "key" = $2::varchar `
      + `AND "hidden" IS NULL`

    client.query(query, [user, key], (err, res) => {
      if (err) {
        reject(err)
        client.release() // release the client
        return
      }

      resolve(res.rows.map(row => {
        return row.value
      })[0])

      client.release() // release the client
    })
  })

  const result: string = await um

  return result
}
