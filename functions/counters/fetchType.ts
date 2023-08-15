import dbClient from '@/db'

import type { CounterType } from '@/types/Counter'
import { CounterTopic, CounterCounts } from '@/types/CounterEnum'

export default async function fetchType(
  topic: CounterTopic, // The owner
  counts: CounterCounts
): Promise<CounterType> {
  const client: any = await dbClient() // check out a single client
  const p: Promise<CounterType> = new Promise((resolve, reject) => {
    const query: string = `SELECT * FROM "counter_types" `
      + `WHERE "topic" = $1::varchar AND "counts" = $2::varchar `
      + `LIMIT 1`

    client.query(query, [topic, counts], (err, res) => {
      if (err) {
        reject(err)
        client.release() // release the client
        return
      }

      const counterType: CounterType = res.rows[0]
      resolve(counterType)

      client.release() // release the client
    })
  })

  const result: CounterType = await p

  return result
}
