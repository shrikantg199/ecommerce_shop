import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="divide-y">
            {cart.map((item, idx) => (
              <li key={idx} className="flex justify-between items-center py-4">
                <div>
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-gray-600">${item.price} x {item.quantity}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="font-bold">${item.price * item.quantity}</div>
                  <button
                    className="ml-2 text-red-600 hover:underline"
                    onClick={() => handleRemove(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center mt-6">
            <span className="text-lg font-bold">Total:</span>
            <span className="text-xl font-bold">${total}</span>
          </div>
          <button
            className="mt-6 w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default Cart; 