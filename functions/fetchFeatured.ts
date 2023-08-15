import type { Post } from '@/types/Post'

import dbClient from '@/db'

export default async function fetchFeaturedPosts(type: number, limit: number): Promise<Post[]> {
  const client: any = await dbClient() // check out a single client
  const p: Promise<Post[]> = new Promise((resolve, reject) => {
    const query = `SELECT "posts".*, "feed_posts"."published", `
      + `"feeds"."id" AS "f_id", "feeds"."name" AS "f_name", `
      + `"feeds"."slug" AS "f_slug", "feeds"."created" AS "f_created", `
      + `"users"."display_name", "users"."link" AS "user_link" `
      + `FROM "features" `
      + `JOIN "posts" ON "posts"."id" = "features"."post" `
      + `JOIN "users" ON "users"."id" = "posts"."author" `
      + `JOIN "feed_posts" ON "posts"."id" = "feed_posts"."post" `
      + `JOIN "feeds" ON "feeds"."id" = "feed_posts"."feed" `
      + `WHERE "features"."type" = $1::integer `
      + `ORDER BY "features"."added" DESC `
      + `LIMIT $2::integer`

    client.query(query, [type, limit], (err, res) => {
      if (err) {
        reject(err)
        client.release() // release the client
        return
      }

      resolve(res.rows.map(row => {
        if (!row.link)
          delete row.link

        if (!row.images)
          delete row.images
        else
          row.images = row.images.split(/\n/)

        row.created = (new Date(row.created)).getTime()
        row.published = (new Date(row.published)).getTime()

        row.author = {
          id: row.author,
          link: row.user_link,
          display_name: row.display_name,
        }

        row.feed = {
          id: row.f_id,
          name: row.f_name,
          slug: row.f_slug,
          created: (new Date(row.f_created)).getTime(),
        }

        delete row.deleted

        delete row.f_id
        delete row.f_name
        delete row.f_slug
        delete row.f_created

        return row
      }))

      client.release() // release the client
    })
  })

  const result: Post[] = await p

  return result
}
