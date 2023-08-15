import type { NextApiRequest, NextApiResponse } from 'next'
import type { UserActivity } from '@/types/User'

import fetchUserActivity from '@/functions/users/fetchActivity'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserActivity|Error>
) {
  try {
    const id: number = Number(`${req.query.id}`)
    const userActivity: UserActivity = await fetchUserActivity(id)

    res.status(200).json(userActivity)
  }
  catch (err) {
    res.status(400).json({
      name: 'FETCH_USER_ACTIVITY',
      message: `Unable to fetch user activity: ${err.message}`,
    })
  }
}
