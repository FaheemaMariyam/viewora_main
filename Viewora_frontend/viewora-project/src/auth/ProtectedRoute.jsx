

import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) return null; //  WAIT until /profile finishes

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
