
import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

const mkd = (n)=> new Intl.NumberFormat('mk-MK',{style:'currency',currency:'MKD',maximumFractionDigits:2}).format(n)

export default function Product(){
  const { id } = useParams()
  const nav = useNavigate()
  const [p,setP]=React.useState(null)
  React.useEffect(()=>{ fetch('/api/products/'+id).then(r=>r.json()).then(setP) },[id])
  if(!p) return <div>...</div>
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <button onClick={()=>nav(-1)} className="px-3 py-2 border rounded">← Назад</button>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start bg-white rounded-3xl p-6 border">
        <img src={p.images[0]} alt={p.name} className="w-full h-[520px] object-contain bg-slate-50 rounded-2xl" />

        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">{p.name}</h1>
          <div className="text-2xl font-bold mt-2">{mkd(p.price_mkd)} ден</div>

          <ul className="mt-6 space-y-3">
            {Object.entries(p.specs || {}).map(([k,v]) => (
              <li key={k} className="flex gap-2">
                <span className="font-semibold">{k}:</span>
                <span className="text-slate-700">{v}</span>
              </li>
            ))}
          </ul>

          <div className="h-px bg-slate-200 my-6"></div>

          <div className="flex gap-3">
            <a href={`https://wa.me/3890000000?text=Интерес за: ${encodeURIComponent(p.name)}`} target="_blank" className="px-4 py-2 rounded bg-green-600 text-white">Контакт за нарачка</a>
            <a href="/" className="px-4 py-2 rounded border">Каталог</a>
          </div>
        </div>
      </div>
    </div>
  )
}
