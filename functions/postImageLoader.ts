

export default function postImageLoader({ src, width, quality }): string {
  if (!src) {
    return src
  }

  if (src.match(/\.gif$/i)) {
    return src
  }

  const size: string = width <= 100 ? 'thumbnail'
    : width <= 200 ? 'small'
    : width <= 400 ? 'medium'
    : 'large'

  const [
    protocol,
    domain,
    container,
    user,
    year,
    month,
    day,
    filename
  ] = src.replace(/\/\//g, '/').split('/')

  if (!year || Number(`${year}${month.padStart(2, '0')}${day.padStart(2, '0')}`) < 20230410) {
    return src
  }

  return src.replace(/\/eviratec\-photos\-ar\//, `/${size}`)
}
