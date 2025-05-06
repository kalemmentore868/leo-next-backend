"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import Image from "next/image";
import { AdminService } from "@/src/data/services/AdminService";
import { useAuth } from "@/src/context/AuthProvider";

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { setAdmin } = useAuth();

  const handleSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    e.preventDefault();
    setError("");
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (user) {
        const token = await user.user.getIdToken();
        localStorage.setItem("AUTH_TOKEN", token);
        const admin = await AdminService.getAuthenticatedAdmin(token);
        if (admin) {
          setAdmin(admin);
          router.push("/admin");
        }
      } else {
        setError("Invalid email or password");
      }
    } catch (err: any) {
      setError(err.message);
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 mb-4">
            <Image src="/logo.png" alt="Logo" width={100} height={100} />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Sign In
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-semibold"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-semibold"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            onClick={handleSignIn}
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors font-semibold"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
