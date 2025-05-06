// context/AuthContext.tsx
"use client";

import { useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, getIdToken } from "firebase/auth";
import { AdminService } from "../data/services/AdminService";
import { auth } from "@/firebase";
import { Admin } from "../types/Admin";
import { AuthContextInstance } from "./AuthContext";

const LS_KEY = "leo-admin-cache";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(() => {
    // first paint -> grab cached value (if any)
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(LS_KEY);
      if (cached) {
        try {
          return JSON.parse(cached) as Admin;
        } catch (_) {}
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (admin) localStorage.setItem(LS_KEY, JSON.stringify(admin));
    else localStorage.removeItem(LS_KEY);
  }, [admin]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await getIdToken(firebaseUser);
        setLoading(true);
        try {
          const admin = await AdminService.getAuthenticatedAdmin(token);
          if (admin) {
            setAdmin(admin);
          } else {
            setAdmin(null);
          }
        } catch (err) {
          console.error("Error fetching admin:", err);
          setAdmin(null);
        } finally {
          setLoading(false);
        }
      } else {
        setAdmin(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContextInstance.Provider value={{ admin, loading, setAdmin }}>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="loader"></div>
        </div>
      ) : (
        <>{children}</>
      )}
    </AuthContextInstance.Provider>
  );
};

export const useAuth = () => useContext(AuthContextInstance);
