import React from 'react';
import Footer from './Footer';

const Layout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-screen  ">
      {children}
    </div>
    <Footer />
  </div>
);

export default Layout; 