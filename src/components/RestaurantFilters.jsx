import { useState } from 'react'
import { ChevronDown, SlidersHorizontal } from 'lucide-react'

export const inspectionStatuses = [
  ['ALL', 'All statuses'], ['PASS', 'Pass'], ['IMPROVEMENT_NOTICE', 'Improvement notice'],
  ['CRITICAL', 'Critical'], ['NOT_AVAILABLE', 'Not available']
]

export default function RestaurantFilters({ restaurants, zones, zone, setZone, status, setStatus, recurringOnly, setRecurringOnly, dateStart, setDateStart, dateEnd, setDateEnd, invalidRange, activeCount, reset }) {
  const [expanded, setExpanded] = useState(false)
  return <aside aria-label="Restaurant filters" className="restaurant-filters">
    <div className="flex items-center justify-between gap-3 border-b border-civic-100 pb-4">
      <h3 className="flex items-center gap-2 text-lg font-extrabold text-civic-900"><SlidersHorizontal size={18} aria-hidden="true" />Filters{activeCount > 0 && <span className="rounded-full bg-civic-100 px-2 py-0.5 text-xs">{activeCount}</span>}</h3>
      <button onClick={reset} disabled={!activeCount} className="text-xs font-bold text-civic-700 underline underline-offset-4 disabled:opacity-40">Clear all</button>
    </div>
    <button className="mt-3 flex w-full items-center justify-between py-2 text-sm font-semibold text-civic-700 md:hidden" aria-expanded={expanded} aria-controls="restaurant-filter-options" onClick={() => setExpanded(!expanded)}>{expanded ? 'Hide filters' : 'Show filters'}<ChevronDown size={16} className={expanded ? 'rotate-180' : ''} aria-hidden="true" /></button>
    <div id="restaurant-filter-options" className={`${expanded ? 'block' : 'hidden'} md:block`}>
      <fieldset className="filter-group"><legend>Locality</legend><div className="max-h-56 space-y-1 overflow-y-auto pr-1">
        {[['', 'All localities'], ...zones.map((item) => [item, item])].map(([value, label]) => <label key={value} className="filter-choice"><input type="radio" name="locality" value={value} checked={zone === value} onChange={() => setZone(value)} /><span className="min-w-0 flex-1 break-words">{label}</span><span className="text-xs text-slate-500">{value ? restaurants.filter((item) => item.location === value).length : restaurants.length}</span></label>)}
      </div></fieldset>
      <fieldset className="filter-group"><legend>Inspection status</legend>{inspectionStatuses.map(([value, label]) => <label key={value} className="filter-choice"><input type="radio" name="inspection-status" checked={status === value} onChange={() => setStatus(value)} /><span>{label}</span></label>)}</fieldset>
      <fieldset className="filter-group"><legend>Inspection date</legend><label className="label text-xs">From<input className="field mt-2 min-w-0" type="date" value={dateStart} aria-invalid={invalidRange} aria-describedby={invalidRange ? 'filter-date-error' : undefined} onChange={(event) => setDateStart(event.target.value)} /></label><label className="label mt-3 text-xs">To<input className="field mt-2 min-w-0" type="date" value={dateEnd} aria-invalid={invalidRange} aria-describedby={invalidRange ? 'filter-date-error' : undefined} onChange={(event) => setDateEnd(event.target.value)} /></label>{invalidRange && <p id="filter-date-error" role="alert" className="mt-2 text-xs leading-5 text-red-700">The end date must be on or after the start date.</p>}</fieldset>
      <fieldset className="filter-group border-b-0"><legend>Inspection history</legend><label className="filter-choice"><input type="checkbox" checked={recurringOnly} onChange={(event) => setRecurringOnly(event.target.checked)} /><span>Recurring concerns only</span></label><p className="mt-2 text-xs leading-5 text-slate-500">Concerns recorded in at least two inspections.</p></fieldset>
    </div>
  </aside>
}
