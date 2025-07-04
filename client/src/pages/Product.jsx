import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      toast.error('Please log in first');
      return;
    }
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item._id === product._id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
    // Save cart to backend
    try {
      await api.post('/users/cart', { cart });
    } catch (err) {
      // Optionally handle error
    }
    navigate('/cart');
  };

  if (loading) return (
    <div className="max-w-2xl mx-auto p-4">
      <Alert>
        <AlertTitle>Loading...</AlertTitle>
      </Alert>
    </div>
  );
  if (error) return (
    <div className="max-w-2xl mx-auto p-4">
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    </div>
  );
  if (!product) return null;

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button
        className="flex items-center gap-2 mb-4 text-blue-600 hover:underline"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <Card>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center">
            <img
              src={product.imageUrl || 'https://via.placeholder.com/400'}
              alt={product.name}
              className="w-full max-w-xs h-80 object-cover rounded mb-4 border"
            />
            {product.countInStock > 0 ? (
              <span className="text-green-600 font-semibold">In Stock</span>
            ) : (
              <span className="text-red-600 font-semibold">Out of Stock</span>
            )}
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <CardTitle className="text-3xl font-bold mb-2">{product.name}</CardTitle>
              {/* Description Section */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-1 text-gray-800 border-b pb-1">Description</h3>
                <p className="text-gray-700 text-base leading-relaxed">{product.description}</p>
              </div>
              {/* Specifications Section (Mock Data) */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2 text-gray-800 border-b pb-1">Specifications</h3>
                <table className="w-full bg-gray-50 border rounded text-sm">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 px-3 font-medium text-gray-700 w-1/3">Brand</td>
                      <td className="py-2 px-3 text-gray-900">eShop</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-3 font-medium text-gray-700">Model</td>
                      <td className="py-2 px-3 text-gray-900">Standard</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-3 font-medium text-gray-700">Color</td>
                      <td className="py-2 px-3 text-gray-900">Black</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-gray-700">Warranty</td>
                      <td className="py-2 px-3 text-gray-900">1 Year</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">₹{product.originalPrice}</span>
                )}
                {discount && (
                  <span className="text-lg text-green-600 font-semibold">{discount}% OFF</span>
                )}
              </div>
              <div className="flex items-center mb-4">
                <label className="mr-2 font-semibold">Qty:</label>
                <Input
                  type="number"
                  min="1"
                  max={product.countInStock || 99}
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, Math.min(Number(e.target.value), product.countInStock || 99)))}
                  className="w-16"
                />
              </div>
            </div>
            <Button
              className="w-full mt-4"
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
            >
              {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Future: Reviews Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Reviews</h2>
        <div className="text-gray-500">No reviews yet.</div>
      </div>
    </div>
  );
};

export default Product; 