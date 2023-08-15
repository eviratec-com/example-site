import type { UserProfile } from './User'

export type NewMessageWithId = {
  conversation: number
  author: UserProfile
  content: string
  images?: string[]
  link?: string
}

export type Message = {
  id: number
  conversation: number
  author: UserProfile
  content: string
  images?: string[]
  link?: string
  sent: number
}

export type NewConversation = {
  members: UserProfile[]
  started_by: UserProfile|number
}

export type Conversation = {
  id: number
  members: UserProfile[]
  started_by: UserProfile|number
  started: number
}

export type ConversationSummary = {
  id: number
  last_message: {
    content: string
    author: string
    sent: number
  }
}

export type ConversationMember = {
  id: number
  member: number
  invited: number
  accepted: number|null
  invited_by: number
  conversation: number
}
