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
import { Menu, ShoppingCart, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

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
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <NavLink to="/" className="text-xl font-bold text-blue-700 flex items-center gap-2">
              <ShoppingCart className="h-6 w-6" />
              eShop
            </NavLink>
            <div className="hidden md:block">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavLink to="/" className={navigationMenuTriggerStyle()}>
                      Home
                    </NavLink>
                  </NavigationMenuItem>
                  {user && user.isAdmin && (
                    <NavigationMenuItem>
                      <NavLink to="/admin" className={navigationMenuTriggerStyle()}>
                        Admin
                      </NavLink>
                    </NavigationMenuItem>
                  )}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <NavLink to="/cart" className="relative text-gray-700 hover:text-blue-600">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartCount}</span>
              )}
            </NavLink>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 focus:outline-none">
                    {user.profileImageUrl ? (
                      <img src={user.profileImageUrl} alt={user.name} className="w-8 h-8 rounded-full" />
                    ) : (
                      <UserIcon className="w-8 h-8 rounded-full bg-gray-200 p-1" />
                    )}
                    <span>Hi, {user.name}</span>
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
              <div className="hidden md:block">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavLink to="/login" className={navigationMenuTriggerStyle()}>
                        Login
                      </NavLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavLink to="/register" className={navigationMenuTriggerStyle()}>
                        Register
                      </NavLink>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <Drawer>
              <DrawerTrigger>
                <Menu className="h-6 w-6" />
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