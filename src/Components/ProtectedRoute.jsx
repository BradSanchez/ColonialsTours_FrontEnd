import { useAuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false, guideOnly = false }) => {
  const { isAuthenticated, user, loading } = useAuthContext();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/profile" replace />;
  }

  if (guideOnly && user?.role !== 'guide') {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default ProtectedRoute;