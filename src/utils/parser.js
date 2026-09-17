import { calculateInspectionStatus } from './statusEngine.js'

export const GOVERNMENT_HANDLES = { CMC_Offcl: 'Cyberabad Municipal Corporation', MCMalkajgiri: 'Malkajgiri Municipal Corporation', c_tgsafe: 'TG SAFE' }
const capture = (text, expression) => text.match(expression)?.[1]?.trim() || ''
const list = (value) => value ? value.split(/[,;•]/).map((item) => item.trim()).filter(Boolean) : []
export const toIsoDate = (value = '') => {
  const iso = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/)
  const local = value.trim().match(/^(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{2}|\d{4})$/)
  if (!iso && !local) return ''
  const [, day, month, rawYear] = local || []
  const result = iso ? iso[0] : `${rawYear.length === 2 ? `20${rawYear}` : rawYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  const date = new Date(`${result}T00:00:00Z`)
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === result ? result : ''
}

export function parseRawInspectionText(rawText = '') {
  // Use a Unicode-aware literal so the two UTF-16 units of 📍 are not replaced separately.
  const text = rawText.replace(/\r/g, '').replace(/\u{1F4CD}/gu, '\nLocation: ')
  const restaurantName = capture(text, /(?:restaurant(?:\s*name)?|establishment)\s*:\s*([^\n]+)/i) || capture(text, /^\s*([^\n:]{3,80})/m)
  const locationRaw = capture(text, /(?:location|area|zone|📍)\s*:\s*([^\n]+)/i) || capture(text, /(?:near|at)\s+[^,\n]+,\s*([^\n]+)/i)
  const handle = capture(text, /@([A-Za-z0-9_]+)/)
  const scoreRaw = capture(text, /(?:hygiene\s*score|score)\s*:\s*(\d{1,3})\s*%?/i)
  const actionTaken = capture(text, /(?:action(?:\s*taken)?|mandated\s*action)\s*:\s*([^\n]+)/i)
  const location = locationRaw.replace(/^(near|at)\s+/i, '').trim()
  const data = {
    restaurantName: restaurantName.replace(/\s*📍.*$/, '').trim(),
    location: /^near\s+/i.test(locationRaw) && location.includes(',') ? location.split(',').pop().trim() : location,
    inspectionDate: toIsoDate(capture(text, /(?:inspection\s*date|date)\s*:\s*([^\n]+)/i)),
    authority: capture(text, /authority\s*:\s*([^\n]+)/i) || GOVERNMENT_HANDLES[handle] || '',
    goodPractices: list(capture(text, /(?:good\s*practices|positive\s*practices)\s*:\s*([^\n]+)/i)),
    observations: list(capture(text, /(?:observations?|concerns?|violations?)\s*:\s*([^\n]+)/i)),
    actionTaken,
    hygieneScore: scoreRaw ? Number(scoreRaw) : null,
    sourceHandle: handle ? `@${handle}` : '',
    sourceUrl: capture(text, /(https?:\/\/[^\s]+)/i)
  }
  data.status = calculateInspectionStatus(data)
  return data
}
