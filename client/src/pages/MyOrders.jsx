import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

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
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return (
    <div className="p-4">
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    </div>
  );

  return (
    <div className="p-4">
      <Card>
        <CardContent className="p-8">
          <CardTitle className="mb-6">My Orders</CardTitle>
          {orders.length === 0 ? (
            <Alert>
              <AlertTitle>No Orders</AlertTitle>
              <AlertDescription>You have no orders.</AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>DATE</TableHead>
                  <TableHead>TOTAL</TableHead>
                  <TableHead>PAID</TableHead>
                  <TableHead>DELIVERED</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>${order.totalPrice}</TableCell>
                    <TableCell>
                      {order.isPaid ? (
                        new Date(order.paidAt).toLocaleDateString()
                      ) : (
                        <span className="text-red-500">No</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {order.isDelivered ? (
                        new Date(order.deliveredAt).toLocaleDateString()
                      ) : (
                        <span className="text-red-500">No</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button asChild size="sm">
                        <Link to={`/order/${order._id}`}>Details</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyOrders; 