import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getBlogs } from '../../services/blogService';
import { motion } from 'framer-motion';

const BlogListPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await getBlogs(page);
        setBlogs(data);
        setTotalPages(Math.ceil(data.count / 10)); // Assuming 10 items per page
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Latest Blog Posts</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog, index) => (
          <motion.div
            key={blog.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition h-full flex flex-col">
              <div className="p-6 flex-grow">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{blog.title}</h2>
                <p className="text-gray-600 mb-4">
                  {blog.content.substring(0, 150)}...
                </p>
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
                <button
                  onClick={() => navigate(`/blogs/${blog.id}`)}
                  className="text-pink-600 hover:text-pink-700 font-medium"
                >
                  Read More
                </button>
                <span className="text-sm text-gray-500">By {blog.author}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-4 py-2 rounded-md ${page === pageNum
                  ? 'bg-pink-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

export default BlogListPage;