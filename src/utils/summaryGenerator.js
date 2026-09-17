export function generateConsumerSummary(inspection = {}) {
  // TODO: Integrate Gemini/OpenAI through a secure server-side function; never expose an API key in the browser.
  const concerns = inspection.observations || []
  const action = inspection.actionTaken ? `; ${inspection.actionTaken.toLowerCase()}` : ''
  if (inspection.enforcement === 'STOP_OPERATIONS') {
    const event = inspection.inspectionDate ? `The ${inspection.inspectionDate} inspection` : inspection.reportDate ? `News reporting dated ${inspection.reportDate}` : 'The source'
    return `${event} reports licence suspension and an instruction to stop operations. Later compliance or reopening has not been verified.`
  }
  if (inspection.hygieneScore === null || inspection.hygieneScore === undefined) {
    return concerns.length ? `An inspection event is recorded with the following observation: ${concerns[0]}. Further scoring information is not available in the source data.` : 'An inspection event is recorded, but detailed findings are not available in the source data.'
  }
  if (Number(inspection.hygieneScore) < 60) return `Critical hygiene concerns were identified, including ${concerns.slice(0, 2).join(' and ').toLowerCase()}${action}.`
  if (Number(inspection.hygieneScore) >= 80) return concerns.length ? `High overall compliance, with minor remarks regarding ${concerns.slice(0, 2).join(' and ').toLowerCase()}.` : 'High overall compliance was recorded during the inspection.'
  return `Improvement is needed in ${concerns.slice(0, 2).join(' and ').toLowerCase() || 'the recorded inspection areas'}${action}.`
}
