import type { Post } from '@/types/Post'

import dbClient from '@/db'

// export default async function fetchPostById(input: number): Promise<Post> {
//   const p: Promise<Post> = new Promise((resolve, reject) => {
//     const client: any = dbClient()
//
//     client.connect()
//
//     const query = `SELECT * FROM "posts" WHERE "id" = $1::integer`
//
//     client.query(query, [input], (err, res) => {
//       if (err) return reject(err)
//
//       resolve(res.rows[0])
//
//       client.end()
//     })
//   })
//
//   const result: Post = await p
//
//   return result
// }

export default async function fetchPostById(input: number): Promise<Post> {
  const client: any = await dbClient() // check out a single client
  const p: Promise<Post> = new Promise((resolve, reject) => {
    const query = `SELECT "posts".*, "feed_posts"."published", `
      + `"feeds"."id" AS "f_id", "feeds"."name" AS "f_name", `
      + `"feeds"."slug" AS "f_slug", "feeds"."created" AS "f_created", `
      + `"users"."display_name", "users"."link" AS "user_link" FROM "posts" `
      + `JOIN "users" ON "users"."id" = "posts"."author" `
      + `JOIN "feed_posts" ON "posts"."id" = "feed_posts"."post" `
      + `JOIN "feeds" ON "feeds"."id" = "feed_posts"."feed" `
      + `WHERE "posts"."id" = $1::integer AND "posts"."deleted" IS NULL `

    client.query(query, [input], (err, res) => {
      if (err) {
        reject(err)
        client.release() // release the client
        return
      }

      const result = res.rows[0]

      if (!result.link)
        delete result.link

      if (!result.images)
        delete result.images
      else
        result.images = result.images.split(/\n/)

      result.created = (new Date(result.created)).getTime()
      result.published = (new Date(result.published)).getTime()

      result.author = {
        id: result.author,
        link: result.user_link,
        display_name: result.display_name,
      }

      result.feed = {
        id: result.f_id,
        name: result.f_name,
        slug: result.f_slug,
        created: (new Date(result.f_created)).getTime(),
      }

      delete result.deleted

      delete result.f_id
      delete result.f_name
      delete result.f_slug
      delete result.f_created

      resolve(result)

      client.release() // release the client
    })
  })

  const result: Post = await p

  return result
}
