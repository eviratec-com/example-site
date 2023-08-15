import type { Session } from '@/types/Session'

import dbClient from '@/db'

export default async function fetchSessionByToken(input: string): Promise<Session> {
  const client: any = await dbClient() // check out a single client
  const p: Promise<Session> = new Promise((resolve, reject) => {
    const query = `SELECT * FROM "sessions" WHERE "expiry" > `
      + `CURRENT_TIMESTAMP AND "token" = $1::text`

    client.query(query, [input], (err, res) => {
      if (err) {
        reject(err)
        client.release() // release the client
        return
      }

      res.rows[0].created = (new Date(res.rows[0].created)).getTime()
      res.rows[0].expiry = (new Date(res.rows[0].expiry)).getTime()

      delete res.rows[0].renewed

      resolve(res.rows[0])

      client.release() // release the client
    })
  })

  const result: Session = await p

  return result
}
