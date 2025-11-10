import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import { getApiUrl } from '../config/api';

interface LoginScreenProps {
  onLogin: (token: string) => void;
}

function LoginScreen({ onLogin }: LoginScreenProps) {
  const { t } = useTranslation();
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('Login successful, storing token:', data.token);
        localStorage.setItem('adminToken', data.token);
        onLogin(data.token);
        setError('');
      } else {
        console.log('Login failed:', data.message);
        setError(data.message || t('admin.login.error.invalid'));
      }
    } catch (err) {
      setError(t('admin.login.error.network'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {t('admin.login.title')}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('admin.login.password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
              placeholder={t('admin.login.placeholder')}
              required
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-2 px-4 rounded-md hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('admin.login.loading') : t('admin.login.button')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Admin() {
  const { t } = useTranslation();
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const token = useStore((state) => state.token);
  const items = useStore((state) => state.items);
  const form = useStore((state) => state.form);
  const specKey = useStore((state) => state.specKey);
  const specVal = useStore((state) => state.specVal);
  const img = useStore((state) => state.img);
  const filter = useStore((state) => state.filter);
  const q = useStore((state) => state.q);

  const setIsAuthenticated = useStore((state) => state.setIsAuthenticated);
  const setToken = useStore((state) => state.setToken);
  const setItems = useStore((state) => state.setItems);
  const setForm = useStore((state) => state.setForm);
  const setSpecKey = useStore((state) => state.setSpecKey);
  const setSpecVal = useStore((state) => state.setSpecVal);
  const setImg = useStore((state) => state.setImg);
  const setFilter = useStore((state) => state.setFilter);
  const setQ = useStore((state) => state.setQ);
  const resetForm = useStore((state) => state.resetForm);

  // Helper function to make authenticated API calls
  const apiCall = async (url: string, options: RequestInit = {}) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return fetch(getApiUrl(url), {
      ...options,
      headers: {
        ...headers,
        ...(options.headers as Record<string, string>),
      },
    });
  };

  const load = async () => {
    try {
      const response = await apiCall('/api/products');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else if (response.status === 401) {
        // Token expired or invalid
        handleLogout();
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      load();
    }
  }, [isAuthenticated]);

  // Check if user is already authenticated with valid token
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('adminToken');
      if (storedToken) {
        try {
          const response = await fetch(getApiUrl('/api/auth/verify'), {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          const data = await response.json();

          if (data.success && data.valid) {
            console.log('Token is valid, setting authenticated state');
            setToken(storedToken);
            setIsAuthenticated(true);
          } else {
            console.log('Token is invalid, removing from storage');
            // Token is invalid, remove it
            localStorage.removeItem('adminToken');
          }
        } catch (error) {
          // Network error or invalid token
          localStorage.removeItem('adminToken');
        }
      }
    };

    checkAuth();
  }, []); // Empty dependency array is correct here

  const handleLogin = (newToken: string) => {
    console.log('handleLogin called with token:', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
    console.log('Authentication state set to true');
  };

  const handleLogout = async () => {
    try {
      if (token) {
        await apiCall('/api/auth/logout', { method: 'POST' });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem('adminToken');
    }
  };

  const save = async () => {
    if (!form.id) return alert('ID is required (e.g., int-model-001)');

    try {
      const response = await apiCall('/api/products', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      if (response.ok) {
        resetForm();
        load();
      } else if (response.status === 401) {
        handleLogout();
      } else {
        alert('Error saving product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product');
    }
  };

  const edit = (p: typeof form) => setForm(JSON.parse(JSON.stringify(p)));

  const del = async (id: string) => {
    if (confirm('Delete?')) {
      try {
        const response = await apiCall(`/api/products/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          load();
        } else if (response.status === 401) {
          handleLogout();
        } else {
          alert('Error deleting product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  };

  const filtered = useMemo(() => {
    return items.filter(
      (i) =>
        (filter === 'all' || i.category === filter) &&
        (!q || i.name.toLowerCase().includes(q.toLowerCase()))
    );
  }, [items, filter, q]);

  console.log('Current auth state:', {
    isAuthenticated,
    token: token ? 'present' : 'missing',
  });

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('admin.panel.title')}</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          {t('admin.panel.logout')}
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-xl font-bold mb-3">
            {t('admin.panel.products')}
          </h2>
          <div className="flex gap-2 mb-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border px-3 py-2 rounded"
            >
              <option value="all">{t('admin.filters.all')}</option>
              <option value="interior">{t('admin.categories.interior')}</option>
              <option value="exterior">{t('admin.categories.exterior')}</option>
              <option value="windows">{t('admin.categories.windows')}</option>
            </select>
          </div>
          <div className="overflow-auto border rounded">
            <table className="w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="text-left p-2">{t('admin.table.id')}</th>
                  <th className="text-left p-2">{t('admin.table.name')}</th>
                  <th className="p-2">{t('admin.table.category')}</th>
                  <th className="p-2">{t('admin.table.price')}</th>
                  <th className="p-2">{t('admin.table.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-2">{p.id}</td>
                    <td className="p-2">{p.name}</td>
                    <td className="p-2 text-center">{p.category}</td>
                    <td className="p-2 text-right">{p.price_mkd}</td>
                    <td className="p-2 text-center">
                      <button
                        className="px-2 py-1 border rounded mr-2"
                        onClick={() => edit(p)}
                      >
                        {t('admin.table.edit')}
                      </button>
                      <button
                        className="px-2 py-1 border rounded"
                        onClick={() => del(p.id)}
                      >
                        {t('admin.table.delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">
            {form.id ? t('admin.panel.edit') : t('admin.panel.create')}{' '}
            {t('admin.panel.products')}
          </h2>
          <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded border">
            <label className="col-span-2">
              {t('admin.form.id')}
              <input
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
            </label>
            <label className="col-span-2">
              {t('admin.form.name')}
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
            </label>
            <label>
              {t('admin.form.category')}
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="interior">
                  {t('admin.categories.interior')}
                </option>
                <option value="exterior">
                  {t('admin.categories.exterior')}
                </option>
                <option value="windows">{t('admin.categories.windows')}</option>
              </select>
            </label>
            <label>
              {t('admin.form.price')}
              <input
                value={form.price_mkd}
                onChange={(e) =>
                  setForm({ ...form, price_mkd: Number(e.target.value) })
                }
                className="w-full border px-3 py-2 rounded"
              />
            </label>
            <label className="col-span-2">
              {t('admin.form.description')}
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
            </label>

            <div className="col-span-2 border rounded p-3">
              <div className="font-semibold mb-2">{t('admin.form.specs')}</div>
              <div className="flex gap-2 mb-2">
                <input
                  placeholder={t('admin.form.keyPlaceholder')}
                  value={specKey}
                  onChange={(e) => setSpecKey(e.target.value)}
                  className="border px-2 py-1 rounded"
                />
                <input
                  placeholder={t('admin.form.valuePlaceholder')}
                  value={specVal}
                  onChange={(e) => setSpecVal(e.target.value)}
                  className="border px-2 py-1 rounded"
                />
                <button
                  className="px-3 py-1 border rounded"
                  onClick={() => {
                    if (specKey) {
                      const s = { ...(form.specs || {}) };
                      s[specKey] = specVal;
                      setForm({ ...form, specs: s });
                      setSpecKey('');
                      setSpecVal('');
                    }
                  }}
                >
                  {t('admin.form.add')}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(form.specs || {}).map(([k, v]) => (
                  <div key={k} className="text-sm">
                    <span className="text-slate-500">{k}:</span> {v}
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-2 border rounded p-3">
              <div className="font-semibold mb-2">{t('admin.form.images')}</div>

              {/* URL Input */}
              <div className="flex gap-2 mb-2">
                <input
                  placeholder={t('admin.form.urlPlaceholder')}
                  value={img}
                  onChange={(e) => setImg(e.target.value)}
                  className="border px-2 py-1 rounded w-full"
                />
                <button
                  className="px-3 py-1 border rounded hover:bg-slate-50"
                  onClick={() => {
                    if (img) {
                      const imgs = [...(form.images || [])];
                      imgs.push(img);
                      setForm({ ...form, images: imgs });
                      setImg('');
                    }
                  }}
                >
                  {t('admin.form.addUrl')}
                </button>
              </div>

              {/* File Upload */}
              <div className="flex gap-2 mb-2">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    files.forEach((file) => {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const imgs = [...(form.images || [])];
                        imgs.push(reader.result as string);
                        setForm({ ...form, images: imgs });
                      };
                      reader.readAsDataURL(file);
                    });
                    e.target.value = ''; // Reset input
                  }}
                  className="border px-2 py-1 rounded w-full"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                {(form.images || []).map((u, i) => (
                  <div key={i} className="relative">
                    <img src={u} className="h-16 w-20 object-cover rounded" />
                    <button
                      onClick={() => {
                        const imgs = [...(form.images || [])];
                        imgs.splice(i, 1);
                        setForm({ ...form, images: imgs });
                      }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-2 flex gap-2">
              <button
                className="px-4 py-2 rounded bg-slate-900 text-white"
                onClick={save}
              >
                {t('admin.form.save')}
              </button>
              <button
                className="px-4 py-2 rounded border"
                onClick={() => resetForm()}
              >
                {t('admin.form.clear')}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
