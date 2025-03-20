import { useEffect, useState } from 'react';
import { Product } from '../types/product';
import { fetchProducts } from '../utils/api';
import ProductCard from './ProductCard';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const limit = 12;

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const skip = (currentPage - 1) * limit;
        const data = await fetchProducts(limit, skip);
        setProducts(data.products);
        setTotalProducts(data.total);
        setError(null);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [currentPage]);

  const totalPages = Math.ceil(totalProducts / limit);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (loading && products.length === 0) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg p-4 my-6">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button 
            onClick={() => setCurrentPage(1)}
            className="mt-2 text-sm text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Loading indicator for page changes */}
      {loading && products.length > 0 && (
        <div className="w-full flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center py-6">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Showing {(currentPage - 1) * limit + 1} - {Math.min(currentPage * limit, totalProducts)} of {totalProducts} products
        </span>
        
        <div className="flex gap-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
} 