import { AlertTriangle } from 'lucide-react'
export default function RecurringConcern({ concerns }) {
  if (!concerns.length) return null
  return <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-950"><div className="flex items-center gap-2 font-bold"><AlertTriangle size={18} />Recurring concern</div>{concerns.map((item) => <p className="mt-1 text-sm" key={item.key}>{item.label} has been recorded in {item.count} inspections.</p>)}</div>
}
