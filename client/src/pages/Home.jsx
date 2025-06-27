import React, { useEffect, useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Filter, Grid, List, ShoppingBag, Sparkles, Heart, Star, Truck, ArrowRight, Menu, User, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/api/api';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product, onAddToCart }) => (
  <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
    <Link to={`/product/${product._id}`} className="block">
      <div className="relative">
        <img 
          src={product.imageUrl || 'https://via.placeholder.com/400'}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" onClick={e => e.preventDefault()}>
          <Heart className="w-4 h-4 text-gray-600" />
        </button>
        {product.discount && (
          <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
            {product.discount}% OFF
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-800 mb-1 line-clamp-2 text-sm">{product.name}</h3>
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-green-500 text-green-500" />
            <span className="text-xs text-gray-600">{product.rating || '4.2'}</span>
          </div>
          <span className="text-xs text-gray-400">({product.reviews || '1,234'})</span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-semibold text-gray-900">₹{product.price}</span>
          {product.originalPrice && (
            <>
              <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
              <span className="text-sm text-green-600 font-medium">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-600 mb-3">
          <Truck className="w-3 h-3" />
          <span>Free delivery</span>
        </div>
      </div>
    </Link>
    <div className="px-4 pb-4">
      <Button 
        className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm py-2 rounded"
        onClick={onAddToCart}
        disabled={product.countInStock === 0}
      >
        {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </Button>
    </div>
  </div>
);

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([
    { name: 'All', icon: '🏪', color: 'bg-blue-500' },
    { name: 'Electronics', icon: '📱', color: 'bg-purple-500' },
    { name: 'Fashion', icon: '👕', color: 'bg-pink-500' },
    { name: 'Home', icon: '🏠', color: 'bg-green-500' },
    { name: 'Books', icon: '📚', color: 'bg-yellow-500' },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get('/products');
        setProducts(data);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
    

      {/* Categories Skeleton */}
      <div className="bg-white p-4 border-b">
        <div className="flex gap-6 max-w-7xl mx-auto">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-16" />
          ))}
        </div>
      </div>

      {/* Products Skeleton */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 border">
              <Skeleton className="h-48 w-full mb-4" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Add to Cart handler
  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item._id === product._id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
    toast.success('Added to cart!');
  };

  if (loading) return <LoadingSkeleton />;

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Alert variant="destructive" className="max-w-md">
        <AlertTitle className="flex items-center gap-2">
          <span className="text-2xl">⚠️</span>
          Something went wrong
        </AlertTitle>
        <AlertDescription className="mt-2">
          {error}. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
 

      {/* Categories Bar */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-6 overflow-x-auto scrollbar-hide">
            {categories.map(category => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex flex-col items-center min-w-0 flex-shrink-0 p-2 rounded-lg transition-all duration-200 ${
                  category.name === selectedCategory
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-1 ${
                  category.name === selectedCategory ? category.color : 'bg-gray-100'
                } text-white`}>
                  {category.icon}
                </div>
                <span className="text-xs font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters and View Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedCategory === 'All' ? 'All Products' : selectedCategory}
            </h2>
            <span className="text-sm text-gray-500">
              ({filteredProducts.length} items)
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white rounded-lg border p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            
            <Button variant="outline" className="text-sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or category filter</p>
            <Button 
              onClick={() => {
                setSelectedCategory('All');
                setSearchTerm('');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={`grid gap-4 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5' 
              : 'grid-cols-1 max-w-4xl mx-auto'
          }`}>
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} onAddToCart={() => handleAddToCart(product)} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <ShoppingBag className="w-6 h-6" />
              <span className="text-xl font-bold">Flipkart</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your trusted shopping partner
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;