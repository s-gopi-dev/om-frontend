import api from "./axios";

export const loginUser = async (email, password) => {
  const response = await api.post('login/', { email, password });
   if (response.data.access && response.data.refresh) {
    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
  }
  
  return response.data;
};

export const registerUser = async (username, email, password) => {
    const response = await api.post('signup/',{ username, email, password });
    return response.data;
};

export const refreshToken = async (refresh) => {
    const response = await api.post(
      'token/refresh/', { refresh });

    if (response.data.access) {
      localStorage.setItem('accessToken', response.data.access);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
    }

    return response.data;
};

// export const logoutUser = async () => {
//   const refreshToken = localStorage.getItem('refreshToken');
//   // const accessToken = localStorage.getItem('accessToken');
//   const response = await api.post(
//     'logout/',
//     { refresh: refreshToken },
//     {
//       // headers: {
//       //   Authorization: `Bearer ${accessToken}`,
//       //   'Content-Type': 'application/json',
//       // },
//     }
//   );
//   return response.data;
// };

export const logoutUser = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  try {
    await api.post('logout/', { refresh: refreshToken });
  } finally {
    // Clear tokens regardless of logout success
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete api.defaults.headers.common['Authorization'];
  }
};