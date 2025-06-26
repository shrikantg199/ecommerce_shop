import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { toast } from 'react-hot-toast';

const Checkout = () => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const token = localStorage.getItem('token');

  if (!token) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const orderItems = cart.map(item => ({
      name: item.name,
      qty: item.quantity,
      image: item.imageUrl,
      price: item.price,
      product: item._id,
    }));

    const shippingAddressObj = {
      address: address,
      city: 'Test City',
      postalCode: '12345',
      country: 'Test Country',
    }

    try {
      await api.post(
        '/orders',
        {
          orderItems,
          shippingAddress: shippingAddressObj,
          paymentMethod: 'PayPal', // Or get from a form
          itemsPrice: total,
          taxPrice: 0,
          shippingPrice: 0,
          totalPrice: total,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Order placed successfully!');
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cart-updated'));
      setSuccess(true);
    } catch (err) {
      setError('Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Order Placed!</h1>
        <p>Thank you for your purchase.</p>
        <button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded" onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          placeholder="Shipping Address"
          value={address}
          onChange={e => setAddress(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>${total}</span>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <button
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          disabled={loading || cart.length === 0}
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default Checkout; 