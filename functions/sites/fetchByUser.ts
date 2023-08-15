import type { Site } from '@/types/Site'

import dbClient from '@/db'

export default async function fetchSitesByUser(id: number): Promise<Site[]> {
  const client: any = await dbClient() // check out a single client
  const s: Promise<Site[]> = new Promise((resolve, reject) => {
    const query = `SELECT "sites".* FROM "user_sites" `
      + `JOIN "sites" ON "user_sites"."site" = "sites"."id" `
      + `WHERE "user_sites"."user" = $1::int `
      + `LIMIT 100`

    client.query(query, [id], (err, res) => {
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

  const result: Site[] = await s

  return result
}
