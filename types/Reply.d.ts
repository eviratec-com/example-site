import type { UserProfile } from './User'

export type NewReply = {
  post: number
  content: string
}

export type NewReplyWithAuthor = {
  post: number
  author: number
  content: string
}

export type Reply = {
  id: number
  post: number
  author: UserProfile
  content: string
  created: number
}
