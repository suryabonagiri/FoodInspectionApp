export default function HygieneScore({ score, compact = false }) {
  const available = score !== null && score !== undefined
  return <div className={compact ? '' : 'rounded-xl bg-civic-50 px-5 py-4 text-center'}>
    <div className={`${compact ? 'text-xl' : 'text-4xl'} font-extrabold tracking-tight text-civic-900`}>{available ? `${score}%` : '—'}</div>
    <div className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Hygiene score</div>
  </div>
}
