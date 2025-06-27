import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line
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
      fetchOrder();
    } catch (err) {
      setError('Failed to mark order as delivered');
    }
  };

  if (loading) return <div className="p-4"><Alert><AlertTitle>Loading...</AlertTitle></Alert></div>;
  if (error) return <div className="p-4"><Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert></div>;
  if (!order) return null;

  return (
    <div className="p-4">
      <Card>
        <CardContent className="p-6">
          <CardTitle className="mb-4">Order {order._id}</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 flex flex-col gap-4">
              <Card className="bg-white">
                <CardContent className="p-4">
                  <CardTitle className="text-xl font-bold mb-2">Shipping</CardTitle>
                  <p><strong>Name:</strong> {order.user.name}</p>
                  <p><strong>Email:</strong> {order.user.email}</p>
                  <p><strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                  {order.isDelivered ? (
                    <Alert className="mt-2" variant="default">Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</Alert>
                  ) : (
                    <Alert className="mt-2" variant="destructive">Not Delivered</Alert>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardContent className="p-4">
                  <CardTitle className="text-xl font-bold mb-2">Payment</CardTitle>
                  <p><strong>Method:</strong> {order.paymentMethod}</p>
                  {order.isPaid ? (
                    <Alert className="mt-2" variant="default">Paid on {new Date(order.paidAt).toLocaleDateString()}</Alert>
                  ) : (
                    <Alert className="mt-2" variant="destructive">Not Paid</Alert>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardContent className="p-4">
                  <CardTitle className="text-xl font-bold mb-2">Order Items</CardTitle>
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
                </CardContent>
              </Card>
            </div>
            <div>
              <Card className="bg-white">
                <CardContent className="p-4">
                  <CardTitle className="text-xl font-bold mb-2">Order Summary</CardTitle>
                  <div className="flex justify-between py-1"><span>Items</span><span>${order.itemsPrice}</span></div>
                  <div className="flex justify-between py-1"><span>Shipping</span><span>${order.shippingPrice}</span></div>
                  <div className="flex justify-between py-1"><span>Tax</span><span>${order.taxPrice}</span></div>
                  <div className="flex justify-between font-bold py-1"><span>Total</span><span>${order.totalPrice}</span></div>
                  {user.isAdmin && !order.isDelivered && (
                    <Button
                      className="w-full mt-4"
                      onClick={handleMarkAsDelivered}
                    >
                      Mark As Delivered
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Order; 