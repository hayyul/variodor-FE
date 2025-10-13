import React, { useEffect, useMemo, useState } from 'react';

const empty = {
  id: '',
  name: '',
  category: 'interior',
  price_mkd: 0,
  description: '',
  specs: {},
  images: [],
};

// Authentication state
const ADMIN_PASSWORD = 'admin123'; // This will be sent to backend

function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
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
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="Enter admin password"
              required
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-2 px-4 rounded-md hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [specKey, setSpecKey] = useState('');
  const [specVal, setSpecVal] = useState('');
  const [img, setImg] = useState('');
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');

  // Helper function to make authenticated API calls
  const apiCall = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return fetch(url, {
      ...options,
      headers,
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
          const response = await fetch('/api/auth/verify', {
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

  const handleLogin = (newToken) => {
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
        setForm(empty);
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

  const edit = (p) => setForm(JSON.parse(JSON.stringify(p)));

  const del = async (id) => {
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
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-xl font-bold mb-3">Products</h2>
          <div className="flex gap-2 mb-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border px-3 py-2 rounded"
            >
              <option value="all">All</option>
              <option value="interior">Interior</option>
              <option value="exterior">Exterior</option>
              <option value="windows">Windows</option>
            </select>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
              className="border px-3 py-2 rounded ml-auto"
            />
          </div>
          <div className="overflow-auto border rounded">
            <table className="w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">Name</th>
                  <th className="p-2">Cat</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Actions</th>
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
                        Edit
                      </button>
                      <button
                        className="px-2 py-1 border rounded"
                        onClick={() => del(p.id)}
                      >
                        Delete
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
            {form.id ? 'Edit' : 'Create'} Product
          </h2>
          <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded border">
            <label className="col-span-2">
              ID
              <input
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
            </label>
            <label className="col-span-2">
              Name
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
            </label>
            <label>
              Category
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="interior">Interior</option>
                <option value="exterior">Exterior</option>
                <option value="windows">Windows</option>
              </select>
            </label>
            <label>
              Price (MKD)
              <input
                value={form.price_mkd}
                onChange={(e) =>
                  setForm({ ...form, price_mkd: Number(e.target.value) })
                }
                className="w-full border px-3 py-2 rounded"
              />
            </label>
            <label className="col-span-2">
              Description
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
            </label>

            <div className="col-span-2 border rounded p-3">
              <div className="font-semibold mb-2">Specs</div>
              <div className="flex gap-2 mb-2">
                <input
                  placeholder="Key"
                  value={specKey}
                  onChange={(e) => setSpecKey(e.target.value)}
                  className="border px-2 py-1 rounded"
                />
                <input
                  placeholder="Value"
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
                  Add
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
              <div className="font-semibold mb-2">Images</div>

              {/* URL Input */}
              <div className="flex gap-2 mb-2">
                <input
                  placeholder="https://..."
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
                  Add URL
                </button>
              </div>

              {/* File Upload */}
              <div className="flex gap-2 mb-2">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    files.forEach((file) => {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const imgs = [...(form.images || [])];
                        imgs.push(reader.result);
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
                Save
              </button>
              <button
                className="px-4 py-2 rounded border"
                onClick={() => setForm(empty)}
              >
                Clear
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
