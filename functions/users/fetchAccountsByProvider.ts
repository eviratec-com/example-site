import type { UserAccount } from '@/types/User'

import dbClient from '@/db'

export default async function fetchUserAccountsByProvider(
  user: number,
  provider: number
): Promise<UserAccount[]> {
  const client: any = await dbClient() // check out a single client
  const ua: Promise<UserAccount[]> = new Promise((resolve, reject) => {
    const query = `SELECT "id", "external_provider", "external_id" `
      + `FROM "user_accounts" `
      + `WHERE "user" = $1::integer AND "external_provider" = $2::integer `
      + `AND "deleted" IS NULL ORDER BY "created" desc`

    client.query(query, [user, provider], (err, res) => {
      if (err) {
        reject(err)
        client.release() // release the client
        return
      }

      resolve(res.rows.map(row => {
        return {
          id: row.id,
          external_id: row.external_id,
          external_provider: row.external_provider,
        }
      }))

      client.release() // release the client
    })
  })

  const result: UserAccount[] = await ua

  return result
}
