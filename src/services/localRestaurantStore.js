export const localKey = 'food-inspection-local-records-v1'
export function readLocal(storage = localStorage) {
  const raw = storage.getItem(localKey)
  return raw ? JSON.parse(raw) : { restaurants: [], inspections: [] }
}
export function persistRestaurantDeletion(restaurant, deleted, storage = localStorage) {
  const records = readLocal(storage)
  records.restaurants = [
    ...records.restaurants.filter((item) => item.id !== restaurant.id),
    { ...restaurant, deletedAt: deleted ? new Date().toISOString() : null }
  ]
  storage.setItem(localKey, JSON.stringify(records))
}
