'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import { Product, Review } from '../../types/product';
import { fetchProductById } from '../../utils/api';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        // Convert id to number
        const productId = typeof id === 'string' ? parseInt(id, 10) : 
                          Array.isArray(id) ? parseInt(id[0], 10) : 1;
        const data = await fetchProductById(productId);
        setProduct(data);
        setSelectedImage(data.thumbnail);
        setError(null);
      } catch (err) {
        setError('Failed to load product details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  // Function to get star rating component
  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="w-full flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="w-full max-w-6xl mx-auto px-4 py-12">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg p-4 my-6">
            <p className="text-red-600 dark:text-red-400">{error || 'Product not found'}</p>
            <Link
              href="/"
              className="mt-2 inline-block text-sm text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const discountedPrice = product.price - (product.price * product.discountPercentage) / 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-4">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative h-80 md:h-96 w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              {selectedImage ? (
                <Image 
                  src={selectedImage} 
                  alt={product.title} 
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="bg-gray-200 dark:bg-gray-700 h-full w-full flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {product.images && product.images.slice(0, 5).map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleImageClick(image)}
                  className={`relative h-16 w-16 flex-shrink-0 border-2 rounded ${
                    selectedImage === image 
                      ? 'border-blue-500 dark:border-blue-400' 
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <Image 
                    src={image} 
                    alt={`${product.title} thumbnail ${index}`} 
                    fill
                    className="object-cover rounded"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{product.title}</h1>
              
              <div className="mt-2 flex items-center">
                <div className="flex items-center">
                  <StarRating rating={product.rating} />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{product.rating.toFixed(1)} ({product.reviews?.length || 0} reviews)</span>
                </div>
                <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">Brand: {product.brand}</span>
                <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">SKU: {product.sku}</span>
              </div>
            </div>

            <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">${discountedPrice.toFixed(2)}</span>
                {product.discountPercentage > 0 && (
                  <>
                    <span className="text-lg text-gray-500 dark:text-gray-400 line-through ml-2">${product.price.toFixed(2)}</span>
                    <span className="ml-2 px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
                      Save {product.discountPercentage.toFixed(0)}%
                    </span>
                  </>
                )}
              </div>
              
              <div className="mt-2 flex items-center space-x-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  product.stock > 10 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                    : product.stock > 0 
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {product.stock > 10 
                    ? 'In Stock' 
                    : product.stock > 0 
                      ? `Low Stock (${product.stock} left)` 
                      : 'Out of Stock'
                  }
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{product.shippingInformation}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-gray-700 dark:text-gray-300 mr-3">Quantity:</span>
                  <div className="flex border border-gray-300 dark:border-gray-700 rounded-md">
                    <button className="px-3 py-1 border-r border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400">-</button>
                    <input 
                      type="number" 
                      min="1" 
                      max={product.stock} 
                      defaultValue="1" 
                      className="w-12 text-center border-none bg-transparent text-gray-900 dark:text-white focus:outline-none" 
                    />
                    <button className="px-3 py-1 border-l border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400">+</button>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Min. Order: {product.minimumOrderQuantity} unit(s)
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors">
                  Add to Cart
                </button>
                <button className="flex items-center justify-center p-3 rounded-md border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{product.returnPolicy}</span>
              </div>
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
                </svg>
                <span>{product.warrantyInformation}</span>
              </div>
            </div>

            <div className="pt-4">
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`py-2 px-4 ${
                    activeTab === 'description'
                      ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400 font-medium'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`py-2 px-4 ${
                    activeTab === 'specs'
                      ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400 font-medium'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`py-2 px-4 ${
                    activeTab === 'reviews'
                      ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400 font-medium'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Reviews ({product.reviews?.length || 0})
                </button>
              </div>

              <div className="py-4">
                {activeTab === 'description' && (
                  <div className="prose prose-blue max-w-none dark:prose-invert">
                    <p>{product.description}</p>
                  </div>
                )}
                
                {activeTab === 'specs' && (
                  <div className="space-y-4">
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                      <div className="sm:col-span-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded">
                        <dt className="text-sm font-medium text-gray-700 dark:text-gray-300">Product Dimensions</dt>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-600 dark:text-gray-400">Width</dt>
                        <dd className="text-sm font-medium text-gray-900 dark:text-white">{product.dimensions.width} cm</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-600 dark:text-gray-400">Height</dt>
                        <dd className="text-sm font-medium text-gray-900 dark:text-white">{product.dimensions.height} cm</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-600 dark:text-gray-400">Depth</dt>
                        <dd className="text-sm font-medium text-gray-900 dark:text-white">{product.dimensions.depth} cm</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-600 dark:text-gray-400">Weight</dt>
                        <dd className="text-sm font-medium text-gray-900 dark:text-white">{product.weight} kg</dd>
                      </div>
                      
                      <div className="sm:col-span-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded mt-4">
                        <dt className="text-sm font-medium text-gray-700 dark:text-gray-300">Product Details</dt>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-600 dark:text-gray-400">Brand</dt>
                        <dd className="text-sm font-medium text-gray-900 dark:text-white">{product.brand}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-600 dark:text-gray-400">Category</dt>
                        <dd className="text-sm font-medium text-gray-900 dark:text-white">{product.category}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-600 dark:text-gray-400">SKU</dt>
                        <dd className="text-sm font-medium text-gray-900 dark:text-white">{product.sku}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-600 dark:text-gray-400">Barcode</dt>
                        <dd className="text-sm font-medium text-gray-900 dark:text-white">{product.meta.barcode}</dd>
                      </div>
                    </dl>
                  </div>
                )}
                
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {product.reviews && product.reviews.length > 0 ? (
                      product.reviews.map((review: Review, index: number) => (
                        <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                          <div className="flex justify-between">
                            <div>
                              <div className="flex items-center">
                                <StarRating rating={review.rating} />
                                <h4 className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">{review.reviewerName}</h4>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {new Date(review.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                review.rating >= 4 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                                  : review.rating >= 3 
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' 
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                              }`}>
                                {review.rating >= 4 
                                  ? 'Positive' 
                                  : review.rating >= 3 
                                    ? 'Neutral' 
                                    : 'Negative'
                                }
                              </span>
                            </div>
                          </div>
                          <p className="mt-3 text-gray-800 dark:text-gray-200">{review.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400">No reviews yet.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 