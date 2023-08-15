/*
  GET /api/describeWebPage
    ?url=https%3A%2F%2Fwww.eviratec.net%2F

  {
    "url":"https://www.eviratec.net/",
    "meta": {
      "title":"Eviratec Network :: Web Directory",
      "icon":"https://www.eviratec.net/favicon.ico",
      "description":"Online directory of the internet. Links to websites, webpages, webapps, and more!",
      "themeColor":"rgba(22,44,66,1)",
      "og": {
        "url":"https://www.eviratec.net",
        "type":"website",
        "image":"https://www.eviratec.net/og.png",
        "title":"Eviratec Network :: Web Directory",
        "description":"Online directory of the internet. Links to websites, webpages, webapps, and more!"
      }
    },
    "links": [
      {
        "title":"Eviratec Net",
        "href":"https://www.eviratec.net/"
      },{
        "title":"Contact us",
        "href":"https://www.eviratec.net/mailto:info@eviratec.com"
      },{
        "title":"+61 482 465 983",
        "href":"https://www.eviratec.net/tel:+61482465983"
      },{
        "title":"info@eviratec.com",
        "href":"https://www.eviratec.net/mailto:info@eviratec.com"
      },{
        "title":"Terms of Use",
        "href":"https://www.eviratec.net/terms"
      },{
        "title":"Privacy Policy",
        "href":"https://www.eviratec.net/privacy"
      },{
        "title":"Eviratec.net",
        "href":"https://www.eviratec.net/"
      },{
        "title":"Recent Posts",
        "href":"https://www.eviratec.net/recent"
      },{
        "title":"Browse Topics",
        "href":"https://www.eviratec.net/links"
      },{
        "title":"Eviratec Social",
        "href":"https://www.eviratec.com.au/"
      },{
        "title":"Login",
        "href":"https://www.eviratec.net/login"
      },{
        "title":"Create Account",
        "href":"https://www.eviratec.net/join"
      }
    ]
  }
*/

import { type WebPageDescription, type WebPageLink } from '@/types/WebPage'

function removeUrlPath(input: string): string {
  const p = input.match(/^([a-z]+)\:\/\/([^/]+)/i)

  if (!p) {
    return input
  }
  
  return `${p[1]}://${p[2]}`
}

const USER_AGENT_STRING =
  `Mozilla/5.0 (compatible; Pigeon/1.0.0; +https://www.eviratec.net)`

