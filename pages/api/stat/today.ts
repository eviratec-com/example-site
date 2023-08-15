import type { NextApiRequest, NextApiResponse } from 'next'

import fetchSiteStats from '@/functions/fetchSiteStats'

import type { SiteStats } from '@/types/Stat'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SiteStats[]|Error>
) {
  try {
    const d: SiteStats[] = await fetchSiteStats()

    res.status(200).json(d)
  }
  catch (err) {
    res.status(400).json({
      name: 'STAT_ERROR',
      message: err.message
    })
  }
}
