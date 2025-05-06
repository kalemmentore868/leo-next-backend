"use client";

import { useAuth } from "@/src/context/AuthProvider";
import { useRouter } from "next/navigation";
import React, { useEffect, ReactNode } from "react";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { admin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!admin) {
      router.push("/signin");
    }
  }, [admin, router]);

  return admin ? <>{children}</> : null;
};

export default AdminRoute;
