import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MdDoorFront, MdHome, MdWindow, MdSearch } from 'react-icons/md';

const mkd = (n) =>
  new Intl.NumberFormat('mk-MK', {
    style: 'currency',
    currency: 'MKD',
    maximumFractionDigits: 2,
  }).format(n);

const CATS = [
  {
    key: 'interior',
    label: 'ВНАТРЕШНИ ВРАТИ',
    icon: 'fa-solid fa-door-closed',
  },
  { key: 'exterior', label: 'НАДВОРЕШНИ ВРАТИ', icon: 'fas fa-door-open' },
  {
    key: 'windows',
    label: 'ПВЦ СТОЛАРИЈА',
    icon: 'fa-regular fa-window-frame',
  },
];

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [params, setParams] = useSearchParams();
  const cat = params.get('cat') || 'interior';
  const [q, setQ] = useState('');

  const load = () =>
    fetch(`/api/products?category=${cat}`)
      .then((r) => r.json())
      .then(setProducts);
  React.useEffect(() => {
    load();
  }, [cat]);

  const filtered = useMemo(() => {
    const _q = q.toLowerCase();
    return products.filter((p) => !_q || p.name.toLowerCase().includes(_q));
  }, [products, q]);

  return (
    <div>
      {/* Category Tabs */}
      <div className="bg-white/90 backdrop-blur border rounded-xl mb-5">
        <div className="grid grid-cols-3 text-center">
          {CATS.map((c) => (
            <button
              key={c.key}
              onClick={() => setParams({ cat: c.key })}
              className={`py-3 relative font-semibold transition-colors ${
                cat === c.key
                  ? 'text-slate-900 bg-slate-50'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {typeof c.icon === 'string' ? (
                <i className={`${c.icon} text-xl mb-1 block mx-auto`}></i>
              ) : (
                <c.icon className="text-xl mb-1 block mx-auto" />
              )}
              <div className="text-xs font-medium">{c.label}</div>
              {cat === c.key && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 rounded-t"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="relative w-full md:w-80">
          <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Пребарај производ…"
            className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-slate-600">Нема производи.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="block bg-white rounded-2xl border hover:shadow-lg transition overflow-hidden"
            >
              <div className="w-full h-96 bg-slate-50 flex items-center justify-center overflow-hidden">
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-bold text-slate-800">{p.name}</h3>
                <div className="mt-2 text-slate-700 font-semibold">
                  {mkd(p.price_mkd)} ден
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
