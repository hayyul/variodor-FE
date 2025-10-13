import { expect } from 'vitest';
import { useStore } from '@/store';

export const testStoreCreation = () => {
  const store = useStore.getState();
  expect(store).toBeDefined();
  expect(typeof store.setIsAuthenticated).toBe('function');
  expect(typeof store.setToken).toBe('function');
  expect(typeof store.setLanguage).toBe('function');
};

export const testAdminStoreSlice = () => {
  const store = useStore.getState();

  // Initial state
  expect(store.isAuthenticated).toBe(false);
  expect(store.token).toBe(null);

  // Set authentication
  store.setIsAuthenticated(true);
  store.setToken('test-token');

  const updatedState = useStore.getState();
  expect(updatedState.isAuthenticated).toBe(true);
  expect(updatedState.token).toBe('test-token');

  // Cleanup
  store.setIsAuthenticated(false);
  store.setToken(null);
};

export const testAdminProductsSlice = () => {
  const store = useStore.getState();

  const testProducts = [
    {
      id: 'test-1',
      name: 'Test Product',
      category: 'interior',
      price_mkd: 1000,
      description: 'Test',
      specs: {},
      images: [],
    },
  ];

  store.setItems(testProducts);

  const updatedState = useStore.getState();
  expect(updatedState.items).toEqual(testProducts);
  expect(updatedState.items.length).toBe(1);

  // Cleanup
  store.setItems([]);
};

export const testCatalogStoreSlice = () => {
  const store = useStore.getState();

  // Initial filter and search
  expect(store.filter).toBe('all');
  expect(store.q).toBe('');

  // Update filter
  store.setFilter('interior');
  store.setQ('test search');

  const updatedState = useStore.getState();
  expect(updatedState.filter).toBe('interior');
  expect(updatedState.q).toBe('test search');

  // Cleanup
  store.setFilter('all');
  store.setQ('');
};

export const testProductStoreSlice = () => {
  const store = useStore.getState();

  const testProduct = {
    id: 'test-1',
    name: 'Test Product',
    category: 'interior',
    price_mkd: 1000,
    description: 'Test',
    specs: { material: 'wood' },
    images: ['test.jpg'],
  };

  store.setCurrentProduct(testProduct);

  const updatedState = useStore.getState();
  expect(updatedState.currentProduct).toEqual(testProduct);

  // Cleanup
  store.setCurrentProduct(null);
};

export const testLanguageStoreSlice = () => {
  const store = useStore.getState();

  // Initial language should be Macedonian
  expect(store.language).toBe('mk');

  // Switch to Albanian
  store.setLanguage('sq');

  const updatedState = useStore.getState();
  expect(updatedState.language).toBe('sq');

  // Switch back to Macedonian
  store.setLanguage('mk');

  const finalState = useStore.getState();
  expect(finalState.language).toBe('mk');
};

export const testStoreErrorHandling = () => {
  const store = useStore.getState();

  // Test setting invalid values doesn't break store
  store.setFilter('invalid-filter');
  expect(useStore.getState().filter).toBe('invalid-filter');

  // Test null values
  store.setToken(null);
  expect(useStore.getState().token).toBe(null);

  // Cleanup
  store.setFilter('all');
};

export const testStorePersistence = () => {
  const store = useStore.getState();

  // Set persisted values
  store.setToken('persist-test');
  store.setIsAuthenticated(true);
  store.setLanguage('sq');

  // Verify they're in the state
  const state = useStore.getState();
  expect(state.token).toBe('persist-test');
  expect(state.isAuthenticated).toBe(true);
  expect(state.language).toBe('sq');

  // Cleanup
  store.setToken(null);
  store.setIsAuthenticated(false);
  store.setLanguage('mk');
};
