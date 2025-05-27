import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="flex-grow flex items-center justify-center">
      <div className="text-center max-w-2xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Welcome to <span className="bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">CreativeBlog</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Share your thoughts, stories, and ideas with the world through our beautiful blogging platform.
          </p>
          <div className="flex justify-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/blogs/create"
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:from-pink-600 hover:to-orange-600 transition shadow-lg"
                >
                  Write a Blog
                </Link>
                <Link
                  to="/blogs"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Explore Blogs
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:from-pink-600 hover:to-orange-600 transition shadow-lg"
                >
                  Get Started
                </Link>
                <Link
                  to="/blogs"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Explore Blogs
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;