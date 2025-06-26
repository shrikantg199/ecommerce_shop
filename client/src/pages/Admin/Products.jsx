import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { toast } from 'react-hot-toast';
import ProductForm from '../../components/Admin/ProductForm';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (err) {
      setError('Failed to fetch products');
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        await api.delete(`/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Product deleted');
        fetchProducts();
      } catch (err) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, formData, config);
        toast.success('Product updated');
      } else {
        await api.post('/products', formData, config);
        toast.success('Product created');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error('Failed to save product');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <button onClick={handleCreate} className="bg-green-600 text-white px-4 py-2 rounded">
          Create Product
        </button>
      </div>

      {isModalOpen && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      )}

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">ID</th>
            <th className="py-2">NAME</th>
            <th className="py-2">PRICE</th>
            <th className="py-2">CATEGORY</th>
            <th className="py-2">STOCK</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td className="border px-4 py-2">{product._id}</td>
              <td className="border px-4 py-2">{product.name}</td>
              <td className="border px-4 py-2">${product.price}</td>
              <td className="border px-4 py-2">{product.category}</td>
              <td className="border px-4 py-2">{product.countInStock}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-blue-600 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products; 