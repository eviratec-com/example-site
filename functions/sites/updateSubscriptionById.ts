import dbClient from '@/db'

export default async function updateSiteSubscriptionById(
  site: number,
  newValue: string
): Promise<boolean> {
  const client: any = await dbClient() // check out a single client
  const result: Promise<boolean> = new Promise((resolve, reject) => {
    const query: string = 'UPDATE "sites" '
      + 'SET "subscription" = $2::varchar '
      + 'WHERE "id" = $1::integer '
      + 'RETURNING *'

    client.query(query, [site, newValue], (err, res) => {
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
