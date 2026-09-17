export const STATUS = { PASS: 'PASS', IMPROVEMENT: 'IMPROVEMENT_NOTICE', CRITICAL: 'CRITICAL', UNKNOWN: 'NOT_AVAILABLE' }

export function calculateInspectionStatus(inspection = {}) {
  const score = inspection.hygieneScore === null || inspection.hygieneScore === undefined || String(inspection.hygieneScore).trim() === '' ? NaN : Number(inspection.hygieneScore)
  const validScore = Number.isFinite(score) && score >= 0 && score <= 100
  const text = `${inspection.actionTaken || ''} ${(inspection.observations || []).join(' ')}`.toLowerCase()
  if (inspection.enforcement === 'STOP_OPERATIONS' || /closure|critical|severe|condemn/.test(text) || (validScore && score < 60)) return STATUS.CRITICAL
  if (/improvement notice/.test(text) || (validScore && score >= 60 && score < 80)) return STATUS.IMPROVEMENT
  if (validScore && score >= 80) return STATUS.PASS
  return STATUS.UNKNOWN
}

export const statusLabel = (status) => ({ PASS: 'Pass', IMPROVEMENT_NOTICE: 'Improvement Notice', CRITICAL: 'Critical', NOT_AVAILABLE: 'Not available' }[status] || 'Not available')
