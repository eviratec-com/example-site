import type { Feed } from '@/types/Feed'

import dbClient from '@/db'

export default async function fetchFeedBySlug(input: string): Promise<Feed> {
  const client: any = await dbClient() // check out a single client
  const p: Promise<Feed> = new Promise((resolve, reject) => {
    const query = `SELECT "feeds".*, "counters"."count" AS "postCount" `
      + `FROM "feeds" `
      + `JOIN "counter_types" ON "counter_types"."topic" = 'Feed' `
      + `  AND "counter_types"."counts" = 'Posts' `
      + `JOIN "counters" ON "counters"."type" = "counter_types"."id" `
      + `  AND "counters"."target" = "feeds"."id" `
      + `WHERE "slug" = $1::text`

    client.query(query, [input], (err, res) => {
      if (err) {
        reject(err)
        client.release() // release the client
        return
      }

      resolve(res.rows.map(row => {
        row.created = (new Date(row.created)).getTime()
        delete row.deleted
        return row
      })[0])

      client.release() // release the client
    })
  })

  const result: Feed = await p

  return result
}
