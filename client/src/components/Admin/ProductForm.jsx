import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../api/api';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const ProductForm = ({ onSubmit, product, onCancel }) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || '');

  const categories = [
    'Electronics',
    'Clothing',
    'Books',
    'Home',
    'Sports',
    'Toys',
    'Other',
  ];

  const form = useForm({
    defaultValues: {
      name: product?.name || '',
      price: product?.price || '',
      description: product?.description || '',
      imageUrl: product?.imageUrl || '',
      countInStock: product?.countInStock || '',
      category: product?.category || '',
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name || '',
        price: product.price || '',
        description: product.description || '',
        imageUrl: product.imageUrl || '',
        countInStock: product.countInStock || '',
        category: product.category || '',
      });
      setImageUrl(product.imageUrl || '');
    }
    // eslint-disable-next-line
  }, [product]);

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
      setImageUrl(data.imageUrl);
      form.setValue('imageUrl', data.imageUrl);
    } catch (err) {
      alert('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (values) => {
    onSubmit({ ...values, imageUrl });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <CardTitle className="text-2xl font-bold mb-6">{product ? 'Edit Product' : 'Create Product'}</CardTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField name="name" control={form.control} rules={{ required: 'Name is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField name="price" control={form.control} rules={{ required: 'Price is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Price" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField name="description" control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <Input type="file" accept="image/*" onChange={handleImageUpload} />
                {uploading && <div className="text-sm mt-1">Uploading...</div>}
                {imageUrl && (
                  <img src={imageUrl} alt="Product" className="w-24 h-24 object-cover mt-2 rounded" />
                )}
              </div>
              <FormField name="imageUrl" control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Image URL" {...field} value={imageUrl} onChange={e => { field.onChange(e); setImageUrl(e.target.value); }} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField name="countInStock" control={form.control} rules={{ required: 'Count in stock is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Count in Stock</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Count in Stock" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField name="category" control={form.control} rules={{ required: 'Category is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit">{product ? 'Update' : 'Create'}</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductForm; 