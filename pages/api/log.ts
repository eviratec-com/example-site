import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}|Error>
) {
  res.status(200).json({})
  console.log(req.body)
  console.log(JSON.stringify(req.body, undefined, '  '))
}
