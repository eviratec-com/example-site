import dbClient from '@/db'

export default async function claimSiteById(
  user: number,
  site: number
): Promise<boolean> {
  const client: any = await dbClient() // check out a single client

  const claim: Promise<boolean> = new Promise((resolve, reject) => {
    const query: string = 'INSERT INTO "user_sites" '
      + '("user", "site") VALUES '
      + '($1::integer, $2::integer) '
      + `RETURNING *`

    client.query(query, [user, site], (err, res) => {
      if (err) {
        reject(err)
        client.release() // release the client
        return
      }

      resolve(true)
      client.release() // release the client
    })
  })

  const result: boolean = await claim

  return result
}
