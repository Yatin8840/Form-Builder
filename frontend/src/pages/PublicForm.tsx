import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { API_BASE, api } from '../lib/api'

export default function PublicForm(){
  const { id } = useParams()
  const [form, setForm] = useState<any>(null)
  const [status, setStatus] = useState<{type: 'idle'|'success'|'error', message?: string}>({type:'idle'})
  const [files, setFiles] = useState<Record<string, File[]>>({})

  useEffect(() => { (async () => setForm(await api(`/api/forms/${id}`)))() }, [id])

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    if (!form) return
    const fd = new FormData()
    const el = e.currentTarget
    const data: Record<string, any> = {}
    form.fields.forEach((f:any) => {
      if (['checkbox'].includes(f.type)) {
        const selected: string[] = []
        ;(el.querySelectorAll(`input[name="${f.name}"]:checked`) as any).forEach((x:any) => selected.push(x.value))
        data[f.name] = selected
      } else if (f.type==='radio') {
        const selected = (el.querySelector(`input[name="${f.name}"]:checked`) as HTMLInputElement | null)?.value || ''
        data[f.name] = selected
      } else if (f.type==='file') {
        (files[f.name]||[]).forEach(file => fd.append('files', file))
      } else {
        const inp = el.querySelector(`[name="${f.name}"]`) as HTMLInputElement | HTMLTextAreaElement | null
        data[f.name] = inp?.value || ''
      }
    })
    for (const [k,v] of Object.entries(data)) {
      if (Array.isArray(v)) v.forEach(val => fd.append(k, val)); else fd.append(k, String(v))
    }
    try {
      const res = await fetch(`${API_BASE}/api/forms/${form._id}/submissions`, { method: 'POST', body: fd })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload?.message || 'Submission failed')
      setStatus({ type: 'success', message: payload?.message || 'Submitted' })
      if (payload?.redirectUrl) window.location.href = payload.redirectUrl
    } catch (err:any) { setStatus({ type: 'error', message: err.message }) }
  }

  if (!form) return <div className="container py-6">Loading…</div>

  return (
    <div className="container py-6 max-w-2xl">
      <div className="card space-y-2">
        <h1 className="text-2xl font-semibold">{form.title}</h1>
        {form.description && <p className="text-gray-600">{form.description}</p>}
      </div>
      <form className="card space-y-4 mt-4" onSubmit={onSubmit}>
        {form.fields.map((f:any) => (
          <div key={f.id}>
            <label className="label">{f.label}{f.required && ' *'}</label>
            {(f.type==='text' || f.type==='email') && (<input className="input" name={f.name} placeholder={f.placeholder||''} type={f.type==='email' ? 'email' : 'text'} required={!!f.required} />)}
            {f.type==='textarea' && (<textarea className="input" name={f.name} placeholder={f.placeholder||''} required={!!f.required} />)}
            {f.type==='select' && (<select className="input" name={f.name} required={!!f.required}><option value="">Select…</option>{(f.options||[]).map((o:any, i:number) => <option key={i} value={o.value}>{o.label}</option>)}</select>)}
            {f.type==='checkbox' && (<div className="flex flex-col gap-2">{(f.options||[]).map((o:any, i:number) => (<label key={i} className="flex items-center gap-2"><input type="checkbox" name={f.name} value={o.value} /> <span>{o.label}</span></label>))}</div>)}
            {f.type==='radio' && (<div className="flex flex-col gap-2">{(f.options||[]).map((o:any, i:number) => (<label key={i} className="flex items-center gap-2"><input type="radio" name={f.name} value={o.value} /> <span>{o.label}</span></label>))}</div>)}
            {f.type==='file' && (<input className="input" type="file" multiple onChange={(e) => { const arr = Array.from(e.target.files||[]); setFiles(prev => ({ ...prev, [f.name]: arr })) }} />)}
          </div>
        ))}
        <button className="btn btn-primary" type="submit">Submit</button>
        {status.type==='success' && <div className="text-green-600">{status.message}</div>}
        {status.type==='error' && <div className="text-red-600">{status.message}</div>}
      </form>
    </div>
  )
}
