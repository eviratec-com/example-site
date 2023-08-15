import type { SiteStats } from '@/types/Stat'

import dbClient from '@/db'

export default async function fetchSiteStats(): Promise<SiteStats[]> {
  const [
    alltime,
    today,
    yesterday
  ] = await Promise.all([
    fetchForAllTime(),
    fetchForToday(),
    fetchForYesterday(),
  ])

  return [
    alltime,
    today,
    yesterday,
  ]
}

async function fetchForAllTime (): Promise<SiteStats> {
  const client: any = await dbClient() // check out a single client
  return new Promise((resolve, reject) => {
    const query = `SELECT `
      + `(SELECT COUNT(*) FROM "users") AS "ttl_signups", `
      + `(SELECT COUNT(*) FROM "sessions") AS "ttl_logins", `
      + `(SELECT COUNT(*) FROM "posts") AS "ttl_posts", `
      + `(SELECT COUNT(*) FROM "replies") AS "ttl_replies", `
      + `(SELECT COUNT(*) FROM "conversations") AS "ttl_conversations", `
      + `(SELECT COUNT(*) FROM "messages") AS "ttl_messages", `
      + `(SELECT COUNT(*) FROM "conversation_members" `
      + `  WHERE "member" = 100000012) AS "ttl_support_conversations", `
      + `(SELECT COUNT(*) FROM "conversation_members" `
      + `  WHERE "member" = 100000011) AS "ttl_admin_conversations"`

    client.query(query, (err, res) => {
      if (err) {
        reject(err)
        client.release() // release the client
        return
      }

      resolve(res.rows[0])

      client.release() // release the client
    })
  })
}

async function fetchForToday (): Promise<SiteStats> {
  const client: any = await dbClient() // check out a single client
  return new Promise((resolve, reject) => {
    const query = `SELECT `
      + `(SELECT COUNT(*) FROM "users" `
      + `  WHERE "created" > CURRENT_DATE) AS "ttl_signups", `
      + `(SELECT COUNT(*) FROM "sessions" `
      + `  WHERE "created" > CURRENT_DATE) AS "ttl_logins", `
      + `(SELECT COUNT(*) FROM "posts" `
      + `  WHERE "created" > CURRENT_DATE) AS "ttl_posts", `
      + `(SELECT COUNT(*) FROM "replies" `
      + `  WHERE "created" > CURRENT_DATE) AS "ttl_replies", `
      + `(SELECT COUNT(*) FROM "conversations" `
      + `  WHERE "started" > CURRENT_DATE) AS "ttl_conversations", `
      + `(SELECT COUNT(*) FROM "messages" `
      + `  WHERE "sent" > CURRENT_DATE) AS "ttl_messages", `
      + `(SELECT COUNT(*) FROM "conversation_members" `
      + `  WHERE "invited" > CURRENT_DATE AND "member" = 100000012) `
      + `    AS "ttl_support_conversations", `
      + `(SELECT COUNT(*) FROM "conversation_members" `
      + `  WHERE "invited" > CURRENT_DATE AND "member" = 100000011) `
      + `    AS "ttl_admin_conversations"`

    client.query(query, (err, res) => {
      if (err) {
        reject(err)
        client.release() // release the client
        return
      }

      resolve(res.rows[0])

      client.release() // release the client
    })
  })
}

async function fetchForYesterday (): Promise<SiteStats> {
  const client: any = await dbClient() // check out a single client
  return new Promise((resolve, reject) => {
    const query = `SELECT `
      + `(SELECT COUNT(*) FROM "users" `
      + `  WHERE "created" > (CURRENT_DATE-INTERVAL '24 HOUR')) AS "ttl_signups", `
      + `(SELECT COUNT(*) FROM "sessions" `
      + `  WHERE "created" > (CURRENT_DATE-INTERVAL '24 HOUR')) AS "ttl_logins", `
      + `(SELECT COUNT(*) FROM "posts" `
      + `  WHERE "created" > (CURRENT_DATE-INTERVAL '24 HOUR')) AS "ttl_posts", `
      + `(SELECT COUNT(*) FROM "replies" `
      + `  WHERE "created" > (CURRENT_DATE-INTERVAL '24 HOUR')) AS "ttl_replies", `
      + `(SELECT COUNT(*) FROM "conversations" `
      + `  WHERE "started" > (CURRENT_DATE-INTERVAL '24 HOUR')) AS "ttl_conversations", `
      + `(SELECT COUNT(*) FROM "messages" `
      + `  WHERE "sent" > (CURRENT_DATE-INTERVAL '24 HOUR')) AS "ttl_messages", `
      + `(SELECT COUNT(*) FROM "conversation_members" `
      + `  WHERE "invited" > (CURRENT_DATE-INTERVAL '24 HOUR') `
      + `    AND "member" = 100000012) AS "ttl_support_conversations", `
      + `(SELECT COUNT(*) FROM "conversation_members" `
      + `  WHERE "invited" > (CURRENT_DATE-INTERVAL '24 HOUR') `
      + `    AND "member" = 100000011) AS "ttl_admin_conversations"`

    client.query(query, (err, res) => {
      if (err) {
        reject(err)
        client.release() // release the client
        return
      }

      resolve(res.rows[0])

      client.release() // release the client
    })
  })
}
