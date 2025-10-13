import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  MdSearch,
  MdPhone,
  MdEmail,
  MdLocationOn,
  MdContactMail,
} from 'react-icons/md';
import { useStore } from '../store';

const mkd = (n: number) =>
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
    icon: '/logos/window.png',
  },
  {
    key: 'contact',
    label: 'КОНТАКТ',
    icon: MdContactMail,
  },
];

export default function Catalog() {
  const products = useStore((state) => state.products);
  const q = useStore((state) => state.q);
  const setProducts = useStore((state) => state.setProducts);
  const setQ = useStore((state) => state.setQ);

  const [params, setParams] = useSearchParams();
  const cat = params.get('cat') || 'interior';

  const load = () =>
    fetch(`/api/products?category=${cat}`)
      .then((r) => r.json())
      .then(setProducts);

  React.useEffect(() => {
    if (cat !== 'contact') {
      load();
    }
  }, [cat]);

  const filtered = useMemo(() => {
    const _q = q.toLowerCase();
    return products.filter((p) => !_q || p.name.toLowerCase().includes(_q));
  }, [products, q]);

  return (
    <div>
      {/* Category Tabs */}
      <div className="bg-white/90 backdrop-blur border rounded-xl mb-5">
        <div className="grid grid-cols-4 text-center">
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
                c.icon.endsWith('.png') ||
                c.icon.endsWith('.jpg') ||
                c.icon.endsWith('.svg') ? (
                  <img
                    src={c.icon}
                    alt={c.label}
                    className="w-5 h-5 mb-1 mx-auto object-contain"
                  />
                ) : (
                  <i className={`${c.icon} text-xl mb-1 block mx-auto`}></i>
                )
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

      {cat === 'contact' ? (
        /* Contact Section */
        <div className="bg-white rounded-2xl border shadow-sm p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            Контактирајте не
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                <MdPhone className="text-2xl text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Телефон</h3>
                <a
                  href="tel:+38970123456"
                  className="text-slate-600 hover:text-red-600 transition"
                >
                  +389 70 123 456
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                <MdEmail className="text-2xl text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Е-пошта</h3>
                <a
                  href="mailto:info@variodor.mk"
                  className="text-slate-600 hover:text-red-600 transition"
                >
                  info@variodor.mk
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                <MdLocationOn className="text-2xl text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Адреса</h3>
                <a
                  href="https://maps.google.com/?q=18-ti+Noemvri+Gostivar+1230"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-red-600 transition"
                >
                  18-ti Noemvri, Gostivar 1230
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
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
                    <h3 className="text-lg font-bold text-slate-800">
                      {p.name}
                    </h3>
                    <div className="mt-2 text-slate-700 font-semibold">
                      {mkd(p.price_mkd)} ден
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
