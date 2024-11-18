"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !role?.admin)) {
      router.push("/signin");
    }
  }, [user, role, loading, router]);

  if (loading) {
    return <div>Loading...</div>; // Add a spinner or skeleton UI.
  }

  return user && role?.admin ? <>{children}</> : null;
};

export default AdminRoute;
