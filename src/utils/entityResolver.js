import { normalizeLocation, normalizeRestaurantName } from './normalization'

export function resolveRestaurantEntity(parsedData, restaurants = []) {
  const name = normalizeRestaurantName(parsedData.restaurantName)
  const location = normalizeLocation(parsedData.location)
  const exact = restaurants.find((item) => item.normalizedName === name && location && item.normalizedLocation === location)
  if (exact) return { match: exact, confidence: 'high', requiresConfirmation: false }
  const nameMatch = restaurants.find((item) => item.normalizedName === name)
  if (nameMatch) return { match: nameMatch, confidence: 'medium', requiresConfirmation: true }
  return { match: null, confidence: 'none', requiresConfirmation: false }
}
