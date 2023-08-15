
export type NewSite = {
  name: string
  plan: string
  fqdn: string
  subscription: string
}

export type Site = {
  id: number
  name: string
  plan: string
  fqdn: string
  subscription: string
  created?: number
}
