import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

   const handleLogout = async () => {
    try {
      await logout();
      navigate('/'); // redirect after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-gradient-to-r from-pink-500 to-orange-500 shadow-lg">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-white text-2xl font-bold">
            CreativeBlog
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/blogs" className="text-white hover:text-gray-200 transition">
              Blogs
            </Link>
            
            {user ? (
              <>
                <Link to="/blogs/create" className="text-white hover:text-gray-200 transition">
                  Create Blog
                </Link>
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center space-x-2 text-white focus:outline-none">
                    <span className="hidden sm:inline">{user.username}</span>
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-pink-500 font-bold">
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                  </Menu.Button>
                  <Transition
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg py-1 z-10">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => navigate('/')}
                            className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700 w-full text-left`}
                          >
                            Profile
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700 w-full text-left`}
                          >
                            Logout
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-gray-200 transition">
                  Login
                </Link>
                <Link to="/signup" className="bg-white text-pink-500 px-4 py-2 rounded-md hover:bg-gray-100 transition">
                  Sign Up
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white focus:outline-none"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <Link
              to="/blogs"
              className="block text-white hover:text-gray-200 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blogs
            </Link>
            
            {user ? (
              <>
                <Link
                  to="/blogs/create"
                  className="block text-white hover:text-gray-200 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create Blog
                </Link>
                <button
                  onClick={async () => {
                    await handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block text-white hover:text-gray-200 transition w-full text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-white hover:text-gray-200 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block bg-white text-pink-500 px-4 py-2 rounded-md hover:bg-gray-100 transition text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;