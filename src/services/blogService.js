import api from "./axios";

// const getAuthHeader = () => {
//   const accessToken = localStorage.getItem('accessToken');
//   return {
//     headers: {
//       Authorization: 'Bearer ${accessToken}',
//     },
//   };
// };

export const getBlogs = async (page = 1) => {
  try {
    const response = await api.get('blogs/');
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};

export const getBlogById = async (id) => {
  const response = await api.get(`blogs/${id}/`);
  return response.data;
};

export const createBlog = async (title, content) => {
  const response = await api.post(
    'blogs/create/',
    { title, content },
    
  );
  return response.data;
};

export const updateBlog = async (id, title, content) => {
  const response = await api.put(
    `blogs/${id}/edit/`,
    { title, content },
    
  );
  return response.data;
};

export const deleteBlog = async (id) => {
  const response = await api.delete(
    `blogs/${id}/edit/`,
    
  );
  return response.data;
};