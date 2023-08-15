import type { NextApiRequest, NextApiResponse } from 'next'

import createReply from '@/functions/createReply'
import verifyReqUser from '@/functions/verifyReqUser'
import fetchPostById from '@/functions/fetchPostById'

import type { User } from '@/types/User'
import type { Reply, NewReplyWithAuthor } from '@/types/Reply'
import type { Post } from '@/types/Post'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Reply|Error>
) {
  try {
    const u: User = await verifyReqUser(req)

    if (!u) {
      return res.status(400).json({
        name: 'AUTH_ERROR',
        message: 'Invalid Session'
      })
    }

    const p: Post = await fetchPostById(req.body.post)

    if (!p) {
      return res.status(400).json({
        name: 'INVALID_POST',
        message: `Invalid Post<${req.body.post}>`
      })
    }

    const d: NewReplyWithAuthor = {
      post: req.body.post,
      author: u.id,
      content: req.body.content,
    }

    const r: Reply = await createReply(d)

    res.status(200).json(r)
  }
  catch (err) {
    res.status(400).json({
      name: 'AUTH_ERROR',
      message: err.message
    })
  }
}
