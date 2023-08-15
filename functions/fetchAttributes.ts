import type { Attribute } from '@/types/Attribute'

import dbClient from '@/db'

export default async function fetchAttributes(): Promise<Attribute[]> {
  const client: any = await dbClient() // check out a single client
  const a: Promise<Attribute[]> = new Promise((resolve, reject) => {
    const query = `SELECT * FROM "attributes" ORDER BY "order" ASC`

    client.query(query, (err, res) => {
      if (err) {
        reject(err)
        client.release() // release the client
        return
      }

      resolve(res.rows.map(row => {
        return {
          id: row.id,
          label: row.label,
          order: row.order,
        }
      }))

      client.release() // release the client
    })
  })

  const result: Attribute[] = await a

  return result
}
