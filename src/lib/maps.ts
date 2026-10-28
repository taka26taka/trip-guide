import type { MapLinks } from '../domain/trip'

export const mapsSearchUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`

export const mapsDirectionsUrl = (destination: string, origin?: string) => {
  const params = new URLSearchParams({
    api: '1',
    destination,
    travelmode: 'transit',
  })

  if (origin) params.set('origin', origin)
  return `https://www.google.com/maps/dir/?${params.toString()}`
}

export const mapLinks = (place: string, origin?: string): MapLinks => ({
  view: mapsSearchUrl(place),
  route: mapsDirectionsUrl(place, origin),
})
