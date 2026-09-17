import { useId, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import SideDrawer from './SideDrawer'

export const inspectionStatuses = [
  ['ALL', 'All statuses'], ['PASS', 'Pass'], ['IMPROVEMENT_NOTICE', 'Improvement notice'],
  ['CRITICAL', 'Critical'], ['NOT_AVAILABLE', 'Not available']
]
function FilterOptions({ restaurants, zones, zone, setZone, status, setStatus, recurringOnly, setRecurringOnly, dateStart, setDateStart, dateEnd, setDateEnd, invalidRange }) {
  const id = useId()
  return <div className="filter-options">
    <label className="filter-label">Locality<select className="field" value={zone} onChange={(event) => setZone(event.target.value)}><option value="">All localities ({restaurants.length})</option>{zones.map((item) => <option key={item} value={item}>{item} ({restaurants.filter((record) => record.location === item).length})</option>)}</select></label>
    <fieldset className="filter-group"><legend>Inspection status</legend>{inspectionStatuses.map(([value, label]) => <label key={value} className="filter-choice"><input type="radio" name={`${id}-status`} checked={status === value} onChange={() => setStatus(value)} /><span>{label}</span></label>)}</fieldset>
    <fieldset className="filter-group"><legend>Inspection date</legend><div className="filter-dates"><label className="filter-label">From<input className="field" type="date" value={dateStart} aria-invalid={invalidRange} aria-describedby={invalidRange ? `${id}-error` : undefined} onChange={(event) => setDateStart(event.target.value)} /></label><label className="filter-label">To<input className="field" type="date" value={dateEnd} aria-invalid={invalidRange} aria-describedby={invalidRange ? `${id}-error` : undefined} onChange={(event) => setDateEnd(event.target.value)} /></label></div>{invalidRange && <p id={`${id}-error`} role="alert" className="mt-2 text-xs leading-5 text-red-700">Choose an end date on or after the start date.</p>}<p className="mt-2 text-xs leading-5 text-slate-500">Records with an unknown inspection date are excluded.</p></fieldset>
    <fieldset className="filter-group"><legend>Inspection history</legend><label className="filter-choice"><input type="checkbox" checked={recurringOnly} onChange={(event) => setRecurringOnly(event.target.checked)} /><span>Recurring concerns</span></label><p className="mt-1 text-xs leading-5 text-slate-500">Recorded in two or more inspections.</p></fieldset>
  </div>
}
export default function RestaurantFilters({ activeCount, reset, resultCount, ...props }) {
  const [open, setOpen] = useState(false)
  const clear = <button type="button" onClick={reset} disabled={!activeCount} className="filter-reset">Reset</button>
  return <>
    <aside aria-label="Restaurant filters" className="restaurant-filters"><div className="filter-heading"><h2><SlidersHorizontal size={16} aria-hidden="true" />Filters{activeCount > 0 && <span className="filter-count">{activeCount}</span>}</h2>{clear}</div><FilterOptions {...props} /></aside>
    <button className="mobile-filter-button button-secondary" type="button" onClick={() => setOpen(true)} aria-expanded={open}><SlidersHorizontal size={16} aria-hidden="true" />Filters{activeCount > 0 && <span className="filter-count">{activeCount}</span>}</button>
    <SideDrawer open={open} onClose={() => setOpen(false)} title="Filter restaurants" footer={<div className="flex items-center gap-4">{clear}<button className="button-primary flex-1" onClick={() => setOpen(false)} disabled={props.invalidRange}>Show {resultCount} {resultCount === 1 ? 'restaurant' : 'restaurants'}</button></div>}><FilterOptions {...props} /></SideDrawer>
  </>
}
