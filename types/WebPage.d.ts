export type WebPageLink = {
  title?: string
  href?: string
}

export type WebPageDescription = {
  url: string
  meta: {
    title: string
    icon?: string
    themeColor?: string
    description?: string
    og?: {
      url?: string
      type?: string
      image?: string
      title?: string
      siteName?: string
      description?: string
    }
  }
  links?: WebPageLink[]
}
