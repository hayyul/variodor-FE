import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, NavLink, useLocation, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './i18n';
import Home from './pages/Home.tsx';
import Catalog from './pages/Catalog.tsx';
import Product from './pages/Product.tsx';
import Admin from './pages/Admin.tsx';
import LanguageSelector from './components/LanguageSelector.tsx';
import { usePrefetch } from './hooks/usePrefetch.ts';

function Layout() {
  const { t } = useTranslation();
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const [isScrolled, setIsScrolled] = React.useState(false);

  const cat = params.get('cat') || 'interior';
  const isHomePage = location.pathname === '/';
  const isCatalogPage = location.pathname === '/catalog';
  const showCategoryNav = (isHomePage || (isCatalogPage && cat !== 'contact'));
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Global prefetching
  usePrefetch();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { key: 'interior', label: t('catalog.categories.interior'), icon: 'fa-door-closed' },
    { key: 'exterior', label: t('catalog.categories.exterior'), icon: 'fa-door-open' },
    { key: 'windows', label: t('catalog.categories.windows'), icon: '/logos/window.png' },
  ];

  const handleCategoryClick = (key) => {
    if (isHomePage) {
      // If on homepage, navigate to catalog with category
      window.location.href = `/catalog?cat=${key}`;
    } else {
      // If on catalog, just change the category
      setParams({ cat: key });
    }
  };

  return (
    <div className="min-h-screen">
      <header className={`sticky top-0 z-20 bg-white/90 backdrop-blur border-b transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between gap-4">
            <NavLink to="/" className="flex items-center gap-3">
              <div className={`transition-all duration-300 flex items-center justify-center ${isScrolled ? 'w-12 h-12' : 'w-[74px] h-[74px]'}`}>
                <img
                  src="/logos/vario-logo.png"
                  alt="Variodor Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </NavLink>

            <div className="flex items-center gap-4">
              {/* Category Navigation - Desktop */}
              {showCategoryNav && (
                <nav className="hidden md:flex gap-1">
                  {categories.map((c) => (
                    <button
                      key={c.key}
                      onClick={() => handleCategoryClick(c.key)}
                      className={`transition-all duration-300 rounded-full font-medium ${
                        isScrolled
                          ? 'px-3 py-1.5 text-xs'
                          : 'px-5 py-2.5 text-sm'
                      } ${
                        isCatalogPage && cat === c.key
                          ? 'bg-red-600 text-white shadow-md'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </nav>
              )}

              {/* Mobile Menu Button */}
              {showCategoryNav && (
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
                  aria-label="Menu"
                >
                  <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {showCategoryNav && mobileMenuOpen && (
            <div className="md:hidden border-t mt-2 pt-2 pb-2">
              <nav className="flex flex-col gap-2">
                {categories.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => {
                      handleCategoryClick(c.key);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium text-left ${
                      isCatalogPage && cat === c.key
                        ? 'bg-red-600 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={
            <div className="mx-auto max-w-6xl px-4 py-6">
              <Catalog />
            </div>
          } />
          <Route path="/product/:id" element={
            <div className="mx-auto max-w-6xl px-4 py-6">
              <Product />
            </div>
          } />
          <Route path="/admin" element={
            <div className="mx-auto max-w-6xl px-4 py-6">
              <Admin />
            </div>
          } />
        </Routes>
      </main>
      <footer className="border-t py-12 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* About Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="/logos/vario-logo.png"
                  alt="Variodor"
                  className="w-10 h-10 object-contain"
                />
                <span className="font-bold text-slate-900">Variodor</span>
              </div>
              <p className="text-sm text-slate-600">
                Premium doors and windows for your home
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <NavLink to="/" className="text-slate-600 hover:text-red-600 transition">
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/catalog" className="text-slate-600 hover:text-red-600 transition">
                    Products
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/catalog?cat=contact" className="text-slate-600 hover:text-red-600 transition">
                    Contact
                  </NavLink>
                </li>
              </ul>
            </div>

            {/* Follow Us */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Follow Us</h3>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-8 h-8 bg-slate-200 hover:bg-red-600 hover:text-white rounded-full flex items-center justify-center transition"
                  aria-label="Facebook"
                >
                  <i className="fab fa-facebook-f text-sm"></i>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-slate-200 hover:bg-red-600 hover:text-white rounded-full flex items-center justify-center transition"
                  aria-label="Instagram"
                >
                  <i className="fab fa-instagram text-sm"></i>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-slate-200 hover:bg-red-600 hover:text-white rounded-full flex items-center justify-center transition"
                  aria-label="LinkedIn"
                >
                  <i className="fab fa-linkedin-in text-sm"></i>
                </a>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Contact</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <a href="tel:+38978346253" className="hover:text-red-600 transition">
                    +389 78 346 253
                  </a>
                </li>
                <li>
                  <a href="mailto:demirel1972@yahoo.com" className="hover:text-red-600 transition">
                    demirel1972@yahoo.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t pt-6 text-center text-sm text-slate-600">
            © {new Date().getFullYear()} Variodor. All rights reserved.
          </div>
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
