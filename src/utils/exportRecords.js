// Quote every cell and neutralize spreadsheet formulas in source-provided text.
const cell = (value) => {
  const text = String(value ?? '')
  return `"${(/^[\s]*[=+@-]/.test(text) ? `'${text}` : text).replace(/"/g, '""')}"`
}
export function recordsToCsv(rows) {
  return [
    ['Restaurant', 'Location', 'Status', 'Hygiene score', 'Latest inspection', 'News report date', 'Source URL', 'Recurring concerns'],
    ...rows.map(({ restaurant, latest, recurring }) => [restaurant.name, restaurant.location, restaurant.currentStatus, restaurant.currentScore, latest?.inspectionDate, latest?.reportDate, latest?.sourceUrl, recurring.map((item) => item.label).join('; ')])
  ].map((row) => row.map(cell).join(',')).join('\r\n')
}
export function downloadRecords(rows) {
  const url = URL.createObjectURL(new Blob(['\uFEFF', recordsToCsv(rows)], { type: 'text/csv;charset=utf-8;' }))
  const link = document.createElement('a')
  link.href = url; link.download = 'restaurant-inspection-records.csv'; link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
