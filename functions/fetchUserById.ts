import type { User } from '@/types/User'

import dbClient from '@/db'

export default async function fetchUserById(input: number): Promise<User> {
  const client: any = await dbClient() // check out a single client
  const p: Promise<User> = new Promise((resolve, reject) => {
    const query = `SELECT * FROM "users" WHERE "id" = $1::integer`

    client.query(query, [input], (err, res) => {
      if (err) {
        reject(err)
        client.release() // release the client
        return
      }

      if (res.rows.length > 0 && res.rows[0].dob) {
        delete res.rows[0].dob
      }

      resolve(res.rows[0])

      client.release() // release the client
    })
  })

  const result: User = await p

  return result
}
