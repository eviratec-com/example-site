
export type Plan = {
  title: string
  ppm: number
  features: string[]
  externalId: {
    [key: string]: string
  }
}
