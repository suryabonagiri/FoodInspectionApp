import { useEffect, useId, useRef } from 'react'
import { X } from 'lucide-react'

export default function SideDrawer({ open, onClose, title, side = 'left', children, footer }) {
  const ref = useRef(null)
  const titleId = useId()
  useEffect(() => {
    const dialog = ref.current
    if (!open) return
    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    return () => { dialog.close(); document.body.style.overflow = previousOverflow }
  }, [open])
  return <dialog ref={ref} className={`side-drawer side-drawer-${side}`} aria-labelledby={titleId}
    onCancel={(event) => { event.preventDefault(); onClose() }}
    onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <div className="drawer-surface">
      <div className="drawer-heading"><h2 id={titleId}>{title}</h2><button autoFocus type="button" onClick={onClose} className="icon-button" aria-label={`Close ${title.toLowerCase()}`}><X size={20} /></button></div>
      <div className="drawer-content">{children}</div>
      {footer && <div className="drawer-footer">{footer}</div>}
    </div>
  </dialog>
}
