import { Html, Head, Main, NextScript } from 'next/document'

import { endPool } from '@/db'

if (process.env.NEXT_MANUAL_SIG_HANDLE) {
  process.on('SIGTERM', () => {
    console.log('Received SIGTERM: ', 'cleaning up')

    endPool()
      .then(() => {
        console.log('closed pg pool')
        process.exit(0)
      })
      .catch(err => {
        console.log(err)
        process.exit(1)
      })
  })

  process.on('SIGINT', () => {
    console.log('Received SIGINT: ', 'cleaning up')

    endPool()
      .then(() => {
        console.log('closed pg pool')
        process.exit(0)
      })
      .catch(err => {
        console.log(err)
        process.exit(1)
      })
  })
}

export default function Document() {
  return (
    <Html lang="en" prefix="og: https://ogp.me/ns#">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
