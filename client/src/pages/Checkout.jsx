import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const Checkout = () => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const token = localStorage.getItem('token');

  if (!token) {
    navigate('/login');
    return null;
  }

  const handleApplyCoupon = () => {
    // Example: 'SAVE10' gives 10% off
    if (coupon.trim().toUpperCase() === 'SAVE10') {
      setDiscount(Math.round(total * 0.1));
      setCouponApplied(true);
    } else {
      setDiscount(0);
      setCouponApplied(false);
      alert('Invalid coupon code');
    }
  };

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
      address,
      city,
      postalCode,
      country,
    };

    try {
      await api.post(
        '/orders',
        {
          orderItems,
          shippingAddress: shippingAddressObj,
          paymentMethod,
          itemsPrice: total,
          taxPrice: 0,
          shippingPrice: 0,
          totalPrice: total - discount,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
        <Card>
          <CardContent className="p-8">
            <Alert>
              <AlertTitle>Order Placed!</AlertTitle>
              <AlertDescription>Thank you for your purchase.</AlertDescription>
            </Alert>
            <Button className="mt-6 w-full" onClick={() => navigate('/')}>Back to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Shipping & Items */}
          <div>
            <CardTitle className="mb-6 text-2xl font-bold">Checkout</CardTitle>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-semibold">Shipping Address</label>
                <Textarea
                  placeholder="Address"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  required
                  className="mb-2"
                />
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="City"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    required
                  />
                  <Input
                    placeholder="Postal Code"
                    value={postalCode}
                    onChange={e => setPostalCode(e.target.value)}
                    required
                  />
                </div>
                <Input
                  placeholder="Country"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="font-semibold block mb-2">Payment Method</label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex gap-4">
                  <RadioGroupItem value="PayPal" id="paypal" />
                  <label htmlFor="paypal" className="mr-4">PayPal</label>
                  <RadioGroupItem value="Credit Card" id="card" />
                  <label htmlFor="card" className="mr-4">Credit Card</label>
                  <RadioGroupItem value="Cash on Delivery" id="cod" />
                  <label htmlFor="cod">Cash on Delivery</label>
                </RadioGroup>
              </div>
              <div>
                <label className="font-semibold block mb-2">Coupon Code</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon (e.g. SAVE10)"
                    value={coupon}
                    onChange={e => setCoupon(e.target.value)}
                    disabled={couponApplied}
                  />
                  <Button type="button" onClick={handleApplyCoupon} disabled={couponApplied}>
                    {couponApplied ? 'Applied' : 'Apply'}
                  </Button>
                </div>
                {couponApplied && <div className="text-green-600 text-sm mt-1">Coupon applied! -₹{discount}</div>}
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {/* Stripe Checkout Button */}
              <Button
                className="w-full"
                type="button"
                disabled={loading || cart.length === 0}
              >
                Pay with Card
              </Button>
              {/* Note: You must implement the /create-checkout-session endpoint in your server for this to work. */}
            </form>
          </div>
          {/* Right: Cart Items & Price Summary */}
          <div>
            <div className="mb-6">
              <div className="font-semibold mb-2">Order Items</div>
              <ul className="divide-y">
                {cart.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-4 py-3">
                    <img
                      src={item.imageUrl || 'https://via.placeholder.com/60'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded border"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-gray-600 text-sm">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-bold">₹{item.price * item.quantity}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 rounded p-4">
              <div className="font-semibold mb-2">Price Details</div>
              <div className="flex justify-between py-1 text-gray-700">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between py-1 text-gray-700">
                <span>Delivery Charges</span>
                <span className="text-green-600 font-semibold">Free</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between py-1 text-green-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="border-t my-2"></div>
              <div className="flex justify-between py-1 text-lg font-bold">
                <span>Total</span>
                <span>₹{total - discount}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Checkout; 