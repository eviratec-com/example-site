import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

import dbClient from '@/db'

export default async function changePassword(
  user: number,
  newPassword: string
): Promise<boolean> {
  const newPasswordHash: string = await bcrypt.hash(newPassword, 10)
  const client: any = await dbClient() // check out a single client
  const result: Promise<boolean> = new Promise((resolve, reject) => {

    const query: string = 'UPDATE "users" SET "password" = $2::text, '
      + '"modified" = CURRENT_TIMESTAMP WHERE "id" = $1::integer RETURNING *'

    client.query(query, [user, newPasswordHash], (err, res) => {
      if (err) {
        reject(err)
        client.release() // release the client
        return
      }

      resolve(true)
      client.release() // release the client
    })
  })

  return await result
}
