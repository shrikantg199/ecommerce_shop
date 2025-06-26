import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="relative border rounded-lg p-4 shadow-sm hover:shadow-xl transition flex flex-col bg-white group">
      {product.countInStock === 0 && (
        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Out of Stock</span>
      )}
      <img
        src={product.imageUrl || 'https://via.placeholder.com/200'}
        alt={product.name}
        className="w-full h-48 object-cover mb-4 rounded group-hover:scale-105 transition-transform"
      />
      <h2 className="text-lg font-semibold mb-2 truncate">{product.name}</h2>
      <p className="text-gray-700 mb-2">${product.price}</p>
      <Link
        to={`/product/${product._id}`}
        className="mt-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center transition"
      >
        View Details
      </Link>
    </div>
  );
};

export default ProductCard; 