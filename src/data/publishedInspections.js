import { researchedInspections } from './researchedInspections.js'
import { additionalGovernmentReports } from './additionalGovernmentReports.js'
import { slugify, normalizeLocation, normalizeRestaurantName } from '../utils/normalization.js'
import { calculateInspectionStatus } from '../utils/statusEngine.js'
import { generateConsumerSummary } from '../utils/summaryGenerator.js'

const checkedAt = '2026-09-17'
const historicalNote = 'Historical findings reported by the linked news source. Direct X access was unavailable; subsequent compliance or reopening has not been verified.'
const originalPosts = {
  'research-2026-09-11-1': 'https://x.com/CMC_Offcl/status/2070851788371120463',
  'research-2026-09-11-2': 'https://x.com/CMC_Offcl/status/2070871306959208548',
  'research-2026-09-11-3': 'https://x.com/CMC_Offcl/status/2070874446983057647',
  'research-2026-09-11-8': 'https://x.com/MCMalkajgiri/status/2073036375981727907'
}
const earlier = researchedInspections.filter((record) => originalPosts[record.importKey]).map((record) => ({
  ...record,
  // The report supports staff hygiene, but does not specifically establish headwear here.
  goodPractices: record.importKey === 'research-2026-09-11-1' ? ['Food handlers followed hygiene practices'] : record.goodPractices,
  originalPostUrl: originalPosts[record.importKey],
  researchedAt: checkedAt,
  verificationNote: historicalNote
}))
const mandi = {
  importKey: 'research-2026-09-17-al-matam-al-madina',
  restaurantName: 'Al Matam Al Madina Mandi', location: 'Yousufguda',
  inspectionDate: '2024-10-22', postDate: '2024-10-25', hygieneScore: null,
  observations: ['Cramped kitchen with poor ventilation', 'Equipment not regularly cleaned', 'Staff working without gloves or hairnets'],
  goodPractices: [], actionTaken: 'Food colours discarded during inspection; further enforcement action not specified',
  authority: 'TG SAFE', sourceHandle: '@c_tgsafe',
  sourceUrl: 'https://www.siasat.com/raids-conducted-at-shawarma-mandi-restaurants-in-hyderabad-3120198/',
  originalPostUrl: 'https://x.com/c_tgsafe/status/1849826342843580450',
  sourceType: 'News report quoting inspection findings', researchedAt: checkedAt, verificationNote: historicalNote
}
const septemberEvidence = 'https://www.siasat.com/tg-safe-suspends-fssai-liscense-for-4-restaurants-in-hyderabad-3539931/'
const septemberCorroboration = 'https://hyderabadmail.com/hyderabad-tg-safe-food-safety-inspections-fssai-licence-suspension/'
// Only establishment-specific findings are assigned; the drive's aggregate findings
// must not be attributed to all 21 inspected businesses.
const september = [
  ['Lakshmi Sri Balaji Sweets and Bakery', ['Pests and expired ingredients', 'Poor staff hygiene and food preparation conditions', 'Missing records']],
  ['Girl Friend Mandi', ['Cockroach and rodent infestation', 'Poor refrigerator and storage maintenance', 'Missing records']],
  ["Kholani’s Fine Dine Restaurant", ['Unclean kitchen and poorly maintained refrigerators', 'Fungal growth on vegetables', 'Poor waste disposal and missing records']],
  ['Kakatiya Tiffins Meals and Snacks', ['Rodents and rotten vegetables', 'Unclean premises and poor staff hygiene', 'Labelling and record-keeping deficiencies']]
].map(([restaurantName, observations]) => ({
  importKey: `tg-safe-2026-09-10-${slugify(restaurantName)}`,
  restaurantName, location: 'Banjara Hills', inspectionDate: '2026-09-10',
  hygieneScore: null, goodPractices: [], observations,
  actionTaken: 'FSSAI licence suspension reported; instructed to stop business operations immediately',
  enforcement: 'STOP_OPERATIONS', authority: 'TG SAFE', sourceHandle: '@c_tgsafe',
  sourceUrl: septemberEvidence, corroboratingUrl: septemberCorroboration, originalPostUrl: '',
  sourceType: 'News reports of TG SAFE inspection', researchedAt: checkedAt,
  verificationNote: `${historicalNote} The exact X post URL was not recovered. No hygiene score was reported.`
}))

export const publishedInspectionDrafts = [...earlier, mandi, ...september, ...additionalGovernmentReports]
export const publishedImportKeys = new Set(publishedInspectionDrafts.map((record) => record.importKey))
export const publishedInspections = publishedInspectionDrafts.map((record) => ({
  ...record,
  id: record.importKey,
  restaurantId: `${slugify(record.restaurantName)}-${slugify(record.location)}`,
  status: calculateInspectionStatus(record)
}))
export const publishedRestaurants = publishedInspections.map((inspection) => ({
  id: inspection.restaurantId, name: inspection.restaurantName,
  normalizedName: normalizeRestaurantName(inspection.restaurantName),
  location: inspection.location, normalizedLocation: normalizeLocation(inspection.location),
  authority: inspection.authority, currentScore: inspection.hygieneScore,
  currentStatus: inspection.status, quickInsight: generateConsumerSummary(inspection)
}))