export default async function describePage(
  url: string
): Promise<WebPageDescription> {
  const opts = {
    'method': 'GET',
    'headers': {
      'Accept': 'text/html, application/xhtml+xml, application/xml; charset=utf8',
      // 'User-Agent': '<product> / <product-version> <comment>',
      'User-Agent': USER_AGENT_STRING,
    }
  }

  const r = await fetch(url, opts)

  const html = await r.text()

  const titleTag: string = matchFirstElem(html, 'title')
  const title: string = plainText(titleTag)

  const result: WebPageDescription = {
    url: url,
    meta: {
      title: title,
    }
  }

  // Figure out base for relative URLs
  const baseHrefTag: string = matchFirstElem(html, 'base')
  console.log(baseHrefTag)
  const baseHref: string = ensureTrailingSlash(
    baseHrefTag ? attrValue(baseHrefTag, 'base', 'href') : removeUrlPath(url)
  )

  // Add meta.icon
  try {
    const iconTag: string = matchFirstElemByAttr(html, 'link', 'rel', 'icon')
    result.meta.icon = addUrlBase(baseHref, attrValue(iconTag, 'link', 'href'))
  }
  catch (err) {console.log(err) }

  // Add meta.description
  try {
    const descriptionTag: string = matchFirstElemByAttr(html, 'meta', 'name', 'description')
    result.meta.description = attrValue(descriptionTag, 'meta', 'content')
  }
  catch (err) {console.log(err) }

  // Add meta.themeColor
  try {
    const themeColorTag: string = matchFirstElemByAttr(html, 'meta', 'name', 'theme-color')
    result.meta.themeColor = attrValue(themeColorTag, 'meta', 'content')
  }
  catch (err) {console.log(err) }

  // Add og:* tags
  try {
    const ogUrlTag: string = matchFirstElemByAttr(html, 'meta', 'property', 'og:url')
    const ogTypeTag: string = matchFirstElemByAttr(html, 'meta', 'property', 'og:type')
    const ogImageTag: string = matchFirstElemByAttr(html, 'meta', 'property', 'og:image')
    const ogTitleTag: string = matchFirstElemByAttr(html, 'meta', 'property', 'og:title')
    const ogSiteNameTag: string = matchFirstElemByAttr(html, 'meta', 'property', 'og:site_name')
    const ogDescriptionTag: string = matchFirstElemByAttr(html, 'meta', 'property', 'og:description')

    result.meta.og = {}

    if (ogUrlTag)
      result.meta.og.url = attrValue(ogUrlTag, 'meta', 'content')

    if (ogTypeTag)
      result.meta.og.type = attrValue(ogTypeTag, 'meta', 'content')

    if (ogImageTag)
      result.meta.og.image = attrValue(ogImageTag, 'meta', 'content')

    if (ogTitleTag)
      result.meta.og.title = attrValue(ogTitleTag, 'meta', 'content')

    if (ogSiteNameTag)
      result.meta.og.siteName = attrValue(ogSiteNameTag, 'meta', 'content')

    if (ogDescriptionTag)
      result.meta.og.description = attrValue(ogDescriptionTag, 'meta', 'content')
  }
  catch (err) {console.log(err) }

  // Fetch any links
  const anchorTags: string[] = matchAllElems(html, 'a')
  if (anchorTags.length > 0) {
    let links: WebPageLink[] = [...anchorTags.map((tag: string) => {
      try {
        return {
          title: plainText(tag),
          href: addUrlBase(baseHref, attrValue(tag, 'a', 'href')),
        }
      }
      catch (err) {
        return null
      }
    })]

    result.links = [...links.filter((link: WebPageLink) => {
      return null !== link
    })]
  }

  return result
}

function plainText (input: string): string {
  const tagName: string = input.match(new RegExp(`<([a-z-]+)`, 'i'))[1]
  const result: string = input.match(new RegExp(`<${tagName}[^>]*>([^<]+)</${tagName}>`, 'i'))[1]
  return result
}

function matchAllElems (input: string, tag: string): string[] {
  const match = input.match(new RegExp(`<${tag}[^>]*(>[^<]+</${tag}|/)>`, 'gi'))
  return match && [...match] || []
}

function matchFirstElem (input: string, tag: string): string {
  const match = input.match(new RegExp(`<${tag}[^>]*(>[^<]+</${tag}|/)>`, 'i'))
  return match && match[0] || ''
}

function matchFirstElemByAttr (input: string, tag: string, attr: string, value: string): string {
  const match = input.match(new RegExp(`<${tag}[^>]*${attr}=(\"|')${value}(\"|')[^>]*(\>[^<]+\</${tag}|/)\>`, 'i'))
  return match && match[0] || ''
}

function attrValue (input: string, tag: string, attr: string): string {
  return input.match(new RegExp(`<${tag}[^>]*${attr}=(\"|')([^\"]*)(\"|')[^>]*(>[^<]+\</${tag}|/)\>`, 'i'))[2]
}

function ensureTrailingSlash (input: string): string {
  if (input.match(/\/$/)) {
    return input
  }

  return `${input}/`
}

function ensureNoLeadingSlash (input: string): string {
  if (input.match(/^[^\/]/)) {
    return input
  }

  return input.substr(1)
}

function addUrlBase (urlBase: string, uri: string): string {
  if (uri.match(urlBase) || uri.match(/^(mailto|tel):/i)) {
    return uri // return URI if it already contains urlBase or if it begins
               // with mailto: or tel:
  }

  if (uri.match(/^http(s|):\/\/.+/i)) {
    return uri
  }

  if (uri.match(/^\/\//)) {
    return `https:${uri}`
  }

  if (uri.match(/^\//)) {
    return `${urlBase}${uri.substr(1)}`
  }

  if (uri.match(/^\#/)) {
    return `${urlBase}/${uri}`
  }

  return `${urlBase}${ensureNoLeadingSlash(uri)}`
}
