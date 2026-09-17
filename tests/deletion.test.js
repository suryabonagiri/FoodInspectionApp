import test from 'node:test'
import assert from 'node:assert/strict'
import { localKey, readLocal, persistRestaurantDeletion } from '../src/services/localRestaurantStore.js'

test('deletion persists across reads, preserves history and unrelated records, and can be restored', () => {
  const data = new Map()
  const storage = { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) }
  const restaurant = { id: 'added', name: 'Test record' }
  const untouched = { id: 'other', name: 'Other record' }
  const inspections = [{ id: 'inspection', restaurantId: 'added', hygieneScore: null }]
  storage.setItem(localKey, JSON.stringify({ restaurants: [restaurant, untouched], inspections }))
  persistRestaurantDeletion(restaurant, true, storage)
  const deleted = readLocal(storage)
  assert.ok(deleted.restaurants.find((item) => item.id === 'added').deletedAt)
  assert.deepEqual(deleted.inspections, inspections)
  assert.deepEqual(deleted.restaurants.find((item) => item.id === 'other'), untouched)
  persistRestaurantDeletion(deleted.restaurants.find((item) => item.id === 'added'), false, storage)
  assert.equal(readLocal(storage).restaurants.find((item) => item.id === 'added').deletedAt, null)
  assert.equal(readLocal(storage).restaurants.length, 2)
})
test('a demo record remains deleted after merging persisted overrides', () => {
  let raw = null
  const storage = { getItem: () => raw, setItem: (_, value) => { raw = value } }
  const demo = { id: 'demo', name: 'Sample' }
  persistRestaurantDeletion(demo, true, storage)
  const merged = [...new Map([demo, ...readLocal(storage).restaurants].map((item) => [item.id, item])).values()]
  assert.equal(merged.filter((item) => !item.deletedAt).length, 0)
})
test('storage write failures propagate instead of claiming success', () => {
  const storage = { getItem: () => null, setItem: () => { throw new Error('Storage full') } }
  assert.throws(() => persistRestaurantDeletion({ id: 'sample' }, true, storage), /Storage full/)
})
