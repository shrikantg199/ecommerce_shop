import React, { useEffect, useState, useRef } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Filter, Grid, List, ShoppingBag, Sparkles, Heart, Star, Truck, ArrowRight, Menu, User, ShoppingCart, Zap, Shield, Award } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import api from '@/api/api';
import { toast } from 'react-hot-toast';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

const ProductCard = ({ product, onAddToCart }) => (
  <div className="bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-500 overflow-hidden group relative transform hover:-translate-y-1">
    <Link to={`/product/${product._id}`} className="block">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
        <img 
          src={product.imageUrl || 'https://via.placeholder.com/400'}
          alt={product.name}
          className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <button className="absolute top-3 right-3 p-2.5 bg-white/95 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 hover:scale-110 z-20" onClick={e => e.preventDefault()}>
          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
        </button>
        {product.discount && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
            <Sparkles className="w-3 h-3 inline mr-1" />
            {product.discount}% OFF
          </div>
        )}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-[#2874F0]" />
            <span className="text-xs font-medium text-gray-700">Fast Delivery</span>
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 text-sm leading-relaxed group-hover:text-[#2874F0] transition-colors">{product.name}</h3>
          <div className="ml-2">
            <Shield className="w-4 h-4 text-green-500" />
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1 bg-green-500 px-2 py-0.5 rounded text-white">
            <Star className="w-3 h-3 fill-white" />
            <span className="text-xs font-medium">{product.rating || '4.2'}</span>
          </div>
          <span className="text-xs text-gray-500">({product.reviews || '1,234'} reviews)</span>
          <Award className="w-3 h-3 text-orange-400" />
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
          {product.originalPrice && (
            <>
              <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
              <span className="text-sm text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
              </span>
            </>
          )}
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Truck className="w-3 h-3 text-[#2874F0]" />
            <span className="font-medium">Free delivery</span>
          </div>
          <div className="flex items-center gap-1 text-green-600">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>In Stock</span>
          </div>
        </div>
      </div>
    </Link>
    <div className="px-5 pb-5">
      <Button 
        className="w-full bg-gradient-to-r from-[#2874F0] to-[#1e5bc7] hover:from-[#1e5bc7] hover:to-[#2874F0] text-white text-sm py-2.5 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
        onClick={onAddToCart}
        disabled={product.countInStock === 0}
      >
        {product.countInStock === 0 ? (
          <>
            <span className="opacity-60">Out of Stock</span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </>
        )}
      </Button>
    </div>
  </div>
);

const bannerImages = [
  "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?auto=format&fit=crop&w=800&q=80", // Shopping bags
  "https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?auto=format&fit=crop&w=800&q=80", // Online shopping
  "https://images.unsplash.com/photo-1574484284002-952d45b69675?auto=format&fit=crop&w=800&q=80", // Products display
  "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?auto=format&fit=crop&w=800&q=80"  // E-commerce store
];

const Home = () => {
  // All original state variables preserved
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([
    { name: 'All', icon: '🏪', color: 'bg-[#2874F0]', gradient: 'from-[#2874F0] to-[#1e5bc7]' },
    { name: 'Electronics', icon: '📱', color: 'bg-purple-500', gradient: 'from-purple-500 to-purple-600' },
    { name: 'Fashion', icon: '👕', color: 'bg-pink-500', gradient: 'from-pink-500 to-pink-600' },
    { name: 'Home', icon: '🏠', color: 'bg-green-500', gradient: 'from-green-500 to-green-600' },
    { name: 'Books', icon: '📚', color: 'bg-yellow-500', gradient: 'from-yellow-500 to-yellow-600' },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const location = useLocation();
  const [carouselApi, setCarouselApi] = useState(null);
  const intervalRef = useRef();

  // Original useEffect for URL search params - PRESERVED
  useEffect(() => {
    // Get search param from URL
    const params = new URLSearchParams(location.search);
    const urlSearch = params.get('search') || '';
    setSearchTerm(urlSearch);
  }, [location.search]);

  // Original useEffect for fetching products - PRESERVED
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let endpoint = '/products';
        if (searchTerm) {
          endpoint += `?search=${encodeURIComponent(searchTerm)}`;
        }
        const { data } = await api.get(endpoint);
        setProducts(data);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchTerm]);

  // Original filtering logic - PRESERVED
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    if (!carouselApi) return;
    intervalRef.current = setInterval(() => {
      carouselApi.scrollNext();
    }, 2000);
    return () => clearInterval(intervalRef.current);
  }, [carouselApi]);

  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Categories Skeleton */}
      <div className="bg-white/80 backdrop-blur-sm p-6 border-b shadow-sm">
        <div className="flex gap-8 max-w-7xl mx-auto">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <Skeleton className="h-16 w-16 rounded-full mb-2" />
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
      </div>

      {/* Products Skeleton */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border shadow-sm">
              <Skeleton className="h-52 w-full rounded-lg mb-4" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Original Add to Cart handler - COMPLETELY PRESERVED
  const handleAddToCart = async (product) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      toast.error('Please log in first');
      return;
    }
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
    // Save cart to backend
    try {
      await api.post('/users/cart', { cart });
    } catch (err) {
      // Optionally handle error
    }
  };

  if (loading) return <LoadingSkeleton />;

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <Alert variant="destructive" className="max-w-md shadow-xl border-red-200">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto mt-4">
        <Carousel className="relative" setApi={setCarouselApi}>
          <CarouselContent>
            {bannerImages.map((img, idx) => (
              <CarouselItem key={idx}>
                <div className="w-full h-80 overflow-hidden flex items-center justify-center bg-gray-100">
                  <img
                    src={img}
                    alt={`Banner ${idx + 1}`}
                    className="w-full h-80 object-cover rounded-xl shadow-lg"
                    style={{ objectPosition: 'center' }}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      {/* Categories Bar - Enhanced UI with original functionality */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex gap-8 overflow-x-auto scrollbar-hide">
            {categories.map(category => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex flex-col items-center min-w-0 flex-shrink-0 py-0.5 px-1 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  category.name === selectedCategory
                    ? 'bg-gradient-to-br from-[#2874F0]/10 to-blue-100 text-[#2874F0] shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className={`w-8 h-4 rounded-full flex items-center justify-center text-base mb-0 transition-all duration-300 ${
                  category.name === selectedCategory 
                    ? `bg-gradient-to-r ${category.gradient} shadow-lg` 
                    : 'bg-gray-100 hover:bg-gray-200'
                } text-white transform ${category.name === selectedCategory ? 'scale-110' : ''}`}>
                  {category.icon}
                </div>
                <span className="text-xs font-semibold">{category.name}</span>
                {category.name === selectedCategory && (
                  <div className="w-2 h-2 bg-[#2874F0] rounded-full mt-1"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters and View Controls - Enhanced UI with original functionality */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold  bg-gradient-to-r from-[#2874F0] to-purple-600 bg-clip-text text-transparent">
              {selectedCategory === 'All' ? 'All Products' : selectedCategory}
            </h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
              ({filteredProducts.length} items)
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-[#2874F0] to-[#1e5bc7] text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-all duration-300 ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-[#2874F0] to-[#1e5bc7] text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            
            <Button variant="outline" className="text-sm border-gray-200 hover:border-[#2874F0] hover:text-[#2874F0] transition-all duration-300">
              <Filter className="w-6 h-6 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Products Grid - Enhanced UI with original filtering logic */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">No products found</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Try adjusting your search or category filter to discover amazing products</p>
            <Button 
              onClick={() => {
                setSelectedCategory('All');
                setSearchTerm('');
              }}
              className="bg-gradient-to-r from-[#2874F0] to-[#1e5bc7] hover:from-[#1e5bc7] hover:to-[#2874F0] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5' 
              : 'grid-cols-1 max-w-4xl mx-auto'
          }`}>
            {filteredProducts.map((product, index) => (
              <div 
                key={product._id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard product={product} onAddToCart={() => handleAddToCart(product)} />
              </div>
            ))}
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Home;