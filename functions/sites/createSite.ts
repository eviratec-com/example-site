import dbClient from '@/db'

import type { NewSite, Site } from '@/types/Site'

export default async function createSite(d: NewSite): Promise<Site> {
  const {
    name,
    plan,
    fqdn,
    subscription
  } = d

  const client: any = await dbClient() // check out a single client

  const c: Promise<Site> = new Promise((resolve, reject) => {
    const query: string = 'INSERT INTO "sites" '
      + '("name", "plan", "fqdn", "subscription", "created") VALUES '
      + '($1::varchar, $2::varchar, $3::varchar, $4::varchar, '
      + 'CURRENT_TIMESTAMP) '
      + `RETURNING *`

    client.query(query, [name, plan, fqdn, subscription], (err, res) => {
      if (err) {
        reject(err)
        client.release() // release the client
        return
      }

      const result = {...res.rows[0]}

      result.created = (new Date(result.created)).getTime()

      resolve(result)
      client.release() // release the client
    })
  })

  const result: Site = await c

  return result
}
