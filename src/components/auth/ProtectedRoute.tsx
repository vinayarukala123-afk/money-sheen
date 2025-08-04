import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const authData = localStorage.getItem('financeAuth');
    if (!authData) {
      navigate('/');
    }
  }, [navigate]);

  const authData = localStorage.getItem('financeAuth');
  if (!authData) {
    return null;
  }

  return <>{children}</>;
};