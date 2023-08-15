import type { ConversationSummary } from '@/types/Conversation'

import dbClient from '@/db'

export default async function fetchConversationsByMember(
  input: number
): Promise<ConversationSummary[]> {
  const client: any = await dbClient() // check out a single client
  const c: Promise<ConversationSummary[]> = new Promise((resolve, reject) => {
    const query = `SELECT "conversations"."id", `
      + `  (SELECT "messages"."content" `
      + `    FROM "conversation_member_messages" `
      + `      JOIN "messages" ON "messages"."id" = "conversation_member_messages"."message" `
      + `    WHERE "conversation_member_messages"."conversation" = "conversations"."id" `
      + `      AND "conversation_member_messages"."member" = $1::integer `
      + `      AND "conversation_member_messages"."deleted" IS NULL `
      + `    ORDER BY "messages"."sent" DESC `
      + `    LIMIT 1 `
      + `  ) AS "last_message_content",  `
      + `  ( `
      + `    SELECT "users"."display_name" `
      + `    FROM "conversation_member_messages" `
      + `      JOIN "messages" ON "messages"."id" = "conversation_member_messages"."message" `
      + `      JOIN "users" ON "users"."id" = "messages"."author" `
      + `    WHERE "conversation_member_messages"."conversation" = "conversations"."id" `
      + `      AND "conversation_member_messages"."member" = $1::integer `
      + `      AND "conversation_member_messages"."deleted" IS NULL `
      + `    ORDER BY "messages"."sent" DESC `
      + `    LIMIT 1 `
      + `  ) AS "last_message_author", `
      + `  ( `
      + `    SELECT "messages"."sent" `
      + `    FROM "conversation_member_messages" `
      + `      JOIN "messages" ON "messages"."id" = "conversation_member_messages"."message" `
      + `    WHERE "conversation_member_messages"."conversation" = "conversations"."id" `
      + `      AND "conversation_member_messages"."member" = $1::integer `
      + `      AND "conversation_member_messages"."deleted" IS NULL `
      + `    ORDER BY "messages"."sent" DESC `
      + `    LIMIT 1 `
      + `  ) AS "last_message_sent" `
      + `FROM "conversation_members" `
      + `  JOIN "conversations" ON "conversations"."id" = `
      + `    "conversation_members"."conversation" `
      + `WHERE "conversation_members"."member" = $1::integer `
      + `ORDER BY "last_message_sent" DESC`

    client.query(query, [input], (err, res) => {
      if (err) {
        reject(err)
        client.release() // release the client
        return
      }

      resolve(res.rows.map(row => {
        const result: ConversationSummary = {
          id: row.id,
          last_message: {
            content: row.last_message_content,
            author: row.last_message_author,
            sent: row.last_message_sent,
          },
        }

        return result
      }).filter(row => {
        return !!row.last_message.author
      }))

      client.release() // release the client
    })
  })

  const result: ConversationSummary[] = await c

  return result
}
