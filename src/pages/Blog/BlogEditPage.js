import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../../services/blogService";
import { motion } from "framer-motion";
import {
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const BlogEditPage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await getBlogById(id);
        setTitle(data.title);
        setContent(data.content);
      } catch (error) {
        console.error("Error fetching blog:", error);
        navigate("/blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, navigate]);

    const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  // Quill editor formats configuration
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setSaving(true);
      await updateBlog(id, title, content);
      navigate(`/blogs/${id}`);
    } catch (err) {
      setError("Failed to update blog. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSaving(true);
      await deleteBlog(id);
      navigate("/blogs");
    } catch (err) {
      setError("Failed to delete blog. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white rounded-xl shadow-md overflow-hidden my-8">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate(`/blogs/${id}`)}
              className="mr-4 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Edit Blog Post</h1>
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Content
              </label>
              <div className="min-h-[300px] [&_.ql-editor]:min-h-[250px] [&_.ql-editor]:max-h-[500px] [&_.ql-editor]:overflow-y-auto">
                  <ReactQuill
                  id="content"
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  formats={formats}
                  className="border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-pink-500 focus-within:border-transparent"
                  />
              </div>
            </div>{" "}
            <div className="flex justify-between">
              {" "}
              <button
                type="button"
                onClick={() => setDeleteDialogOpen(true)}
                disabled={saving}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition disabled:opacity-75"
              >
                {" "}
                <TrashIcon className="h-5 w-5 mr-2" /> Delete{" "}
              </button>{" "}
              <div className="flex space-x-3">
                {" "}
                <button
                  type="button"
                  onClick={() => navigate(`/blogs/${id}`)}
                  disabled={saving}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition disabled:opacity-75"
                >
                  {" "}
                  Cancel{" "}
                </button>{" "}
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-md hover:from-pink-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition disabled:opacity-75"
                >
                  {" "}
                  {saving ? (
                    <>
                      {" "}
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        {" "}
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>{" "}
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>{" "}
                      </svg>{" "}
                      Saving...{" "}
                    </>
                  ) : (
                    <>
                      {" "}
                      <PencilIcon className="h-5 w-5 mr-2" /> Save Changes{" "}
                    </>
                  )}{" "}
                </button>{" "}
              </div>{" "}
            </div>{" "}
          </form>{" "}
        </div>{" "}
      </div>{" "}
      {/* Delete Confirmation Dialog */}{" "}
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          {" "}
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            {" "}
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Delete Blog Post
            </h2>{" "}
            <p className="text-gray-600 mb-6">
              {" "}
              Are you sure you want to delete this blog post? This action cannot
              be undone.{" "}
            </p>{" "}
            <div className="flex justify-end space-x-3">
              {" "}
              <button
                onClick={() => setDeleteDialogOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
              >
                {" "}
                Cancel{" "}
              </button>{" "}
              <button
                onClick={handleDelete}
                disabled={saving}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition disabled:opacity-75"
              >
                {" "}
                {saving ? "Deleting..." : "Delete"}{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
        </div>
      )}{" "}
    </motion.div>
  );
};
export default BlogEditPage;
