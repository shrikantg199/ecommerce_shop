import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#2874f0] text-white text-center py-4 mt-8">
      <span>&copy; {new Date().getFullYear()} Buzzbasket. All rights reserved.</span>
    </footer>
  );
};

export default Footer; 