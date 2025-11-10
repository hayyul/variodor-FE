import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MdShield,
  MdConstruction,
  MdVerifiedUser,
  MdDoorSliding,
} from 'react-icons/md';

export default function Home() {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const heroSlides = [
    {
      image: 'https://app.yildiz.com/products_render/LUXURY_Modernantrasit.jpg',
      category: 'interior',
    },
    {
      image:
        'https://www.premierwindows.uk.com/wp-content/uploads/2021/03/Anthracite-door-with-side-panels-1.jpg',
      category: 'exterior',
    },
    {
      image:
        'https://i.pinimg.com/1200x/cd/6b/f5/cd6bf58bfe1511b3b72d9d03e864c1bf.jpg',
      category: 'windows',
    },
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSlideClick = (index: any) => {
    setCurrentSlide(index);
  };

  const productModels = [
    {
      title: t('catalog.categories.interior'),
      description: t('home.products.interiorDesc'),
      category: 'interior',
      gradient: 'from-amber-700 to-amber-900',
      icon: 'fa-door-closed',
      image: 'https://app.yildiz.com/products_render/LUXURY_Modernantrasit.jpg',
    },
    {
      title: t('catalog.categories.exterior'),
      description: t('home.products.exteriorDesc'),
      category: 'exterior',
      gradient: 'from-slate-600 to-slate-800',
      icon: 'fa-door-open',
      image:
        'https://www.premierwindows.uk.com/wp-content/uploads/2021/03/Anthracite-door-with-side-panels-1.jpg',
    },
    {
      title: t('catalog.categories.windows'),
      description: t('home.products.windowsDesc'),
      category: 'windows',
      gradient: 'from-sky-400 to-sky-600',
      icon: 'fa-window-maximize',
      image:
        'https://i.pinimg.com/1200x/cd/6b/f5/cd6bf58bfe1511b3b72d9d03e864c1bf.jpg',
    },
  ];

  const features = [
    {
      icon: MdShield,
      title: t('home.features.moneyback'),
      description: t('home.features.moneybackDesc'),
    },
    {
      icon: MdConstruction,
      title: t('home.features.installation'),
      description: t('home.features.installationDesc'),
    },
    {
      icon: MdVerifiedUser,
      title: t('home.features.scratchResistant'),
      description: t('home.features.scratchResistantDesc'),
    },
    {
      icon: MdDoorSliding,
      title: t('home.features.softClose'),
      description: t('home.features.softCloseDesc'),
    },
  ];

  const materials = [
    { name: 'Wood', color: '#8B4513' },
    { name: 'Metal', color: '#708090' },
    { name: 'Glass', color: '#B0E0E6' },
    { name: 'PVC', color: '#2F4F4F' },
    { name: 'Steel', color: '#4682B4' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Link
        to={`/catalog?cat=${heroSlides[currentSlide].category}`}
        className="relative h-[500px] flex items-center justify-center overflow-hidden cursor-pointer group block"
      >
        {/* Background Images */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
        ))}

        {/* Content */}
        <div className="relative text-center z-10 px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
            {t('home.hero.title')}
          </h1>
          <p className="text-lg md:text-xl text-white mb-8 drop-shadow-md">
            Премиум врати и прозорци за вашиот дом
          </p>
          <span className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-full transition-colors shadow-lg">
            {t('home.hero.button')}
          </span>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                handleSlideClick(index);
              }}
              className={`h-2 rounded-full transition-all cursor-pointer hover:bg-white ${
                index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </Link>

      {/* Our Product Models Section */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">
            {t('home.products.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {productModels.map((product, index) => (
              <Link
                key={index}
                to={`/catalog?cat=${product.category}`}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow group"
              >
                {product.image ? (
                  <div className="h-64 bg-slate-50 flex items-center justify-center overflow-hidden relative">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div
                    className={`h-64 bg-gradient-to-br ${product.gradient} flex items-center justify-center overflow-hidden relative`}
                  >
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                    <div className="text-white text-7xl opacity-30">
                      <i className={`fas ${product.icon}`}></i>
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {product.title}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    {product.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">
            {t('home.features.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                    <feature.icon className="text-3xl text-slate-700" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Material Showcase Section */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">
            {t('home.materials.title')}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {materials.map((material, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow aspect-square"
              >
                <div
                  className="h-full w-full flex items-center justify-center relative"
                  style={{ backgroundColor: material.color }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-black/20"></div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-center py-3 font-semibold">
                    {material.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
