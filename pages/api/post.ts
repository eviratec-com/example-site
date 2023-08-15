import type { NextApiRequest, NextApiResponse } from 'next'

import createPost from '@/functions/createPost'
import verifyReqUser from '@/functions/verifyReqUser'
import fetchFeedBySlug from '@/functions/fetchFeedBySlug'

import type { User } from '@/types/User'
import type { Post, NewPostWithId } from '@/types/Post'
import type { Feed } from '@/types/Feed'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post|Error>
) {
  try {
    const u: User = await verifyReqUser(req)

    if (!u) {
      return res.status(400).json({
        name: 'AUTH_ERROR',
        message: 'Invalid Session'
      })
    }

    const f: Feed = await fetchFeedBySlug(req.body.feed)

    const d: NewPostWithId = {
      feed: f.id,
      author: u.id,
      content: req.body.content,
    }

    if (req.body.images && req.body.images.length > 0) {
      d.images = req.body.images
    }

    if (req.body.link && req.body.link.length > 0) {
      d.link = req.body.link
    }

    const p: Post = await createPost(d)

    res.status(200).json(p)
  }
  catch (err) {
    res.status(400).json({
      name: 'AUTH_ERROR',
      message: err.message
    })
  }
}
