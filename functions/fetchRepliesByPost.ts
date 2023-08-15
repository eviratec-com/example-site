import type { Reply } from '@/types/Reply'

import dbClient from '@/db'

export default async function fetchRepliesByPost(id: number): Promise<Reply[]> {
  const client: any = await dbClient() // check out a single client
  const r: Promise<Reply[]> = new Promise((resolve, reject) => {
    const query = `SELECT "replies".*, "users"."display_name", `
      + `"users"."link" AS "user_link" FROM "replies" `
      + `JOIN "users" ON "users"."id" = "replies"."author" `
      + `WHERE "post" = $1::integer AND "replies"."deleted" IS NULL `
      + `ORDER BY "replies"."created" ASC `
      + `LIMIT 200 `

    client.query(query, [id], (err, res) => {
      if (err) {
        reject(err)
        client.release() // release the client
        return
      }

      resolve(res.rows.map(row => {
        row.created = (new Date(row.created)).getTime()

        row.author = {
          id: row.author,
          link: row.user_link,
          display_name: row.display_name,
        }

        delete row.deleted

        delete row.user_link
        delete row.display_name

        return row
      }))

      client.release() // release the client
    })
  })

  const result: Reply[] = await r

  return result
}
