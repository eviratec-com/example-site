import type { NextApiRequest, NextApiResponse } from 'next'
import type { User, UserAttribute } from '@/types/User'

import verifyReqUser from '@/functions/verifyReqUser'
import hideUserAttribute from '@/functions/users/hideAttribute'
import changeUserAttribute from '@/functions/users/changeAttribute'
import createUserAttribute from '@/functions/users/createAttribute'
import fetchUserAttributesByUser from '@/functions/users/fetchAttributesByUser'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserAttribute[]|Error>
) {
  try {
    const u: User = await verifyReqUser(req)

    if (!u) {
      return res.status(400).json({
        name: 'AUTH_ERROR',
        message: 'Invalid Session'
      })
    }

    const user: number = Number(`${req.query.id}`)
    const attribute: number = Number(`${req.query.attribute}`)

    // Check user ID in path matches the user ID of the session owner
    if (u.id !== user) {
      return res.status(400).json({
        name: 'UNAUTHORIZED',
        message: 'You are not authorized to perform this action.'
      })
    }

    if ('DELETE' === req.method) {
      // Attempt to remove attribute
      const success: boolean = await hideUserAttribute(user, attribute)
      const userAttributes: UserAttribute[] = await fetchUserAttributesByUser(user)

      return res.status(200).json(userAttributes)
    }

    if (!req.body.id) {
      // new user attribute
    }

    const isNew: boolean = !req.body.id
    const newValue: string = req.body.value

    const success: boolean = isNew
      ? await createUserAttribute(user, attribute, newValue)
      : await changeUserAttribute(user, attribute, newValue)

    const userAttributes: UserAttribute[] = await fetchUserAttributesByUser(user)

    res.status(200).json(userAttributes)
  }
  catch (err) {
    res.status(400).json({
      name: 'SET_USER_ATTRIBUTE_VALUE_ERROR',
      message: `Unable to set user attribute value: ${err.message}`,
    })
  }
}
