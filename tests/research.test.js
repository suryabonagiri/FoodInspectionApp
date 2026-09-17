import test from 'node:test'
import assert from 'node:assert/strict'
import { researchedInspections } from '../src/data/researchedInspections.js'
import { toIsoDate } from '../src/utils/parser.js'

test('research batch contains ten distinct traceable drafts across the three configured handles', () => {
  assert.equal(researchedInspections.length, 10)
  assert.equal(new Set(researchedInspections.map((record) => record.importKey)).size, 10)
  assert.equal(new Set(researchedInspections.map((record) => record.restaurantName + record.location)).size, 10)
  assert.equal(new Set(researchedInspections.map((record) => record.sourceHandle)).size, 3)
  for (const record of researchedInspections) {
    assert.equal(new URL(record.sourceUrl).protocol, 'https:')
    assert.equal(toIsoDate(record.inspectionDate), record.inspectionDate)
    assert.ok(record.verificationNote.includes('Direct X access unavailable'))
    assert.ok(record.hygieneScore === null || (record.hygieneScore >= 0 && record.hygieneScore <= 100))
  }
  assert.equal(researchedInspections.filter((record) => record.hygieneScore === null).length, 6)
})
