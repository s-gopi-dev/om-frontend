import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogById, deleteBlog } from '../../services/blogService';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const data = await getBlogById(id);
        setBlog(data);
      } catch (error) {
        console.error('Error fetching blog:', error);
        navigate('/blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteBlog(id);
        navigate('/blogs');
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!blog) {
    return <div className="text-center py-8">Blog not found</div>;
  }

  const isAuthor = user && user.username === blog.author;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white rounded-xl shadow-md overflow-hidden my-8">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-gray-800">{blog.title}</h1>
            {isAuthor && (
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate(`/blogs/${blog.id}/edit`)}
                  className="p-2 text-blue-600 hover:text-blue-800"
                  title="Edit"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center text-white font-bold mr-3">
              {blog.author?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-medium text-gray-800">{blog.author.username}</p>
              <p className="text-sm text-gray-500">
                {new Date(blog.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="prose max-w-none">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={atomDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {blog.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogDetailPage;