import bcrypt from 'bcrypt'

import type { User, UserRegistration } from '@/types/User'

import dbClient from '@/db'

export default async function signup(d: UserRegistration): Promise<User> {
  const hash: string = await bcrypt.hash(d.password, 10)

  if (!d.username) {
    throw new Error('No username specified.')
  }

  if (!d.password) {
    throw new Error('No password specified.')
  }

  if (!d.email_address) {
    throw new Error('No email address specified.')
  }

  if (d.username.length < 2) {
    throw new Error('Username must be at least 2 characters.')
  }

  if (d.password.length < 8) {
    throw new Error('Password must be at least 8 characters.')
  }

  if (d.email_address.length < 5) {
    throw new Error('Email address must be at least 5 characters.')
  }

  const client: any = await dbClient() // check out a single client
  const u: Promise<User> = new Promise((resolve, reject) => {
    const query: string = `INSERT INTO "users" `
      + `("username", "password", "email", "display_name", "link", "dob", "created") `
      + `VALUES (`
      + `  $1::varchar, `
      + `  $2::varchar, `
      + `  $3::varchar, `
      + `  $4::varchar, `
      + `  $5::varchar, `
      + `  $6::date, `
      + `  CURRENT_TIMESTAMP `
      + `) RETURNING *`

    const validDob: boolean = !!d.dob.match(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/)
    const input = [
      d.username,
      hash,
      d.email_address,
      d.display_name,
      `/u/${d.username}`,
      validDob && d.dob || '2123-04-20',
    ]

    client.query(query, input, (err, res) => {
      if (err) {
        reject(err)
        client.release() // release the client
        return
      }

      const user: User = res.rows[0]

      user.created = (new Date(user.created)).getTime()

      resolve(user)

      client.release() // release the client
    })
  })

  const result: User = await u

  return result
}
