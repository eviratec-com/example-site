import type { NextApiRequest, NextApiResponse } from 'next'

import describePage from '@/functions/describePage'
import verifyReqUser from '@/functions/verifyReqUser'

import type { User } from '@/types/User'
import type { WebPageDescription } from '@/types/WebPage'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WebPageDescription|Error>
) {
  const url: string = req.query.url as string || ''

  try {
    const u: User = await verifyReqUser(req)

    if (!u) {
      return res.status(400).json({
        name: 'AUTH_ERROR',
        message: 'Invalid Session'
      })
    }

    // Fetch the web page description
    const desc: WebPageDescription = await describePage(url)

    if (!desc) {
      return res.status(400).json({
        name: 'FAILED_TO_DESCRIBE_WEB_PAGE',
        message: `An unknown error occurred while describing the page at: ${url}`
      })
    }

    // Send response body
    res.status(200).json(desc)
  }
  catch (err) {
    console.log(err)
    res.status(400).json({
      name: 'FAILED_TO_DESCRIBE_WEB_PAGE',
      message: `An unknown error occurred while describing the page at: ${url}`
    })
  }
}
