import type { Session } from '@/types/Session'

import dbClient from '@/db'

export default async function expireSessionById(input: number): Promise<Session> {
  const client: any = await dbClient() // check out a single client
  const p: Promise<Session> = new Promise((resolve, reject) => {
    const query = `UPDATE "sessions" SET "expiry" = `
      + `CURRENT_TIMESTAMP WHERE "id" = $1::integer RETURNING *`

    client.query(query, [input], (err, res) => {
      if (err) {
        reject(err)
        client.release() // release the client
        return
      }

      delete res.rows[0].renewed

      resolve(res.rows[0])

      client.release() // release the client
    })
  })

  const result: Session = await p

  return result
}
