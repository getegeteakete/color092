import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("admin_authenticated");
    if (!isAuthenticated) {
      navigate("/admin");
    }
  }, [navigate]);

  const isAuthenticated = sessionStorage.getItem("admin_authenticated");
  
  if (!isAuthenticated) {
    return null;
  }

  return <AdminLayout>{children}</AdminLayout>;
};

export default ProtectedRoute;
