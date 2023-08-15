const { Pool, Client } = require('pg')
const connectionString = process.env.DB_URI

const pool = new Pool({
  connectionString,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

export default async function dbClient() {
  // check out a single client
  const client = await pool.connect()
  return client
}

export function endPool() {
  return pool.end()
}
