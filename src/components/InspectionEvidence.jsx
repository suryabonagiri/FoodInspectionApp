export default function InspectionEvidence({ inspection }) {
  if (!inspection?.sourceType) return null
  return <aside className="mt-4 rounded-xl border border-civic-100 bg-civic-50 p-4 text-sm leading-6 text-slate-700">
    <p className="font-bold">Historical inspection · {inspection.sourceType}</p>
    <p>{inspection.verificationNote}</p>
    {inspection.reportDate && <p className="mt-1">News report date: {inspection.reportDate}{!inspection.inspectionDate && ' · Exact inspection date not established'}</p>}
    {inspection.researchedAt && <p className="mt-1">Sources checked: {inspection.researchedAt}</p>}
    {inspection.corroboratingUrl && <a className="font-semibold text-civic-700 underline" href={inspection.corroboratingUrl} target="_blank" rel="noopener noreferrer">Read corroborating report</a>}
  </aside>
}
