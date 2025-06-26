import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const ProductForm = ({ onSubmit, product, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    imageUrl: '',
    countInStock: '',
    category: '',
  });
  const [uploading, setUploading] = useState(false);

  const categories = [
    'Electronics',
    'Clothing',
    'Books',
    'Home',
    'Sports',
    'Toys',
    'Other',
  ];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        description: product.description || '',
        imageUrl: product.imageUrl || '',
        countInStock: product.countInStock || '',
        category: product.category || '',
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formDataImg = new FormData();
    formDataImg.append('image', file);
    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await api.post('/products/upload', formDataImg, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setFormData((prev) => ({ ...prev, imageUrl: data.imageUrl }));
    } catch (err) {
      alert('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">{product ? 'Edit Product' : 'Create Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full border p-2 rounded" required />
          <input name="price" value={formData.price} onChange={handleChange} placeholder="Price" type="number" className="w-full border p-2 rounded" required />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full border p-2 rounded" />
          <div>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {uploading && <div>Uploading...</div>}
            {formData.imageUrl && (
              <img src={formData.imageUrl} alt="Product" className="w-24 h-24 object-cover mt-2" />
            )}
          </div>
          <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Image URL" className="w-full border p-2 rounded" />
          <input name="countInStock" value={formData.countInStock} onChange={handleChange} placeholder="Count in Stock" type="number" className="w-full border p-2 rounded" required />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="" disabled>Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{product ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm; 