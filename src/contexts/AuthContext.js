import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, logoutUser, refreshToken } from '../services/authService';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

   useEffect(() => {
    const checkAuth = async () => {
      try {
        await loginWithToken();
      } catch (error) {
          
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
    }
  }, [token]);

  const loginWithToken = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshTokenValue = localStorage.getItem('refreshToken');

    if (!accessToken && !refreshTokenValue) {
      throw new Error('No tokens found');
    }

    try {
      if (accessToken) {
        const decoded = jwtDecode(accessToken);
        if (decoded.exp * 1000 > Date.now()) {
          setToken(accessToken);
          return;
        }
      }

      if (refreshTokenValue) {
        const { access } = await refreshToken(refreshTokenValue);
        localStorage.setItem('accessToken', access);
        setToken(access);
        return;
      }

      throw new Error('No valid tokens');
    } catch (error) {
      // Clear invalid tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setToken(null);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const { access, refresh } = await loginUser(email, password);
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      setToken(access);
      navigate('/');
    } catch (error) {
      throw error;
    }
  };

  const signup = async (username, email, password) => {
    try {
      const { message, access, refresh }= await registerUser(username, email, password);
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      setToken(access);
      navigate('/', { state: { successMessage: message } });
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setToken(null);
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loginWithToken, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);