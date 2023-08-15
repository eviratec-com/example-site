import type { UserActivity } from '@/types/User'

import dbClient from '@/db'

export default async function fetchUserActivity(user: number): Promise<UserActivity> {
  const client: any = await dbClient() // check out a single client
  const p: Promise<UserActivity> = new Promise((resolve, reject) => {
    const query = `SELECT "created", "renewed" FROM "sessions" `
      + `WHERE "user" = $1::integer `
      + `ORDER BY "renewed" DESC NULLS LAST, "created" DESC `
      + `LIMIT 1`

    client.query(query, [user], (err, res) => {
      if (err) {
        reject(err)
        client.release() // release the client
        return
      }

      const d: any = res.rows[0]

      const created: number = (new Date(d.created)).getTime()
      const renewed: number = d.renewed && (new Date(d.renewed)).getTime() || 0

      resolve({
        user: user,
        lastRenewal: renewed || created
      })

      client.release() // release the client
    })
  })

  const result: UserActivity = await p

  return result
}
