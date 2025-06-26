import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ClipboardList, Users, DollarSign } from 'lucide-react';
import api from '../../api/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const { data } = await api.get('/products/admin-stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(data);
      } catch (err) {
        setError('Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold mb-2 text-blue-700">Welcome, Admin!</h1>
        <p className="text-lg text-gray-600">Manage your store efficiently from the dashboard below.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow flex flex-col items-center p-4 border-t-4 border-blue-500">
          <Package className="w-8 h-8 text-blue-600 mb-2" />
          <div className="text-2xl font-bold">{loading ? '...' : stats?.productCount ?? '-'}</div>
          <div className="text-gray-600 text-sm">Products</div>
        </div>
        <div className="bg-white rounded-xl shadow flex flex-col items-center p-4 border-t-4 border-green-500">
          <ClipboardList className="w-8 h-8 text-green-600 mb-2" />
          <div className="text-2xl font-bold">{loading ? '...' : stats?.orderCount ?? '-'}</div>
          <div className="text-gray-600 text-sm">Orders</div>
        </div>
        <div className="bg-white rounded-xl shadow flex flex-col items-center p-4 border-t-4 border-yellow-500">
          <Users className="w-8 h-8 text-yellow-600 mb-2" />
          <div className="text-2xl font-bold">{loading ? '...' : stats?.userCount ?? '-'}</div>
          <div className="text-gray-600 text-sm">Users</div>
        </div>
        <div className="bg-white rounded-xl shadow flex flex-col items-center p-4 border-t-4 border-purple-500">
          <DollarSign className="w-8 h-8 text-purple-600 mb-2" />
          <div className="text-2xl font-bold">{loading ? '...' : (stats?.totalSales?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) ?? '-')}</div>
          <div className="text-gray-600 text-sm">Total Sales</div>
        </div>
      </div>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div
          className="bg-gradient-to-br from-blue-100 to-blue-200 p-8 rounded-xl shadow-lg cursor-pointer hover:scale-105 hover:shadow-xl transition-all flex flex-col items-center"
          onClick={() => navigate('/admin/products')}
        >
          <Package className="w-12 h-12 text-blue-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-2 text-blue-800">Manage Products</h2>
          <p className="text-gray-700 text-center">Add, edit, or delete products and upload images.</p>
        </div>
        <div
          className="bg-gradient-to-br from-green-100 to-green-200 p-8 rounded-xl shadow-lg cursor-pointer hover:scale-105 hover:shadow-xl transition-all flex flex-col items-center"
          onClick={() => navigate('/admin/orders')}
        >
          <ClipboardList className="w-12 h-12 text-green-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-2 text-green-800">Manage Orders</h2>
          <p className="text-gray-700 text-center">View and manage all customer orders.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 