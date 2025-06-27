import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Menu, ShoppingCart, User as UserIcon, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    };
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    // Call updateCartCount when the cart changes
    window.addEventListener('cart-updated', updateCartCount);
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cart-updated', updateCartCount);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-[#2874f0] shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center gap-2 min-w-[120px]">
            <NavLink to="/" className="flex items-center gap-1">
              <ShoppingCart className="h-7 w-7 text-white" />
              <span className="text-2xl font-bold text-white">eShop</span>
            </NavLink>
          </div>
          {/* Center: Search Bar */}
          <div className="flex-1 flex justify-center mx-2">
            <form className="w-full max-w-xl flex" onSubmit={e => e.preventDefault()}>
              <input
                type="text"
                placeholder="Search for products, brands and more"
                className="w-full px-4 py-2 rounded-l-md focus:outline-none bg-white text-gray-800"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ minWidth: 0 }}
              />
              <button type="submit" className="bg-[#ffe500] px-4 py-2 rounded-r-md text-[#2874f0] font-semibold">Search</button>
            </form>
          </div>
          {/* Right: Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Become a Seller */}
            <button className="text-white hover:underline font-medium">Become a Seller</button>
            {/* Admin Tab (Desktop) */}
            {user && user.isAdmin && (
              <NavLink to="/admin" className="text-white hover:underline font-medium">Admin</NavLink>
            )}
            {/* More Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 text-white font-medium hover:underline focus:outline-none">
                  More <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => navigate('/profile')}>Profile</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate('/my-orders')}>My Orders</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Customer Care</DropdownMenuItem>
                <DropdownMenuItem>Advertise</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Cart */}
            <NavLink to="/cart" className="relative text-white hover:text-yellow-400">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-[#2874f0] text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartCount}</span>
              )}
            </NavLink>
            {/* Login/Profile */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 text-white focus:outline-none">
                    {user.profileImageUrl ? (
                      <img src={user.profileImageUrl} alt={user.name} className="w-8 h-8 rounded-full" />
                    ) : (
                      <UserIcon className="w-8 h-8 rounded-full bg-white/20 p-1" />
                    )}
                    <span>{user.name}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => navigate('/profile')}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => navigate('/my-orders')}>My Orders</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleLogout} className="text-red-600 focus:text-red-700 focus:bg-red-50">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <NavLink to="/login" className="bg-white text-[#2874f0] px-4 py-1 rounded font-semibold hover:bg-blue-100">Login</NavLink>
            )}
          </div>
          {/* Mobile: Hamburger */}
          <div className="md:hidden flex items-center">
            <Drawer>
              <DrawerTrigger>
                <Menu className="h-6 w-6 text-white" />
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>eShop</DrawerTitle>
                </DrawerHeader>
                <div className="px-4">
                  <NavigationMenu className="w-full">
                    <NavigationMenuList className="flex-col space-y-2 w-full">
                      <NavigationMenuItem className="w-full">
                        <NavLink to="/" className={navigationMenuTriggerStyle() + " w-full justify-start"}>
                          Home
                        </NavLink>
                      </NavigationMenuItem>
                      {user && user.isAdmin && (
                        <NavigationMenuItem className="w-full">
                          <NavLink to="/admin" className={navigationMenuTriggerStyle() + " w-full justify-start"}>
                            Admin
                          </NavLink>
                        </NavigationMenuItem>
                      )}
                      {!user && (
                        <>
                          <NavigationMenuItem className="w-full">
                            <NavLink to="/login" className={navigationMenuTriggerStyle() + " w-full justify-start"}>
                              Login
                            </NavLink>
                          </NavigationMenuItem>
                          <NavigationMenuItem className="w-full">
                            <NavLink to="/register" className={navigationMenuTriggerStyle() + " w-full justify-start"}>
                              Register
                            </NavLink>
                          </NavigationMenuItem>
                        </>
                      )}
                    </NavigationMenuList>
                  </NavigationMenu>
                  {/* Mobile Search Bar */}
                  <form className="w-full mt-4 flex " onSubmit={e => e.preventDefault()}>
                    <input
                      type="text"
                      placeholder="Search for products, brands and more"
                      className="w-full px-4 py-2 rounded-l-md focus:outline-none bg-white text-gray-800"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      style={{ minWidth: 0 }}
                    />
                    <button type="submit" className="bg-[#ffe500] px-4 py-2 rounded-r-md text-[#2874f0] font-semibold">Search</button>
                  </form>
                  <div className="mt-4 flex flex-col gap-2">
                    <button className="text-[#2874f0] hover:underline font-medium text-left">Become a Seller</button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-1 text-[#2874f0] font-medium hover:underline focus:outline-none">
                          More <ChevronDown className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => navigate('/profile')}>Profile</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => navigate('/my-orders')}>My Orders</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Customer Care</DropdownMenuItem>
                        <DropdownMenuItem>Advertise</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <DrawerFooter>
                  <DrawerClose>
                    <button className="w-full">Close</button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 