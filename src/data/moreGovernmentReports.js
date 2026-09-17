import { slugify } from '../utils/normalization.js'

const historicalNote = 'Historical government inspection findings reported by news. Subsequent compliance or reopening has not been verified.'
const recent = ['Hotel Sindhura East Court', 'New Limra Hotel', 'N Village Multicuisine Restaurant'].map((restaurantName) => ({
  restaurantName, location: 'LB Nagar area', inspectionDate: '', reportDate: '2026-09-16',
  observations: [], actionTaken: 'FSSAI licence suspension reported; directed to stop business operations immediately',
  enforcement: 'STOP_OPERATIONS', authority: 'TG SAFE', sourceHandle: '@c_tgsafe', originalPostUrl: '',
  sourceUrl: 'https://www.siasat.com/tg-safe-suspends-fssai-licences-of-nine-eateries-in-hyderabad-3543291/',
  verificationNote: `${historicalNote} Exact branch address and inspection date are not established in the linked report. Individual findings are grouped across several restaurants, so no specific violations have been assigned to this establishment. Direct government documents were not verified.`
}))

export const moreGovernmentReports = [...recent, {
  restaurantName: 'Udupi Upahar', location: 'Moosapet', inspectionDate: '2026-05-26', reportDate: '2026-05-27',
  observations: ['Cockroaches and flies in the kitchen', 'Stale prepared food discarded', 'Improper freezer storage and thawing', 'Missing staff medical certificates and water testing records'],
  actionTaken: 'Restaurant sealed following inspection', enforcement: 'STOP_OPERATIONS',
  authority: 'Cyberabad Municipal Corporation', sourceHandle: '@CMC_Offcl',
  sourceUrl: 'https://food.ndtv.com/news/popular-hyderabad-restaurant-sealed-over-expired-license-and-hygiene-violations-11553213',
  originalPostUrl: 'https://twitter.com/CMC_Offcl/status/2059284862604120139',
  verificationNote: `${historicalNote} NDTV embeds the government post dated 26 May 2026; direct X access could not be verified. The reported raw hygiene score is 40 out of 116, not a percentage; the percentage score is left blank.`
}, {
  restaurantName: 'KFC', location: 'Rajarajeshwari Colony, Kondapur', inspectionDate: '', postDate: '2026-05-04', reportDate: '2026-05-05',
  observations: ['Cooking oil reportedly exceeded permitted Total Polar Compounds levels', 'Dark, overused cooking oil'],
  actionTaken: 'Regulatory action being initiated; final outcome not reported',
  authority: 'Zonal Commissioner, Serilingampally Zone - CMC', sourceHandle: '@ZC_SLP',
  sourceUrl: 'https://food.ndtv.com/news/black-unsafe-cooking-oil-found-at-hyderabad-kfc-during-a-surprise-raid-11451802',
  originalPostUrl: 'https://twitter.com/ZC_SLP/status/2051294183743459804',
  verificationNote: `${historicalNote} NDTV quotes a government post dated 4 May 2026; this is retained as the post date, not an independently confirmed inspection date. Direct X access was not verified. This record concerns the Rajarajeshwari Colony branch, not other KFC outlets. No hygiene score or closure order was reported.`
}].map((record) => ({
  ...record, importKey: `news-${record.reportDate}-${slugify(record.restaurantName)}-${slugify(record.location)}`,
  hygieneScore: null, goodPractices: [], sourceType: 'Government inspection reported by news', researchedAt: '2026-09-17'
}))
