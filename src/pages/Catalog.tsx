import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MdSearch,
  MdPhone,
  MdEmail,
  MdLocationOn,
  MdContactMail,
} from 'react-icons/md';
import { useStore } from '../store';
import { getApiUrl } from '../config/api';

const mkd = (n: number) =>
  new Intl.NumberFormat('mk-MK', {
    style: 'currency',
    currency: 'MKD',
    maximumFractionDigits: 2,
  }).format(n);

const getCats = (t: any) => [
  {
    key: 'interior',
    label: t('catalog.categories.interior'),
    icon: 'fa-solid fa-door-closed',
  },
  {
    key: 'exterior',
    label: t('catalog.categories.exterior'),
    icon: 'fas fa-door-open',
  },
  {
    key: 'windows',
    label: t('catalog.categories.windows'),
    icon: '/logos/window.png',
  },
  {
    key: 'contact',
    label: t('catalog.categories.contact'),
    icon: MdContactMail,
  },
];

export default function Catalog() {
  const { t } = useTranslation();
  const products = useStore((state) => state.products);
  const q = useStore((state) => state.q);
  const setProducts = useStore((state) => state.setProducts);
  const setQ = useStore((state) => state.setQ);

  const [params, setParams] = useSearchParams();
  const cat = params.get('cat') || 'interior';
  const CATS = getCats(t);

  const load = () =>
    fetch(getApiUrl(`/api/products?category=${cat}`))
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
      {cat === 'contact' ? (
        /* Contact Section */
        <div className="bg-white rounded-2xl border shadow-sm p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            {t('catalog.contact.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                <MdPhone className="text-2xl text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  {t('catalog.contact.phone')}
                </h3>
                <a
                  href="tel:+38978346253"
                  className="text-slate-600 hover:text-red-600 transition"
                >
                  +389 78 346 253
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                <MdEmail className="text-2xl text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  {t('catalog.contact.email')}
                </h3>
                <a
                  href="mailto:demirel1972@yahoo.com"
                  className="text-slate-600 hover:text-red-600 transition"
                >
                  demirel1972@yahoo.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                <MdLocationOn className="text-2xl text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  {t('catalog.contact.address')}
                </h3>
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
          {filtered.length === 0 ? (
            <div className="text-slate-600">{t('catalog.noProducts')}</div>
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
                      {p.price_mkd === 0
                        ? t('product.priceOnRequest')
                        : `${mkd(p.price_mkd)} ${t('product.currency')}`}
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
