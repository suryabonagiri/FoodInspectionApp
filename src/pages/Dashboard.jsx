import { useMemo, useState } from 'react'
import { firebaseConfigured } from '../lib/firebase'
import { Search, Building2, X, ArrowRight, Download } from 'lucide-react'
import { downloadRecords } from '../utils/exportRecords'
import RestaurantFilters, { inspectionStatuses } from '../components/RestaurantFilters'
import RestaurantCard from '../components/RestaurantCard'
import { detectRecurringViolations } from '../utils/violationDetector'

export default function Dashboard({ restaurants, inspections, loading, navigate }) {
  const [query, setQuery] = useState(''); const [zone, setZone] = useState(''); const [status, setStatus] = useState('ALL'); const [recurringOnly, setRecurringOnly] = useState(false); const [dateStart, setDateStart] = useState(''); const [dateEnd, setDateEnd] = useState('')
  const [sort, setSort] = useState('latest')
  const invalidRange = Boolean(dateStart && dateEnd && dateStart > dateEnd)
  const zones = [...new Set(restaurants.map((item) => item.location).filter(Boolean))].sort()
  const rows = useMemo(() => restaurants.map((restaurant) => {
    const history = inspections.filter((item) => item.restaurantId === restaurant.id)
    const latest = history.sort((a, b) => (b.inspectionDate || '').localeCompare(a.inspectionDate || ''))[0]
    return { restaurant, history, latest, recurring: detectRecurringViolations(history) }
  }).filter(({ restaurant, history, recurring }) => {
    const haystack = [restaurant.name, restaurant.location, restaurant.authority, ...history.flatMap((record) => [...(record.observations || []), ...(record.goodPractices || [])])].join(' ').toLowerCase()
    const dateMatch = history.some((record) => Boolean(record.inspectionDate) && (!dateStart || record.inspectionDate >= dateStart) && (!dateEnd || record.inspectionDate <= dateEnd))
    return !invalidRange && (!query || haystack.includes(query.toLowerCase())) && (!zone || restaurant.location === zone) && (status === 'ALL' || restaurant.currentStatus === status) && (!recurringOnly || recurring.length) && (!dateStart && !dateEnd || dateMatch)
  }).sort((a, b) => sort === 'name' ? a.restaurant.name.localeCompare(b.restaurant.name) : (b.latest?.inspectionDate || '').localeCompare(a.latest?.inspectionDate || '') || a.restaurant.name.localeCompare(b.restaurant.name)), [restaurants, inspections, query, zone, status, recurringOnly, dateStart, dateEnd, sort])
  const reset = () => { setQuery(''); setZone(''); setStatus('ALL'); setRecurringOnly(false); setDateStart(''); setDateEnd('') }
  const activeFilters = [
    query && { label: `Search: ${query}`, clear: () => setQuery('') },
    zone && { label: zone, clear: () => setZone('') },
    status !== 'ALL' && { label: inspectionStatuses.find(([value]) => value === status)?.[1], clear: () => setStatus('ALL') },
    dateStart && { label: `From: ${dateStart}`, clear: () => setDateStart('') },
    dateEnd && { label: `To: ${dateEnd}`, clear: () => setDateEnd('') },
    recurringOnly && { label: 'Recurring concerns', clear: () => setRecurringOnly(false) }
  ].filter(Boolean)
  return <main id="main-content" tabIndex={-1}>
    <section className="food-hero border-b border-civic-100"><div className="page-shell hero-layout"><div><p className="hero-eyebrow">Hyderabad · Food safety records</p><h1 className="hero-heading">A little clarity.<br className="sm:hidden" /> Before you dine.</h1><p className="hero-description">Explore government inspection findings, with sources you can check.</p></div><form className="hero-search" onSubmit={(event) => { event.preventDefault(); document.getElementById('restaurants')?.scrollIntoView({ behavior: 'smooth' }) }}><label className="search-input"><Search size={19} aria-hidden="true" /><span className="sr-only">Search restaurant, locality or violation</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Restaurant, locality or concern" type="search" /></label><button type="submit" className="search-submit" aria-label="Search restaurant records"><ArrowRight size={20} /></button></form></div></section>
    <section id="restaurants" className="page-shell directory-section">
      <div className="directory-heading"><h2>Restaurant directory</h2><p>Historical findings, not a current safety rating.</p></div>
      <div className="restaurant-directory">
        <RestaurantFilters {...{ restaurants, zones, zone, setZone, status, setStatus, recurringOnly, setRecurringOnly, dateStart, setDateStart, dateEnd, setDateEnd, invalidRange, reset }} activeCount={activeFilters.length} resultCount={rows.length} />
        <div className="min-w-0">
          <div className="results-toolbar">
            <p role="status" aria-live="polite" className="text-sm text-slate-600"><strong className="text-civic-900">{loading ? '…' : rows.length}</strong> {rows.length === 1 ? 'restaurant' : 'restaurants'} found</p>
            <div className="results-actions"><label><span className="sr-only">Sort restaurants</span><select className="field w-auto" value={sort} onChange={(event) => setSort(event.target.value)}><option value="latest">Latest inspection</option><option value="name">Restaurant name</option></select></label><button className="text-xs font-semibold text-civic-700 underline underline-offset-4 disabled:opacity-40" disabled={loading || !rows.length || invalidRange} onClick={() => downloadRecords(rows)} aria-label="Export filtered restaurants as CSV"><Download size={16} aria-hidden="true" /><span className="hidden sm:inline">Export</span></button></div>
          </div>
          {activeFilters.length > 0 && <div aria-label="Applied filters" className="mb-5 flex flex-wrap gap-2">{activeFilters.map((filter) => <button key={filter.label} onClick={filter.clear} className="inline-flex max-w-full items-center gap-2 rounded-full border border-civic-100 bg-civic-50 px-3 py-1.5 text-xs font-semibold text-civic-700" aria-label={`Remove ${filter.label} filter`}><span className="truncate">{filter.label}</span><X size={13} className="shrink-0" aria-hidden="true" /></button>)}</div>}
          {loading ? <div className="panel p-10 text-center text-slate-600">Loading inspection records…</div> : rows.length ? <div className="restaurant-grid">{rows.map(({ restaurant, latest, recurring }) => <RestaurantCard key={restaurant.id} restaurant={restaurant} inspection={latest} recurring={recurring} navigate={navigate} />)}</div> : <div className="panel p-10 text-center"><Building2 className="mx-auto text-slate-400" size={32} /><h3 className="mt-3 font-bold">No inspection records found</h3><p className="mt-1 text-sm text-slate-600">Try changing the search words or clearing the filters.</p><button className="button-secondary mt-5" onClick={reset}>Clear all filters</button></div>}
        </div>
      </div>
    </section>
    <section id="about" className="ingredients-section border-t border-civic-100 py-12"><div className="page-shell grid gap-8 md:grid-cols-3"><div><h2 className="text-2xl font-extrabold text-slate-900">What is this?</h2></div><div className="md:col-span-2 space-y-5 leading-7 text-slate-600"><p>Hyderabad Food Inspection Transparency is a civic-tech interface designed to make publicly available food inspection information easier to understand.</p><p>Government inspection updates are ingested from publicly available source posts, structured into inspection records, and presented in a consumer-friendly format.</p><div className="about-notice mt-5 px-5 py-4 text-sm leading-6"><p>This platform presents inspection information from publicly available government sources. It is not an official government website.</p>{!firebaseConfigured && <p className="mt-3 font-bold">Local Data Mode — Includes demo samples and sourced historical inspections. Reported findings describe the inspection date; current compliance has not been verified.</p>}</div></div></div></section>
  </main>
}
