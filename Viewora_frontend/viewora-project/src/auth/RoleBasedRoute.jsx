import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function RoleBasedRoute({ children, role }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  if (!user) return <Navigate to="/login" />;

  if (role && user.role !== role) {
    return <Navigate to="/profile" />;
  }

  return children;
}
