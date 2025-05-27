import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import BlogCreatePage from './pages/Blog/BlogCreatePage';
import BlogDetailPage from './pages/Blog/BlogDetailPage';
import BlogListPage from './pages/Blog/BlogListPage';
import BlogEditPage from './pages/Blog/BlogEditPage';
import MainLayout from './components/layout/MainLayout';

function App() {
  return (
    <Router>
      <AuthProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/blogs" element={<BlogListPage />} />
            <Route path="/blogs/:id" element={<BlogDetailPage />} />
            <Route element={<PrivateRoute />}>
              <Route path="/blogs/create" element={<BlogCreatePage />} />
              <Route path="/blogs/:id/edit" element={<BlogEditPage />} />
            </Route>
          </Routes>
        </MainLayout>
      </AuthProvider>
    </Router>
  );
}

export default App;