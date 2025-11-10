import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Admin State Types
interface AdminState {
  isAuthenticated: boolean;
  token: string | null;
  items: Product[];
  form: ProductForm;
  specKey: string;
  specVal: string;
  img: string;
  filter: string;
  q: string;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setToken: (token: string | null) => void;
  setItems: (items: Product[]) => void;
  setForm: (form: ProductForm) => void;
  setSpecKey: (key: string) => void;
  setSpecVal: (val: string) => void;
  setImg: (img: string) => void;
  setFilter: (filter: string) => void;
  setQ: (q: string) => void;
  resetForm: () => void;
}

// Catalog State Types
interface CatalogState {
  products: Product[];
  q: string;
  productsCache: Record<string, Product[]>;
  setProducts: (products: Product[]) => void;
  setQ: (q: string) => void;
  cacheProducts: (category: string, products: Product[]) => void;
  getCachedProducts: (category: string) => Product[] | undefined;
}

// Product State Types
interface ProductState {
  currentProduct: Product | null;
  productDetailsCache: Record<string, Product>;
  setCurrentProduct: (product: Product | null) => void;
  cacheProductDetails: (id: string, product: Product) => void;
  getCachedProductDetails: (id: string) => Product | undefined;
}

// Language State Types
interface LanguageState {
  language: string;
  setLanguage: (language: string) => void;
}

// Product Types
interface Product {
  id: string;
  name: string;
  category: string;
  price_mkd: number;
  description: string;
  specs: Record<string, string>;
  images: string[];
}

interface ProductForm {
  id: string;
  name: string;
  category: string;
  price_mkd: number;
  description: string;
  specs: Record<string, string>;
  images: string[];
}

// Combined Store Type
type Store = AdminState & CatalogState & ProductState & LanguageState;

const emptyForm: ProductForm = {
  id: '',
  name: '',
  category: 'interior',
  price_mkd: 0,
  description: '',
  specs: {},
  images: [],
};

export const useStore = create<Store>()(
  persist<Store>(
    (set, get) => ({
      // Admin State
      isAuthenticated: false,
      token: null,
      items: [],
      form: emptyForm,
      specKey: '',
      specVal: '',
      img: '',
      filter: 'all',
      q: '',
      setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
      setToken: (token: string | null) => set({ token }),
      setItems: (items: Product[]) => set({ items }),
      setForm: (form: ProductForm) => set({ form }),
      setSpecKey: (specKey: string) => set({ specKey }),
      setSpecVal: (specVal: string) => set({ specVal }),
      setImg: (img: string) => set({ img }),
      setFilter: (filter: string) => set({ filter }),
      setQ: (q: string) => set({ q }),
      resetForm: () => set({ form: emptyForm, specKey: '', specVal: '', img: '' }),

      // Catalog State
      products: [],
      productsCache: {},
      setProducts: (products: Product[]) => set({ products }),
      cacheProducts: (category: string, products: Product[]) =>
        set((state) => ({
          productsCache: { ...state.productsCache, [category]: products },
        })),
      getCachedProducts: (category: string): Product[] | undefined => {
        return get().productsCache[category];
      },

      // Product State
      currentProduct: null,
      productDetailsCache: {},
      setCurrentProduct: (currentProduct: Product | null) => set({ currentProduct }),
      cacheProductDetails: (id: string, product: Product) =>
        set((state) => ({
          productDetailsCache: { ...state.productDetailsCache, [id]: product },
        })),
      getCachedProductDetails: (id: string): Product | undefined => {
        return get().productDetailsCache[id];
      },

      // Language State
      language: 'mk',
      setLanguage: (language: string) => set({ language }),
    }),
    {
      name: 'variador-store',
      // Only persist authentication and language, not the cache data
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        language: state.language,
      }),
    }
  )
);
