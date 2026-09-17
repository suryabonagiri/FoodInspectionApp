import { useState } from 'react'
import { ShieldCheck, LockKeyhole, Menu, ArrowUpRight } from 'lucide-react'
import SideDrawer from './SideDrawer'

const links = [
  { label: 'Home', href: '/', key: 'home' },
  { label: 'Restaurants', href: '/#restaurants', key: 'restaurants' },
  { label: 'About', href: '/#about', key: 'about' },
  { label: 'Share info', href: '/submit', key: 'share' },
  { label: 'Admin', href: '/admin', key: 'admin' }
]
export default function Header({ navigate, path, hash }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const current = path === '/admin' ? 'admin' : path === '/submit' ? 'share' : path.startsWith('/restaurant/') || hash === '#restaurants' ? 'restaurants' : hash === '#about' ? 'about' : 'home'
  const follow = (event, href) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault(); setMenuOpen(false); navigate(href)
  }
  const navigation = (mobile = false) => <nav aria-label={mobile ? 'Mobile navigation' : 'Main navigation'} className={mobile ? 'mobile-navigation' : 'desktop-navigation'}>{links.map((link) => <a key={link.key} href={link.href} onClick={(event) => follow(event, link.href)} aria-current={current === link.key ? 'page' : undefined} className={`nav-link ${current === link.key ? 'nav-link-active' : ''}`}>
    {link.key === 'admin' && <LockKeyhole size={13} aria-hidden="true" />}{link.label}{mobile && <ArrowUpRight size={16} aria-hidden="true" />}
  </a>)}</nav>
  return <><a href="#main-content" className="skip-link">Skip to content</a><header className="site-header"><div className="page-shell header-row">
    <a href="/" onClick={(event) => follow(event, '/')} className="brand" aria-label="Hyderabad Food Inspection Transparency — Home"><span className="brand-icon"><ShieldCheck size={21} aria-hidden="true" /></span><span><strong>Hyderabad</strong><span>Food inspection transparency</span></span></a>
    {navigation()}
    <button className="icon-button mobile-menu-button" aria-label="Open navigation menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Menu size={23} /></button>
  </div></header><SideDrawer open={menuOpen} onClose={() => setMenuOpen(false)} title="Navigation" side="right">{navigation(true)}<p className="mt-8 text-xs leading-6 text-slate-500">Independent food-safety information.<br />Not an official government website.</p></SideDrawer></>
}
