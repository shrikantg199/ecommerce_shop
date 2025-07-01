import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const res = await api.post('/users/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      // Fetch user cart from backend
      try {
        const cartRes = await api.get('/users/cart');
        localStorage.setItem('cart', JSON.stringify(cartRes.data));
        window.dispatchEvent(new Event('cart-updated'));
      } catch (cartErr) {
        localStorage.removeItem('cart');
      }
      setSuccess(`Welcome back, ${res.data.name || email}!`);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Invalid email or password');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-[#2874F0]/30 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2874F0] rounded-full mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
          <p className="text-gray-600">Welcome back! Please log in to your account</p>
        </div>
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8">
            <CardTitle className="mb-6 text-[#2874F0] text-2xl font-bold text-center">Login</CardTitle>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="h-12 border-2 border-gray-200 focus:border-[#2874F0] focus:ring-2 focus:ring-[#2874F0]/20 rounded-lg"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="h-12 border-2 border-gray-200 focus:border-[#2874F0] focus:ring-2 focus:ring-[#2874F0]/20 rounded-lg"
              />
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50 animate-in slide-in-from-top-2 duration-300">
                  <AlertTitle className="text-red-800">Error</AlertTitle>
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="border-green-200 bg-green-50 animate-in slide-in-from-top-2 duration-300">
                  <AlertTitle className="text-green-800">Success</AlertTitle>
                  <AlertDescription className="text-green-700">{success}</AlertDescription>
                </Alert>
              )}
              <Button className="w-full h-12 bg-[#2874F0] hover:bg-[#1e5bb8] text-white font-semibold rounded-lg shadow-md transition-all duration-200" type="submit">Login</Button>
            </form>
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <a href="/register" className="text-[#2874F0] hover:text-[#1e5bb8] font-medium transition-colors">Sign up here</a>
              </p>
            </div>
          </CardContent>
        </Card>
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 Your Company. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login; 