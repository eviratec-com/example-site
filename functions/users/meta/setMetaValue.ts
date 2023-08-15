import dbClient from '@/db'

export default async function setUserMetaValue(
  user: number,
  key: string,
  newValue: string
): Promise<boolean> {
  const client: any = await dbClient() // check out a single client
  const result: Promise<boolean> = new Promise((resolve, reject) => {
    const query: string = `INSERT INTO "user_meta" `
      + `("user", "key",  "value", "updated") `
      + `VALUES ($1::integer, $2::varchar, $3::text, CURRENT_TIMESTAMP) `
      + `ON CONFLICT ("user", "key") `
      + `DO `
      + `  UPDATE SET "value" = EXCLUDED."value" `
      + `RETURNING *`

    client.query(query, [user, key, newValue], (err, res) => {
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
