import type { Session } from '@/types/Session'

import { v4 as uuidv4 } from 'uuid'

import dbClient from '@/db'

export interface NewSession {
  user: number
}

export default async function createSession(d: NewSession): Promise<Session> {
  const client: any = await dbClient() // check out a single client
  const p: Promise<Session> = new Promise((resolve, reject) => {
    const query: string = `INSERT INTO "sessions" ("user", "token", "created", "expiry") `
      + `VALUES ($1::integer, $2::text, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + interval '72 hours') `
      + `RETURNING *`

    client.query(query, [d.user, complexSessionToken(d.user)], (err, res) => {
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

function complexSessionToken(user: number): string {
  return `v1.0/${user}/${Date.now()}/${uuidv4()}`
}
