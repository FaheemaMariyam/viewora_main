import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  if (!user || !user.is_superuser) {
    return <Navigate to="/login" />;
  }

  return children;
}
