import { AlertTriangle, CheckCircle2, CircleHelp } from 'lucide-react'
import { statusLabel } from '../utils/statusEngine'

const styles = {
  PASS: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  IMPROVEMENT_NOTICE: 'bg-amber-50 text-amber-900 ring-amber-200',
  CRITICAL: 'bg-red-50 text-red-800 ring-red-200',
  NOT_AVAILABLE: 'bg-slate-100 text-slate-700 ring-slate-200'
}
export default function StatusBadge({ status, large = false }) {
  const Icon = status === 'PASS' ? CheckCircle2 : status === 'NOT_AVAILABLE' ? CircleHelp : AlertTriangle
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-bold uppercase tracking-wide ring-1 ${large ? 'text-sm px-4 py-2' : 'text-xs'} ${styles[status] || styles.NOT_AVAILABLE}`}><Icon size={large ? 18 : 14} aria-hidden="true" />{statusLabel(status)}</span>
}
