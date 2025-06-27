import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const ProductCard = ({ product }) => {
  return (
    <Card className="relative group p-0">
      <CardContent className="p-4 flex flex-col h-full">
        {product.countInStock === 0 && (
          <Badge variant="destructive" className="absolute top-2 right-2 z-10">Out of Stock</Badge>
        )}
        <img
          src={product.imageUrl || 'https://via.placeholder.com/200'}
          alt={product.name}
          className="w-full h-48 object-cover mb-4 rounded group-hover:scale-105 transition-transform"
        />
        <CardTitle className="text-lg font-semibold mb-2 truncate">{product.name}</CardTitle>
        <p className="text-gray-700 mb-2">${product.price}</p>
        <Button asChild className="mt-auto w-full">
          <Link to={`/product/${product._id}`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard; 