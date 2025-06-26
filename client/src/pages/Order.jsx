import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import { toast } from 'react-hot-toast';

const Order = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const { data } = await api.get(`/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(data);
    } catch (err) {
      setError('Failed to fetch order');
      toast.error('Failed to fetch order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleMarkAsDelivered = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.put(
        `/orders/${id}/deliver`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Order marked as delivered');
      fetchOrder();
    } catch (err) {
      toast.error('Failed to mark order as delivered');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!order) return null;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Order {order._id}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-2">Shipping</h2>
            <p><strong>Name:</strong> {order.user.name}</p>
            <p><strong>Email:</strong> {order.user.email}</p>
            <p><strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
            {order.isDelivered ? (
              <div className="mt-2 bg-green-100 p-2 rounded">Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</div>
            ) : (
              <div className="mt-2 bg-red-100 p-2 rounded">Not Delivered</div>
            )}
          </div>

          <div className="bg-white p-4 rounded shadow mt-4">
            <h2 className="text-xl font-bold mb-2">Payment</h2>
            <p><strong>Method:</strong> {order.paymentMethod}</p>
            {order.isPaid ? (
              <div className="mt-2 bg-green-100 p-2 rounded">Paid on {new Date(order.paidAt).toLocaleDateString()}</div>
            ) : (
              <div className="mt-2 bg-red-100 p-2 rounded">Not Paid</div>
            )}
          </div>

          <div className="bg-white p-4 rounded shadow mt-4">
            <h2 className="text-xl font-bold mb-2">Order Items</h2>
            <ul>
              {order.orderItems.map((item, index) => (
                <li key={index} className="flex justify-between items-center py-2 border-b">
                  <div className="flex items-center">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover mr-4" />
                    <span>{item.name}</span>
                  </div>
                  <span>{item.qty} x ${item.price} = ${item.qty * item.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-2">Order Summary</h2>
            <div className="flex justify-between py-1"><span>Items</span><span>${order.itemsPrice}</span></div>
            <div className="flex justify-between py-1"><span>Shipping</span><span>${order.shippingPrice}</span></div>
            <div className="flex justify-between py-1"><span>Tax</span><span>${order.taxPrice}</span></div>
            <div className="flex justify-between font-bold py-1"><span>Total</span><span>${order.totalPrice}</span></div>
            
            {user.isAdmin && !order.isDelivered && (
              <button
                onClick={handleMarkAsDelivered}
                className="w-full bg-green-600 text-white py-2 rounded mt-4"
              >
                Mark As Delivered
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order; 