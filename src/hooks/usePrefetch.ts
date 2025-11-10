import { useEffect } from 'react';
import { useStore } from '../store';
import { getApiUrl } from '../config/api';

export const usePrefetch = () => {
  const cacheProducts = useStore((state) => state.cacheProducts);
  const getCachedProducts = useStore((state) => state.getCachedProducts);
  const cacheProductDetails = useStore((state) => state.cacheProductDetails);
  const getCachedProductDetails = useStore((state) => state.getCachedProductDetails);

  useEffect(() => {
    const prefetchAll = async () => {
      const categories = ['interior', 'exterior', 'windows'];

      for (const category of categories) {
        // Skip if already cached
        if (getCachedProducts(category)) continue;

        try {
          const response = await fetch(
            getApiUrl(`/api/products?category=${category}`)
          );
          const data = await response.json();
          cacheProducts(category, data);

          // Preload all product images and cache product details
          data.forEach((product: any) => {
            // Cache individual product details
            if (product.id && !getCachedProductDetails(product.id)) {
              cacheProductDetails(product.id, product);
            }

            // Preload images
            if (product.images && product.images.length > 0) {
              product.images.forEach((imgUrl: string) => {
                const img = new Image();
                img.src = imgUrl;
              });
            }
          });
        } catch (error) {
          console.error(`Failed to prefetch ${category}:`, error);
        }
      }
    };

    // Start prefetching after a small delay
    const timer = setTimeout(prefetchAll, 1000);
    return () => clearTimeout(timer);
  }, []);
};
