import fetchUserByUsername from '@/functions/fetchUserByUsername'

import reservedUsernames from '@/inc/usernames.reserved.json'
import bannedWords from '@/inc/words.banned.json'

import type { User } from '@/types/User'

export default async function checkUsername (username: string): Promise<boolean> {
  const existingUser: User = await fetchUserByUsername(username)

  // If a user is already registered with the username
  if (existingUser) {
    return false // Username is not available
  }

  // Ensure username matches the required pattern
  if (!username.match(/^([A-Z]{1}[A-Z0-9-]{1,}[A-Z0-9]{1}|[A-Z0-9]{1})$/i)) {
    return false // Username is not (a-z,A-Z,0-9,-)
  }

  // If the username is in the list of reserved usernames
  if (reservedUsernames.indexOf(username.toLowerCase()) > -1) {
    return false // Username is not available
  }

  if (bannedWords.indexOf(username.toLowerCase()) > -1) {
    return false // Username is not available
  }

  return true // Username is available
}
