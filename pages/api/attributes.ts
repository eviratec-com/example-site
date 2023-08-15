import type { NextApiRequest, NextApiResponse } from 'next'

import fetchAttributes from '@/functions/fetchAttributes'

import type { Attribute } from '@/types/Attribute'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Attribute[]|Error>
) {
  try {
    // Get the list of attributes
    const attributes: Attribute[] = await fetchAttributes()

    // Return success
    res.status(200).json(attributes)
  }
  catch (err) {
    res.status(400).json({
      name: 'FETCH_ATTRIBUTES_ERROR',
      message: err.message
    })
  }
}
