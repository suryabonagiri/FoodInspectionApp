import { generateConsumerSummary } from '../utils/summaryGenerator.js'

// Stable restaurant IDs match the existing admin importer. Keep saved edits and
// trash markers, while coalescing previously imported drafts with bundled records.
export function mergeCatalog(initial, saved) {
  const restaurants = [...new Map([...initial.restaurants, ...saved.restaurants].map((item) => [item.id, item])).values()]
  const inspections = []
  for (const record of [...initial.inspections, ...saved.inspections]) {
    const index = inspections.findIndex((item) => item.id === record.id ||
      (record.importKey && item.importKey === record.importKey) ||
      (record.sourceUrl && item.sourceUrl === record.sourceUrl && item.restaurantId === record.restaurantId && item.inspectionDate === record.inspectionDate))
    if (index < 0) inspections.push(record)
    else inspections[index] = { ...inspections[index], ...record }
  }
  // Derive summaries for sourced records from the newest inspection so importing
  // an older draft cannot make the directory disagree with its detail timeline.
  const sourcedIds = new Set(initial.inspections.filter((item) => item.importKey).map((item) => item.restaurantId))
  return {
    inspections,
    restaurants: restaurants.map((restaurant) => {
      if (!sourcedIds.has(restaurant.id)) return restaurant
      const latest = inspections.filter((item) => item.restaurantId === restaurant.id).sort((a, b) => (b.inspectionDate || '').localeCompare(a.inspectionDate || ''))[0]
      return latest ? { ...restaurant, currentScore: latest.hygieneScore, currentStatus: latest.status, quickInsight: generateConsumerSummary(latest) } : restaurant
    })
  }
}
