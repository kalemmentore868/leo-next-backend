"use client";

import React from 'react';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to Leo Management System</h1>
      <p className="text-lg text-gray-600 mb-8">Manage your business efficiently and effectively.</p>
      <Link href="/signin" legacyBehavior>
        <a className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors">
          Sign In
        </a>
      </Link>
    </div>
  );
};

export default HomePage;