import dbClient from '@/db'

import type { Counter, CounterType } from '@/types/Counter'

export default async function incrementCounter (
  target: number, // ID for who/what the owner of the counter
  type: CounterType, // Type information about the owner and subject
                     // (e.g. owner=Feed, subject=Posts)
  amt: number
): Promise<Counter> {
  const safeAmt: number = Math.abs(amt) // ensure positive value (>=0)

  const client: any = await dbClient() // check out a single client
  const c: Promise<Counter> = new Promise((resolve, reject) => {
    const query: string = `INSERT INTO "counters" `
      + `("target", "type",  "count") `
      + `VALUES ($1::integer, $2::integer, $3::integer) `
      + `ON CONFLICT ("target", "type") `
      + `DO `
      + `  UPDATE SET "count" = "counters"."count" + EXCLUDED.count `
      + `RETURNING *`

    client.query(query, [target, type.id, amt], (err, res) => {
      if (err) {
        reject (err)
        client.release() // release the client
        return
      }

      const counter: Counter = res.rows[0]
      resolve(counter)

      client.release() // release the client
    })
  })

  const result: Counter = await c

  return result
}
