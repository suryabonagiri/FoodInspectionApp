import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateInspectionStatus } from '../src/utils/statusEngine.js'
import { toIsoDate, parseRawInspectionText } from '../src/utils/parser.js'
import { recordsToCsv } from '../src/utils/exportRecords.js'

test('missing and invalid scores do not imply critical findings', () => {
  for (const hygieneScore of [null, undefined, '', ' ', 'invalid', -1, 101]) assert.equal(calculateInspectionStatus({ hygieneScore }), 'NOT_AVAILABLE')
  assert.equal(calculateInspectionStatus({ hygieneScore: null, actionTaken: 'Closure ordered' }), 'CRITICAL')
  for (const [hygieneScore, expected] of [[0, 'CRITICAL'], [59, 'CRITICAL'], [60, 'IMPROVEMENT_NOTICE'], [79, 'IMPROVEMENT_NOTICE'], [80, 'PASS'], [100, 'PASS']]) assert.equal(calculateInspectionStatus({ hygieneScore }), expected)
})
test('parser accepts ISO and local dates and rejects impossible calendar dates', () => {
  assert.equal(toIsoDate('2026-09-11'), '2026-09-11')
  assert.equal(toIsoDate('11.09.26'), '2026-09-11')
  assert.equal(toIsoDate('29.02.2024'), '2024-02-29')
  for (const date of ['31.02.2026', '29.02.2025', '2026-13-01']) assert.equal(toIsoDate(date), '')
  const record = parseRawInspectionText('Restaurant Name: Example\nInspection Date: 2026-09-11')
  assert.equal(record.hygieneScore, null)
  assert.equal(record.status, 'NOT_AVAILABLE')
})
test('CSV escapes source text and prevents formula execution', () => {
  const csv = recordsToCsv([{ restaurant: { name: '=SUM(1,2)', location: 'A "place"' }, recurring: [] }])
  assert.ok(csv.includes('"\'=SUM(1,2)"'))
  assert.ok(csv.includes('"A ""place"""'))
  assert.ok(!csv.includes('undefined'))
})
