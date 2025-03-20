'use client';

import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-grow">
        <section className="bg-blue-600 dark:bg-blue-800 py-16">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Discover Amazing Products
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Browse our extensive collection of high-quality products at competitive prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 hover:bg-blue-50 font-medium py-3 px-6 rounded-md transition-colors">
                Shop Now
              </button>
              <button className="bg-transparent border-2 border-white text-white hover:bg-blue-700 font-medium py-3 px-6 rounded-md transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </section>
        
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Featured Products
              </h2>
              <div className="hidden md:flex gap-3">
                <button className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 rounded-md transition-colors">
                  Newest
                </button>
                <button className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 rounded-md transition-colors">
                  Popular
                </button>
                <button className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 rounded-md transition-colors">
                  Best Deals
                </button>
              </div>
            </div>
            
            <ProductList />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
