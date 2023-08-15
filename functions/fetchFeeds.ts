import type { Feed } from '@/types/Feed'

import dbClient from '@/db'

export default async function fetchFeeds(): Promise<Feed[]> {
  const client: any = await dbClient() // check out a single client
  const p: Promise<Feed[]> = new Promise((resolve, reject) => {
    const query = `SELECT "feeds".*, "counters"."count" AS "postCount" `
      + `FROM "feeds" `
      + `JOIN "counter_types" ON "counter_types"."topic" = 'Feed' `
      + `  AND "counter_types"."counts" = 'Posts' `
      + `JOIN "counters" ON "counters"."type" = "counter_types"."id" `
      + `  AND "counters"."target" = "feeds"."id" `
      + `WHERE "deleted" IS NULL ORDER BY "name" ASC`

    client.query(query, (err, res) => {
      if (err) {
        reject(err)
        client.release() // release the client
        return
      }

      resolve(res.rows.map(row => {
        row.created = (new Date(row.created)).getTime()
        delete row.deleted
        return row
      }))

      client.release() // release the client
    })
  })

  const result: Feed[] = await p

  return result
}
