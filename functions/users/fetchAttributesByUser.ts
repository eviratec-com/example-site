import type { UserAttribute } from '@/types/User'

import dbClient from '@/db'

export default async function fetchUserAttributesByUser(user: number): Promise<UserAttribute[]> {
  const client: any = await dbClient() // check out a single client
  const ua: Promise<UserAttribute[]> = new Promise((resolve, reject) => {
    const query = `SELECT "user_attributes"."id", "user_attributes"."user", `
      + `"user_attributes"."attribute", "attributes"."label", `
      + `"user_attributes"."value", "user_attributes"."updated" `
      + `FROM "user_attributes" `
      + 'JOIN "attributes" ON "user_attributes"."attribute" = "attributes"."id" '
      + `WHERE "user_attributes"."user" = $1::integer AND "hidden" IS NULL `
      + `ORDER BY "attributes"."order" ASC`

    client.query(query, [user], (err, res) => {
      if (err) {
        reject(err)
        client.release() // release the client
        return
      }

      resolve(res.rows.map(row => {
        return {
          id: row.id,
          user: row.user,
          attribute: {
            id: row.attribute,
            label: row.label,
          },
          value: row.value,
          updated: (new Date(row.updated)).getTime(),
        }
      }))

      client.release() // release the client
    })
  })

  const result: UserAttribute[] = await ua

  return result
}
