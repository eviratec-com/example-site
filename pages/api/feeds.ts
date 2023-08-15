import type { NextApiRequest, NextApiResponse } from 'next'
import type { Feed } from '@/types/Feed'

import fetchFeeds from '@/functions/fetchFeeds'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Feed[]|Error>
) {
  try {
    res.status(200).json(await fetchFeeds())
  }
  catch (err) {
    res.status(400).json({
      name: 'FETCH_FEEDS_ERROR',
      message: `Unable to fetch feeds: ${err.message}`,
    })
  }
}
