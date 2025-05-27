import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = () => {
  const { token, isLoading } = useAuth();
  if (isLoading) {
    // Optionally show loading state if needed
    return <div>Loading...</div>;
  }

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;