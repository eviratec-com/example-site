import type { UserProfile } from '@/types/User'

import dbClient from '@/db'

export default async function fetchUserProfileById(input: number): Promise<UserProfile> {
  const client: any = await dbClient() // check out a single client
  const p: Promise<UserProfile> = new Promise((resolve, reject) => {
    const query = `SELECT "id", "dob", "link", "status", "display_name" FROM "users" `
      + `WHERE "id" = $1::integer`

    client.query(query, [input], (err, res) => {
      if (err) {
        reject(err)
        client.release() // release the client
        return
      }

      // res.rows[0].dob = (new Date(res.rows[0].dob)).toJSON().split(/T/)[0]
      if (res.rows.length > 0 && res.rows[0].dob) {
        delete res.rows[0].dob
      }

      resolve(res.rows[0])

      client.release() // release the client
    })
  })

  const result: UserProfile = await p

  return result
}
