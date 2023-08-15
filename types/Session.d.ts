export type Session = {
  id: number
  user: number
  token: string
  created: number
  expiry?: number
}

export type Credentials = {
  username: string
  password: string
}
