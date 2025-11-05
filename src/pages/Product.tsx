import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import { getApiUrl } from '../config/api';

const mkd = (n: number) =>
  new Intl.NumberFormat('mk-MK', {
    style: 'currency',
    currency: 'MKD',
    maximumFractionDigits: 2,
  }).format(n);

export default function Product() {
  const { t } = useTranslation();
  const { id } = useParams();
  const nav = useNavigate();
  const currentProduct = useStore((state) => state.currentProduct);
  const setCurrentProduct = useStore((state) => state.setCurrentProduct);

  useEffect(() => {
    fetch(getApiUrl('/api/products/' + id))
      .then((r) => r.json())
      .then(setCurrentProduct);
  }, [id, setCurrentProduct]);

  if (!currentProduct) return <div>...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => nav(-1)} className="px-3 py-2 border rounded">
          ← {t('product.back')}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start bg-white rounded-3xl p-6 border">
        <img
          src={currentProduct.images[0]}
          alt={currentProduct.name}
          className="w-full h-[520px] object-contain bg-slate-50 rounded-2xl"
        />

        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            {currentProduct.name}
          </h1>
          <div className="text-2xl font-bold mt-2">
            {currentProduct.price_mkd === 0 ? t('product.priceOnRequest') : `${mkd(currentProduct.price_mkd)} ${t('product.currency')}`}
          </div>

          {currentProduct.description && (
            <p className="mt-4 text-slate-700 leading-relaxed">
              {currentProduct.description}
            </p>
          )}

          {Object.keys(currentProduct.specs || {}).length > 0 && (
            <>
              <div className="h-px bg-slate-200 my-6"></div>
              <h3 className="font-semibold text-lg mb-3">{t('product.specifications')}</h3>
              <ul className="space-y-3">
                {Object.entries(currentProduct.specs || {}).map(([k, v]) => (
                  <li key={k} className="flex gap-2">
                    <span className="font-semibold">{k}:</span>
                    <span className="text-slate-700">{v}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="h-px bg-slate-200 my-6"></div>

          <div className="flex gap-3">
            <a
              href={`https://wa.me/3890000000?text=${encodeURIComponent(
                t('product.contact') + ': ' + currentProduct.name
              )}`}
              target="_blank"
              className="px-4 py-2 rounded bg-green-600 text-white"
            >
              {t('product.contact')}
            </a>
            <a href="/" className="px-4 py-2 rounded border">
              {t('product.catalog')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
