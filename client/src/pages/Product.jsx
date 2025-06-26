import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
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

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item._id === product._id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
    toast.success('Added to cart!');
    navigate('/cart');
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!product) return null;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <img
        src={product.imageUrl || 'https://via.placeholder.com/400'}
        alt={product.name}
        className="w-full h-80 object-cover rounded mb-6"
      />
      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
      <p className="text-gray-700 mb-2">{product.description}</p>
      <p className="text-lg font-semibold mb-4">${product.price}</p>
      <div className="flex items-center mb-4">
        <label className="mr-2 font-semibold">Qty:</label>
        <input
          type="number"
          min="1"
          max={product.countInStock || 99}
          value={quantity}
          onChange={e => setQuantity(Math.max(1, Math.min(Number(e.target.value), product.countInStock || 99)))}
          className="w-16 border rounded p-1"
        />
      </div>
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        onClick={handleAddToCart}
        disabled={product.countInStock === 0}
      >
        {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default Product; 