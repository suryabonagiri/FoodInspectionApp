import { slugify } from '../utils/normalization.js'

const september16 = 'https://www.siasat.com/tg-safe-suspends-fssai-licences-of-nine-eateries-in-hyderabad-3543291/'
const september16Corroboration = 'https://timesofindia.indiatimes.com/city/hyderabad/tg-safe-suspends-licences-of-nine-food-oil-units-in-hyderabad-over-safety-violations/articleshow/134293844.cms'
const september9 = 'https://hyderabadmail.com/tg-safe-kukatpally-food-safety-inspections-five-licences-suspended/'
const september9Corroboration = 'https://food.ndtv.com/news/cockroaches-rotten-food-found-during-hyderabad-food-safety-drive-5-licenses-suspended-12028412/amp/1'

// Report dates are not silently treated as inspection dates. Area-wide reporting
// also does not establish an exact address for an individual branch.
const lbNagar = [
  ['Hotel Sangeeth Grand Restaurant and Bar', ['Cockroaches and pest-affected food', 'Expired products and synthetic colours in prepared food']],
  ['Bahar Biryani Café', ['Rodent infestation', 'Stale chicken, mutton and prawns', 'Inadequate separation of vegetarian and non-vegetarian food']],
  ['Chemistry Bar and Kitchen (Surabhi Grand)', []],
  ['Hotel Kinara Grand', []]
].map(([restaurantName, observations]) => ({
  restaurantName, observations, location: 'LB Nagar area',
  inspectionDate: '', reportDate: '2026-09-16',
  sourceUrl: september16, corroboratingUrl: september16Corroboration,
  verificationNote: 'Historical government enforcement reported by Siasat and The Times of India on 16 September 2026. The precise inspection date and branch address were not established; LB Nagar is the reported drive area. Direct government documents and exact X posts were not verified. Later compliance or reopening has not been checked.' +
    (observations.length ? '' : ' This report names the establishment for licence suspension but does not separate its individual violations; aggregate findings have not been assigned to it.')
}))

const kukatpally = [
  ['Mandi King Arabian Restaurant', ['Poor refrigerator maintenance', 'Inadequate separation of vegetarian, non-vegetarian, raw and partly prepared food', 'Spoiled vegetables and unhygienic premises']],
  ['Hotel Sitara Grand', []]
].map(([restaurantName, observations]) => ({
  restaurantName, observations, location: 'Kukatpally',
  inspectionDate: '2026-09-09', reportDate: '2026-09-09',
  sourceUrl: september9, corroboratingUrl: september9Corroboration,
  verificationNote: 'Historical TG SAFE inspection reported by Hyderabad Mail and corroborated by NDTV. Government press-note findings are attributed through news reporting; direct government documents and exact X posts were not verified. Later compliance or reopening has not been checked.' +
    (observations.length ? '' : ' The reports name Hotel Sitara Grand for licence suspension but do not establish its individual violations. No drive-wide findings are attributed to this branch.')
}))

export const additionalGovernmentReports = [...lbNagar, ...kukatpally].map((record) => ({
  ...record,
  importKey: `tg-safe-${record.reportDate}-${slugify(record.restaurantName)}-${slugify(record.location)}`,
  hygieneScore: null, goodPractices: [],
  actionTaken: 'FSSAI licence suspension reported; directed to stop business operations immediately',
  enforcement: 'STOP_OPERATIONS', authority: 'TG SAFE', sourceHandle: '@c_tgsafe',
  originalPostUrl: '', sourceType: 'Government inspection reported by news', researchedAt: '2026-09-17'
}))
