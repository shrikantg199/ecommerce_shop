import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Minus, Plus, Trash2 } from 'lucide-react';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    setCart(stored ? JSON.parse(stored) : []);
  }, []);

  const handleRemove = (id) => {
    const updated = cart.filter(item => item._id !== id);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const handleQuantity = (id, delta) => {
    setCart(prev => {
      const updated = prev.map(item =>
        item._id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      );
      localStorage.setItem('cart', JSON.stringify(updated));
      window.dispatchEvent(new Event('cart-updated'));
      return updated;
    });
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = subtotal > 0 ? 0 : 0;
  const total = subtotal + delivery;
  const savings = cart.reduce((sum, item) => sum + ((item.originalPrice || item.price) - item.price) * item.quantity, 0);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6">
              <CardTitle className="mb-6 text-2xl font-bold">Shopping Cart ({cart.length})</CardTitle>
              {cart.length === 0 ? (
                <Alert>
                  <AlertTitle>Empty Cart</AlertTitle>
                  <AlertDescription>Your cart is empty.</AlertDescription>
                </Alert>
              ) : (
                <ul className="divide-y">
                  {cart.map((item, idx) => (
                    <li key={idx} className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <img
                          src={item.imageUrl || 'https://via.placeholder.com/100'}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded border"
                        />
                        <div>
                          <div className="font-semibold text-lg mb-1">{item.name}</div>
                          <div className="text-gray-600 mb-2">₹{item.price} {item.originalPrice && <span className='line-through text-gray-400 ml-2 text-sm'>₹{item.originalPrice}</span>}</div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleQuantity(item._id, -1)} className="p-1 border rounded disabled:opacity-50" disabled={item.quantity <= 1}><Minus className="w-4 h-4" /></button>
                            <span className="px-2 font-semibold">{item.quantity}</span>
                            <button onClick={() => handleQuantity(item._id, 1)} className="p-1 border rounded"><Plus className="w-4 h-4" /></button>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="font-bold text-lg">₹{item.price * item.quantity}</div>
                        <button onClick={() => handleRemove(item._id)} className="text-red-600 flex items-center gap-1 text-sm hover:underline"><Trash2 className="w-4 h-4" /> Remove</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Price Summary */}
        <div>
          <Card>
            <CardContent className="p-6">
              <CardTitle className="mb-4 text-xl font-bold">Price Details</CardTitle>
              <div className="flex justify-between py-2 text-gray-700">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between py-2 text-gray-700">
                <span>Delivery Charges</span>
                <span className="text-green-600 font-semibold">{delivery === 0 ? 'Free' : `₹${delivery}`}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between py-2 text-green-600 font-semibold">
                  <span>You Save</span>
                  <span>₹{savings}</span>
                </div>
              )}
              <div className="border-t my-4"></div>
              <div className="flex justify-between py-2 text-lg font-bold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
              <Button
                className="mt-6 w-full"
                disabled={cart.length === 0}
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart; 