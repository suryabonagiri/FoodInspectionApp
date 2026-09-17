export const violationAliases = {
  flies: ['flies', 'house fly', 'housefly', 'fly infestation', 'housefly infestation'],
  fssai: ['no fssai license', 'fssai license unavailable', 'license not available'],
  personalHygiene: ['poor personal hygiene', 'poor hygiene', 'staff hygiene'],
  staleFood: ['stale food', 'spoiled food', 'expired food'],
  uncoveredFood: ['uncovered food', 'food left uncovered', 'food items uncovered']
}

const prettify = (key) => ({ flies: 'Flies', fssai: 'FSSAI licence', personalHygiene: 'Personal hygiene', staleFood: 'Stale food', uncoveredFood: 'Uncovered food' }[key] || key)
const normaliseText = (text = '') => text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()

export function detectRecurringViolations(inspections = []) {
  const counts = {}
  inspections.forEach((inspection) => {
    const text = normaliseText((inspection.observations || []).join(' '))
    Object.entries(violationAliases).forEach(([key, aliases]) => {
      if (aliases.some((alias) => text.includes(normaliseText(alias)))) counts[key] = (counts[key] || 0) + 1
    })
  })
  return Object.entries(counts).filter(([, count]) => count >= 2).map(([key, count]) => ({ key, label: prettify(key), count }))
}
