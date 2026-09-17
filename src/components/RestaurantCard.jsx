import { ArrowUpRight, ExternalLink, MapPin, Shield } from 'lucide-react'
import StatusBadge from './StatusBadge'

const displayDate = (date) => date ? new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${date}T00:00:00`)) : 'Date unavailable'
export default function RestaurantCard({ restaurant, inspection, recurring, navigate }) {
  const href = `/restaurant/${restaurant.id}`
  const follow = (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault(); navigate(href)
  }
  const insight = inspection?.observations?.length ? inspection.observations.slice(0, 2).join('; ') : inspection?.actionTaken || restaurant.quickInsight
  const hasScore = restaurant.currentScore != null
  return <article className="restaurant-card">
    <div className="card-status"><StatusBadge status={restaurant.currentStatus} /><span className="record-type">{inspection?.sourceType ? 'Reported' : 'Sample'}</span></div>
    <h3 className="card-title"><a href={href} onClick={follow}>{restaurant.name}</a></h3>
    <p className="card-location"><MapPin size={14} aria-hidden="true" />{restaurant.location || 'Location unavailable'}</p>
    <div className="card-facts"><div><span className="card-fact-label">Hygiene score</span><strong className={hasScore ? 'card-score' : 'card-unreported'}>{hasScore ? `${restaurant.currentScore}%` : 'Not reported'}</strong></div><div className="text-right"><span className="card-fact-label">{inspection?.inspectionDate ? 'Inspected' : 'Report date'}</span><span className="card-date">{displayDate(inspection?.inspectionDate || inspection?.reportDate)}</span></div></div>
    <p className="card-insight">{insight}</p>
    {recurring.length > 0 && <p className="card-recurring">Recurring concern · {recurring.length} {recurring.length === 1 ? 'category' : 'categories'}</p>}
    <p className="card-authority"><Shield size={13} aria-hidden="true" />{restaurant.authority || 'Authority unavailable'}</p>
    <div className="card-links"><div className="flex flex-wrap items-center gap-x-3">{inspection?.sourceUrl ? <a href={inspection.sourceUrl} target="_blank" rel="noopener noreferrer">Source <ExternalLink size={12} aria-hidden="true" /></a> : <span className="text-xs text-slate-500">No source link</span>}{inspection?.originalPostUrl && <a href={inspection.originalPostUrl} target="_blank" rel="noopener noreferrer">X post <ExternalLink size={12} aria-hidden="true" /></a>}</div><a className="card-details" href={href} onClick={follow} aria-label={`View ${restaurant.name} inspection details`}>Details <ArrowUpRight size={16} aria-hidden="true" /></a></div>
  </article>
}
