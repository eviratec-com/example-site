import type { NextApiRequest, NextApiResponse } from 'next'

const apiBase: string = ''

interface RemoteApiResponse {
  Success: boolean
  Projects: Project[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Project[]>
) {
  const epUrl: string = `${apiBase}/projects`

  const _result: any = await fetch(epUrl)
  const json: RemoteApiResponse = await _result.json()

  const result: Project[] = json.Projects

  res.status(200).json(result)
}
