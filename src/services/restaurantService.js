import { collection, doc, onSnapshot, orderBy, query, setDoc, writeBatch, where } from 'firebase/firestore'
import { db, firebaseConfigured } from '../lib/firebase'
import { mockInspections, mockRestaurants } from '../data/mockData'
import { publishedInspections, publishedRestaurants } from '../data/publishedInspections.js'
import { mergeCatalog } from './mergeCatalog.js'

import { localKey, readLocal, persistRestaurantDeletion } from './localRestaurantStore.js'

function localRecords(kind) {
  return mergeCatalog({ restaurants: [...mockRestaurants, ...publishedRestaurants], inspections: [...mockInspections, ...publishedInspections] }, readLocal())[kind]
}
function subscribeLocal(kind, onData, onError) {
  const refresh = () => { try { onData(localRecords(kind)) } catch { onError?.('Local records could not be loaded. Check browser storage access.') } }
  refresh()
  window.addEventListener('food-records-updated', refresh)
  window.addEventListener('storage', refresh)
  return () => { window.removeEventListener('food-records-updated', refresh); window.removeEventListener('storage', refresh) }
}
// Soft deletion preserves inspection history and makes accidental removal reversible.
export async function setRestaurantDeleted(restaurant, deleted) {
  const change = { deletedAt: deleted ? new Date().toISOString() : null }
  if (!firebaseConfigured) {
    persistRestaurantDeletion(restaurant, deleted)
    window.dispatchEvent(new Event('food-records-updated'))
    return
  }
  await setDoc(doc(db, 'restaurants', restaurant.id), change, { merge: true })
}

export async function publishInspection(restaurant, inspection) {
  if (!firebaseConfigured) {
    const records = readLocal()
    if (localRecords('inspections').some((item) => item.id === inspection.id || (inspection.importKey ? item.importKey === inspection.importKey : inspection.sourceUrl && item.sourceUrl === inspection.sourceUrl))) throw new Error('Duplicate inspection')
    records.restaurants = [...records.restaurants.filter((item) => item.id !== restaurant.id), restaurant]
    records.inspections.push(inspection)
    localStorage.setItem(localKey, JSON.stringify(records))
    window.dispatchEvent(new Event('food-records-updated'))
    return
  }
  const batch = writeBatch(db)
  batch.set(doc(db, 'restaurants', restaurant.id), restaurant, { merge: true })
  batch.set(doc(db, 'inspections', inspection.id), inspection)
  await batch.commit()
}

export function subscribeRestaurants(onData, onError) {
  if (!firebaseConfigured) return subscribeLocal('restaurants', onData, onError)
  return onSnapshot(collection(db, 'restaurants'), (snapshot) => onData(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))), () => onError?.('Restaurant records could not be loaded.'))
}
export function subscribeInspections(onData, onError) {
  if (!firebaseConfigured) return subscribeLocal('inspections', onData, onError)
  return onSnapshot(query(collection(db, 'inspections'), orderBy('inspectionDate', 'desc')), (snapshot) => onData(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))), () => onError?.('Inspection records could not be loaded.'))
}
export async function saveRestaurant(restaurant) {
  await setDoc(doc(db, 'restaurants', restaurant.id), restaurant, { merge: true })
}
export async function saveInspection(inspection) {
  await setDoc(doc(db, 'inspections', inspection.id), inspection)
}
export async function existingSourceUrl(sourceUrl, importKey) {
  if (!sourceUrl) return false
  if (!firebaseConfigured) return localRecords('inspections').some((item) => importKey ? item.importKey === importKey : item.sourceUrl === sourceUrl)
  const { getDocs } = await import('firebase/firestore')
  const records = await getDocs(query(collection(db, 'inspections'), where(importKey ? 'importKey' : 'sourceUrl', '==', importKey || sourceUrl)))
  return !records.empty
}
