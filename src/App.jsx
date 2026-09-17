import { useEffect, useState } from 'react'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import RestaurantDetail from './pages/RestaurantDetail'
import Admin from './pages/Admin'
import SubmitData from './pages/SubmitData'
import { subscribeInspections, subscribeRestaurants } from './services/restaurantService'

export default function App() {
  const [path, setPath] = useState(window.location.pathname); const [restaurants, setRestaurants] = useState([]); const [inspections, setInspections] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('')
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => { const listener = () => { setPath(window.location.pathname); setHash(window.location.hash) }; window.addEventListener('popstate', listener); window.addEventListener('hashchange', listener); return () => { window.removeEventListener('popstate', listener); window.removeEventListener('hashchange', listener) } }, [])
  useEffect(() => {
    let restaurantsReady = false; let inspectionsReady = false
    const updateLoading = () => setLoading(!(restaurantsReady && inspectionsReady))
    const stopRestaurants = subscribeRestaurants((records) => { setRestaurants(records); restaurantsReady = true; updateLoading() }, (message) => { setError(message); restaurantsReady = true; updateLoading() })
    const stopInspections = subscribeInspections((records) => { setInspections(records); inspectionsReady = true; updateLoading() }, (message) => { setError(message); inspectionsReady = true; updateLoading() })
    return () => { stopRestaurants?.(); stopInspections?.() }
  }, [])
  const navigate = (target) => { const [pathname, hash] = target.split('#'); window.history.pushState({}, '', target); setPath(pathname || '/'); setHash(hash ? `#${hash}` : ''); if (hash) setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' }), 0); else window.scrollTo({ top: 0, behavior: 'instant' }) }
  const visibleRestaurants = restaurants.filter((item) => !item.deletedAt)
  const id = path.match(/^\/restaurant\/([^/]+)$/)?.[1]; const restaurant = id ? visibleRestaurants.find((item) => item.id === id) : null
  return <div className="min-h-screen"><Header navigate={navigate} path={path} hash={hash} />{error && <div role="alert" className="page-shell pt-4 text-sm font-semibold text-red-700">{error}</div>}{path === '/submit' ? <SubmitData /> : path === '/admin' ? <Admin restaurants={restaurants} inspections={inspections} /> : id ? loading ? <main className="page-shell py-12" role="status">Loading restaurant record…</main> : <RestaurantDetail restaurant={restaurant} inspections={inspections} navigate={navigate} /> : <Dashboard restaurants={visibleRestaurants} inspections={inspections} loading={loading} navigate={navigate} />}<footer className="border-t border-slate-200 bg-white py-7"><div className="page-shell text-xs leading-5 text-slate-500">Independent civic-tech interface. Source links are shown only where supplied by the record.</div></footer></div>
}
