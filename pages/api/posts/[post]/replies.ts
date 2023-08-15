import type { NextApiRequest, NextApiResponse } from 'next'
import type { Reply } from '@/types/Reply'

import fetchRepliesByPost from '@/functions/fetchRepliesByPost'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Reply[]|Error>
) {
  try {
    res.status(200).json(await fetchRepliesByPost(Number(`${req.query.post}`)))
  }
  catch (err) {
    res.status(400).json({
      name: 'FETCH_REPLIES_BY_POST_ERROR',
      message: `Unable to fetch replies by post: ${err.message}`,
    })
  }
}
