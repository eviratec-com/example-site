import type { Message } from '@/types/Conversation'

import dbClient from '@/db'

export default async function fetchMessagesByMember(
  conversation: number,
  member: number
): Promise<Message[]> {
  const client: any = await dbClient() // check out a single client
  const p: Promise<Message[]> = new Promise((resolve, reject) => {
    const query = `SELECT "conversation_member_messages"."id", `
      + `"conversation_member_messages"."conversation", `
      + `"messages"."content", "messages"."images", "messages"."link", `
      + `"messages"."sent", "messages"."author", `
      + `"users"."display_name" AS "author_name", "users"."link" AS "author_link" `
      + `FROM "conversation_member_messages" `
      + `  JOIN "messages" `
      + `    ON "conversation_member_messages"."message" = "messages"."id" `
      + `  JOIN "users" `
      + `    ON "messages"."author" = "users"."id" `
      + `  JOIN "conversation_messages" `
      + `    ON "conversation_member_messages"."message" = `
      + `      "conversation_messages"."message" `
      + `      AND "conversation_member_messages"."conversation" = `
      + `        "conversation_messages"."conversation" `
      + `WHERE "conversation_member_messages"."conversation" = $1::integer `
      + `AND "conversation_member_messages"."member" = $2::integer `
      + `AND "conversation_member_messages"."deleted" IS NULL `
      + `AND "conversation_messages"."deleted_by_author" IS NULL `
      + `ORDER BY "messages"."sent" DESC`

    const input: [number, number] = [
      conversation,
      member,
    ]

    client.query(query, input, (err, res) => {
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

        row.sent = (new Date(row.sent)).getTime()

        row.author = {
          id: row.author,
          link: row.author_link,
          display_name: row.author_name,
        }

        return row
      }))

      client.release() // release the client
    })
  })

  const result: Message[] = await p

  return result
}
