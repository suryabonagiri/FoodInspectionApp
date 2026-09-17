import test from 'node:test'
import assert from 'node:assert/strict'
import { publishedInspections, publishedRestaurants } from '../src/data/publishedInspections.js'
import { mergeCatalog } from '../src/services/mergeCatalog.js'
import { calculateInspectionStatus } from '../src/utils/statusEngine.js'
import { additionalGovernmentReports } from '../src/data/additionalGovernmentReports.js'
import { recordsToCsv } from '../src/utils/exportRecords.js'
import { generateConsumerSummary } from '../src/utils/summaryGenerator.js'

const initial = { restaurants: publishedRestaurants, inspections: publishedInspections }
test('news-derived records preserve unknown inspection dates, branch details and individual findings', () => {
  assert.equal(additionalGovernmentReports.length, 6)
  const reportOnly = additionalGovernmentReports.filter((record) => record.reportDate === '2026-09-16')
  assert.equal(reportOnly.length, 4)
  for (const record of reportOnly) {
    assert.equal(record.inspectionDate, '')
    assert.equal(record.hygieneScore, null)
    assert.equal(record.originalPostUrl, '')
    assert.ok(record.verificationNote.includes('branch address'))
    assert.ok(generateConsumerSummary(record).startsWith('News reporting dated 2026-09-16'))
  }
  for (const name of ['Hotel Kinara Grand', 'Chemistry Bar and Kitchen (Surabhi Grand)', 'Hotel Sitara Grand']) {
    assert.deepEqual(additionalGovernmentReports.find((record) => record.restaurantName === name).observations, [])
  }
  const sample = reportOnly[0]
  const csv = recordsToCsv([{ restaurant: { name: sample.restaurantName }, latest: sample, recurring: [] }])
  assert.ok(csv.includes('"Latest inspection","News report date"'))
  assert.ok(csv.includes('"","2026-09-16"'))
})

test('published batch has twenty traceable establishments and preserves unknown scores', () => {
  assert.equal(publishedRestaurants.length, 20)
  assert.equal(new Set(publishedRestaurants.map((item) => item.id)).size, 20)
  assert.equal(publishedInspections.filter((item) => item.originalPostUrl).length, 7)
  for (const record of publishedInspections) {
    assert.ok(publishedRestaurants.some((item) => item.id === record.restaurantId))
    assert.ok(record.sourceUrl.startsWith('https://'))
    assert.ok(record.verificationNote.includes('Historical'))
  }
  const recent = publishedInspections.filter((item) => item.inspectionDate === '2026-09-10')
  assert.equal(recent.length, 4)
  for (const record of recent) {
    assert.equal(record.hygieneScore, null)
    assert.equal(record.status, 'CRITICAL')
    assert.equal(record.originalPostUrl, '')
    assert.ok(record.corroboratingUrl)
  }
  assert.equal(publishedInspections.find((item) => item.restaurantName === 'Al Matam Al Madina Mandi').inspectionDate, '2024-10-22')
  assert.equal(calculateInspectionStatus({ hygieneScore: null, enforcement: 'STOP_OPERATIONS' }), 'CRITICAL')
})

test('previously saved drafts are merged without duplication or loss of trash state', () => {
  const restaurant = publishedRestaurants[0]
  const previous = { ...publishedInspections[0], id: 'previous-admin-uuid', observations: ['Reviewed observation'] }
  delete previous.originalPostUrl
  const saved = { restaurants: [{ ...restaurant, deletedAt: '2026-09-15' }], inspections: [previous] }
  const merged = mergeCatalog(initial, saved)
  assert.equal(merged.restaurants.length, 20)
  assert.equal(merged.inspections.length, 20)
  assert.equal(merged.restaurants.find((item) => item.id === restaurant.id).deletedAt, '2026-09-15')
  assert.equal(merged.inspections[0].id, 'previous-admin-uuid')
  assert.ok(merged.inspections[0].originalPostUrl)
  assert.deepEqual(merged.inspections[0].observations, ['Reviewed observation'])
  assert.equal(saved.inspections[0].originalPostUrl, undefined)
})

test('shared evidence URLs retain separate businesses and latest inspections drive summaries', () => {
  const restaurant = publishedRestaurants.at(-1)
  const newer = { id: 'follow-up', restaurantId: restaurant.id, inspectionDate: '2026-09-16', hygieneScore: 90, status: 'PASS', observations: [], actionTaken: 'Compliance recorded' }
  const merged = mergeCatalog(initial, { restaurants: [{ ...restaurant, currentStatus: 'CRITICAL' }], inspections: [newer] })
  assert.equal(merged.inspections.length, 21)
  assert.equal(merged.inspections.filter((item) => item.inspectionDate === '2026-09-10').length, 4)
  const updated = merged.restaurants.find((item) => item.id === restaurant.id)
  assert.equal(updated.currentScore, 90)
  assert.equal(updated.currentStatus, 'PASS')
  assert.ok(!updated.quickInsight.includes('suspension'))
})

 test('new reports retain branch identity, unknown dates and non-percentage scores', () => {
  const udupi = publishedInspections.find((record) => record.restaurantName === 'Udupi Upahar')
  assert.equal(udupi.hygieneScore, null)
  assert.equal(udupi.inspectionDate, '2026-05-26')
  assert.equal(udupi.status, 'CRITICAL')
  const kfc = publishedInspections.find((record) => record.restaurantName === 'KFC')
  assert.equal(kfc.location, 'Rajarajeshwari Colony, Kondapur')
  assert.equal(kfc.inspectionDate, '')
  assert.equal(kfc.status, 'NOT_AVAILABLE')
  for (const name of ['Hotel Sindhura East Court', 'New Limra Hotel', 'N Village Multicuisine Restaurant']) {
    const record = publishedInspections.find((item) => item.restaurantName === name)
    assert.deepEqual(record.observations, [])
    assert.equal(record.reportDate, '2026-09-16')
    assert.equal(record.status, 'CRITICAL')
  }
})
