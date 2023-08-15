import type { NextApiRequest, NextApiResponse } from 'next'
import type { UserAttribute } from '@/types/User'

import fetchUserAttributesByUser from '@/functions/users/fetchAttributesByUser'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserAttribute[]|Error>
) {
  try {
    const id: number = Number(`${req.query.id}`)
    const userAttributes: UserAttribute[] = await fetchUserAttributesByUser(id)

    res.status(200).json(userAttributes)
  }
  catch (err) {
    res.status(400).json({
      name: 'FETCH_USER_ATTRIBUTES_BY_USER',
      message: `Unable to fetch user attributes by user: ${err.message}`,
    })
  }
}
