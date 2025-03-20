import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discountedPrice = product.price - (product.price * product.discountPercentage / 100);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <div className="relative h-48 w-full">
        {product.thumbnail ? (
          <Image 
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="bg-gray-200 dark:bg-gray-700 h-full w-full flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}

        
        
        {product.availabilityStatus === 'Low Stock' && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Low Stock
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
            {product.title}
          </h3>
          <div className="flex items-center bg-blue-50 dark:bg-blue-900 px-2 py-1 rounded">
            <span className="text-blue-600 dark:text-blue-300 text-sm font-medium">{product.rating.toFixed(1)}</span>
            <svg className="w-4 h-4 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center mt-2">
          <span className="text-gray-500 dark:text-gray-400 text-xs">{product.brand}</span>
          {product.tags && product.tags.length > 0 && (
            <span className="mx-1 text-gray-500 dark:text-gray-400">•</span>
          )}
          <div className="flex gap-1">
            {product.tags && product.tags.slice(0, 2).map((tag, index) => (
              <span key={index} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <span className="text-lg font-bold text-gray-900 dark:text-white">${discountedPrice.toFixed(2)}</span>
            {product.discountPercentage > 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through ml-2">${product.price}</span>
            )}
          </div>
          
          <Link href={`/product/${product.id}`} className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
} 