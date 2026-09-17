import { useState } from 'react'
import { Trash2, RotateCcw } from 'lucide-react'
import { setRestaurantDeleted } from '../services/restaurantService'

export default function ManageRestaurants({ restaurants }) {
  const [trash, setTrash] = useState(false)
  const [query, setQuery] = useState('')
  const [pending, setPending] = useState(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const rows = restaurants.filter((item) => Boolean(item.deletedAt) === trash && `${item.name} ${item.location}`.toLowerCase().includes(query.trim().toLowerCase()))
  const change = async (restaurant, deleted) => {
    setBusy(true); setMessage(''); setError('')
    try {
      await setRestaurantDeleted(restaurant, deleted)
      setMessage(`${restaurant.name} ${deleted ? 'moved to Trash. You can restore it from the Trash tab.' : 'restored to the directory.'}`)
      setPending(null)
    } catch { setError('The record could not be updated. Check storage access or Firebase permissions and try again.') }
    finally { setBusy(false) }
  }
  return <section className="panel mb-7 p-5 sm:p-6" aria-labelledby="manage-heading"><h2 id="manage-heading" className="text-xl font-extrabold text-civic-900">Manage restaurants</h2><p className="mt-2 text-sm text-slate-600">Move a restaurant to Trash to remove it from the directory. Its inspection history is retained for restoration.</p><div className="my-4 flex flex-wrap items-center gap-3"><button className={trash ? 'button-secondary' : 'button-primary'} aria-pressed={!trash} disabled={busy} onClick={() => { setTrash(false); setPending(null) }}>Active ({restaurants.filter((item) => !item.deletedAt).length})</button><button className={trash ? 'button-primary' : 'button-secondary'} aria-pressed={trash} disabled={busy} onClick={() => { setTrash(true); setPending(null) }}>Trash ({restaurants.filter((item) => item.deletedAt).length})</button><input aria-label="Search managed restaurants" className="field sm:ml-auto sm:max-w-xs" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name or locality" /></div>{message && <p role="status" className="mb-4 text-sm font-semibold text-civic-700">{message}</p>}{error && <p role="alert" className="mb-4 text-sm font-semibold text-red-700">{error}</p>}<ul className="divide-y divide-civic-100">{rows.map((restaurant) => <li className="py-4" key={restaurant.id}><div className="flex items-center justify-between gap-4"><div><h3 className="font-bold">{restaurant.name}</h3><p className="text-sm text-slate-600">{restaurant.location || 'Locality unavailable'}</p></div>{trash ? <button className="button-secondary" disabled={busy} aria-label={`Restore ${restaurant.name}`} onClick={() => change(restaurant, false)}><RotateCcw size={16} />Restore</button> : <button className="button-delete" disabled={busy} aria-label={`Delete ${restaurant.name}`} onClick={() => { setPending(restaurant.id); setMessage(''); setError('') }}><Trash2 size={16} />Delete</button>}</div>{pending === restaurant.id && <div className="mt-4 rounded-xl border border-orange-200 bg-orange-50 p-4"><p className="text-sm">Move <strong>{restaurant.name}</strong> to Trash? The restaurant and its inspection history will no longer appear on the site. You can restore it later.</p><div className="mt-3 flex flex-wrap gap-2"><button className="button-delete" disabled={busy} onClick={() => change(restaurant, true)}>{busy ? 'Moving…' : 'Move to Trash'}</button><button className="button-secondary" disabled={busy} onClick={() => setPending(null)}>Cancel</button></div></div>}</li>)}</ul>{!rows.length && <p className="py-6 text-sm text-slate-600">{trash ? 'No deleted restaurants match this search.' : 'No restaurants match this search.'}</p>}</section>
}
