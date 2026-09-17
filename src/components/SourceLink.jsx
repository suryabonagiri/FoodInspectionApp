import { ExternalLink } from 'lucide-react'
export default function SourceLink({ url, handle, originalPostUrl }) {
  if (!url) return <p className="text-sm text-slate-500">Source link unavailable</p>
  return <div className="flex flex-wrap gap-x-4 gap-y-2"><a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-civic-700 underline underline-offset-4 hover:text-civic-900"><ExternalLink size={15} />View source evidence {handle && <span className="font-normal no-underline">({handle})</span>}</a>{originalPostUrl && originalPostUrl !== url && <a href={originalPostUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-civic-700 underline underline-offset-4">Original X post</a>}</div>
}
