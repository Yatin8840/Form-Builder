import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Input from '../components/ui/input'
import Select from '../components/ui/select'

export default function Preview(){
  const { id } = useParams()
  const [form, setForm] = useState<any>(null)
  useEffect(() => { (async () => { const res = await fetch(`/api/forms/${id}`); setForm(await res.json()) })() }, [id])
  if (!form) return <div className="container py-6">Loading…</div>
  return (
    <div className="container py-6 space-y-4">
      <div className="card"><h2 className="text-xl font-semibold">{form.title}</h2>{form.description && <p className="text-gray-600">{form.description}</p>}</div>
      <div className="card space-y-3">
        {form.fields.map((f:any) => (
          <div key={f.id}>
            <label className="label">{f.label}{f.required && ' *'}</label>
            {f.type==='text' && <Input placeholder={f.placeholder||''} disabled />}
            {f.type==='email' && <Input placeholder={f.placeholder||''} type="email" disabled />}
            {f.type==='textarea' && <textarea className="input" placeholder={f.placeholder||''} disabled />}
            {f.type==='file' && <input className="input" type="file" disabled />}
            {f.type==='select' && (<Select disabled>{(f.options||[]).map((o:any,i:number)=><option key={i} value={o.value}>{o.label}</option>)}</Select>)}
            {f.type==='checkbox' && (<div className="flex flex-col gap-2">{(f.options||[]).map((o:any,i:number)=>(<label key={i} className="flex items-center gap-2"><input type="checkbox" disabled /><span>{o.label}</span></label>))}</div>)}
            {f.type==='radio' && (<div className="flex flex-col gap-2">{(f.options||[]).map((o:any,i:number)=>(<label key={i} className="flex items-center gap-2"><input type="radio" name={f.name} disabled /><span>{o.label}</span></label>))}</div>)}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Link to={`/builder/${form._id}`} className="btn">Back to Builder</Link>
        <Link to={`/f/${form._id}`} className="btn btn-primary">Open Public Form</Link>
      </div>
    </div>
  )
}
