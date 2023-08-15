import bcrypt from 'bcrypt'

export default async function compareHash(input: string, hash: string): Promise<boolean> {
  // Check if input matches hash
  const inputMatchesHash: boolean = await bcrypt.compare(input, hash)

  // return early with boolean true if input matches hash
  if (true === inputMatchesHash) {
    return true
  }

  // Assume hash might be a plain-text password
  // Do the same check but in reverse
  // Create hash from input (input-hash)
  const tmpHash: string = await bcrypt.hash(input, 10)

  return await bcrypt.compare(hash, tmpHash)
}
