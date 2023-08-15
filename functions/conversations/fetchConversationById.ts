import type { UserProfile } from '@/types/User'
import type { Conversation } from '@/types/Conversation'

import dbClient from '@/db'

export default async function fetchConversationById(
  input: number
): Promise<Conversation> {
  const client: any = await dbClient() // check out a single client
  const c: Promise<Conversation> = new Promise((resolve, reject) => {
    const query = `SELECT "conversations"."id", "users"."id" AS "member", `
      + `"conversations"."started_by", "conversations"."started", `
      + `"users"."dob" AS "member_dob", `
      + `"users"."display_name" AS "member_name", "users"."link" AS "member_link", `
      + `"users"."status" AS "member_status" `
      + `FROM "conversations" `
      + `  JOIN "conversation_members" `
      + `    ON "conversations"."id" = "conversation_members"."conversation" `
      + `  JOIN "users" `
      + `    ON "conversation_members"."member" = "users"."id" `
      + `WHERE "conversations"."id" = $1::integer`

    const result: Conversation = {
      id: 0,
      members: [],
      started_by: 0,
      started: 0,
    }

    client.query(query, [input], (err, res) => {
      if (err) {
        reject(err)
        client.release() // release the client
        return
      }

      resolve(res.rows.reduce((accumulator, currentValue) => {
        const currentMemberProfile: UserProfile = {
          id: currentValue.member,
          dob: '',
          link: currentValue.member_link,
          status: currentValue.member_status,
          display_name: currentValue.member_name,
        }

        accumulator.id = currentValue.id
        accumulator.members.push(currentMemberProfile)
        accumulator.started_by = accumulator.started_by
        accumulator.started = (new Date(currentValue.started)).getTime()

        if (currentValue.started_by === currentMemberProfile.id) {
          accumulator.started_by = currentMemberProfile
        }

        return accumulator
      }, result))

      client.release() // release the client
    })
  })

  const result: Conversation = await c

  return result
}
