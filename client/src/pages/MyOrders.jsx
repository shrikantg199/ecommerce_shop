import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const { data } = await api.get('/orders/myorders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(data);
      } catch (err) {
        setError('Failed to fetch your orders');
        toast.error('Failed to fetch your orders');
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p>You have no orders.</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">ID</th>
              <th className="py-2">DATE</th>
              <th className="py-2">TOTAL</th>
              <th className="py-2">PAID</th>
              <th className="py-2">DELIVERED</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="border px-4 py-2">{order._id}</td>
                <td className="border px-4 py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="border px-4 py-2">${order.totalPrice}</td>
                <td className="border px-4 py-2">
                  {order.isPaid ? (
                    new Date(order.paidAt).toLocaleDateString()
                  ) : (
                    <span className="text-red-500">No</span>
                  )}
                </td>
                <td className="border px-4 py-2">
                  {order.isDelivered ? (
                    new Date(order.deliveredAt).toLocaleDateString()
                  ) : (
                    <span className="text-red-500">No</span>
                  )}
                </td>
                <td className="border px-4 py-2">
                  <Link to={`/order/${order._id}`}>
                    <button className="bg-blue-600 text-white px-2 py-1 rounded">
                      Details
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyOrders; 