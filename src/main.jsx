import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Catalog from './pages/Catalog.jsx';
import Product from './pages/Product.jsx';
import Admin from './pages/Admin.jsx';

function Layout() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-[74px] h-[74px] flex items-center justify-center">
                <img
                  src="/logos/vario-logo.png"
                  alt="Variodor Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <footer className="border-t py-8 text-sm text-slate-600">
        <div className="mx-auto max-w-6xl px-4">
          © {new Date().getFullYear()} Variodor
        </div>
      </footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Layout />
  </BrowserRouter>
);
