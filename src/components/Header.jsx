import { ShieldCheck, LockKeyhole } from 'lucide-react'

const links = [
  { label: 'Home', href: '/', key: 'home' },
  { label: 'Restaurants', href: '/#restaurants', key: 'restaurants' },
  { label: 'About', href: '/#about', key: 'about' },
  { label: 'Share restaurant info', href: '/submit', key: 'share' }
]
export default function Header({ navigate, path, hash }) {
  const current = path === '/admin' ? 'admin' : path === '/submit' ? 'share' : path.startsWith('/restaurant/') || hash === '#restaurants' ? 'restaurants' : hash === '#about' ? 'about' : 'home'
  const follow = (event, href) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault(); navigate(href)
  }
  return <><header className="border-b border-civic-100"><div className="page-shell py-4"><a href="/" onClick={(event) => follow(event, '/')} className="inline-flex items-center gap-3 text-left"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-civic-700 text-white"><ShieldCheck size={24} aria-hidden="true" /></span><span><span className="block text-sm font-extrabold tracking-tight text-civic-900 sm:text-lg">Hyderabad Food Inspection Transparency</span><span className="mt-0.5 block text-xs text-slate-600">Know the hygiene. Choose with confidence.</span></span></a></div><div className="border-t border-civic-100 bg-civic-50"><nav aria-label="Main navigation" className="page-shell flex flex-wrap items-center gap-2 py-2"><div className="grid w-full grid-cols-2 gap-1 sm:flex sm:w-auto sm:flex-wrap">{links.map((link) => <a key={link.key} href={link.href} onClick={(event) => follow(event, link.href)} aria-current={current === link.key ? 'page' : undefined} className={`nav-link ${current === link.key ? 'nav-link-active' : ''} ${link.key === 'share' ? 'nav-contribute' : ''}`}>{link.label}</a>)}</div><a href="/admin" onClick={(event) => follow(event, '/admin')} aria-current={current === 'admin' ? 'page' : undefined} className={`nav-link ml-auto inline-flex items-center gap-2 sm:pl-5 ${current === 'admin' ? 'nav-link-active' : ''}`}><LockKeyhole size={14} aria-hidden="true" />Admin</a></nav></div></header></>
}
