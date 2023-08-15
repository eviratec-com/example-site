import type { NextApiRequest, NextApiResponse } from 'next'

type ApiStatus = {
  status: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiStatus>
) {
  const result: ApiStatus = {
    status: 'OK',
  }

  res.status(200).json(result)
}
