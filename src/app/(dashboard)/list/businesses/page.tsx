"use client";
import React, { useState } from 'react';
import Image from 'next/image';

interface Business {
  id: number;
  name: string;
  email: string;
  category: string;
  profileImage: string;
  approved: boolean;
}

const businesses: Business[] = [
  { id: 1, name: 'Tech Solutions', email: 'contact@techsolutions.com', category: 'IT Services', profileImage: 'https://randomuser.me/api/portraits/men/1.jpg', approved: true },
  { id: 2, name: 'Green Grocers', email: 'info@greengrocers.com', category: 'Grocery', profileImage: 'https://randomuser.me/api/portraits/women/2.jpg', approved: false },
  { id: 3, name: 'Auto Fix', email: 'support@autofix.com', category: 'Automotive', profileImage: 'https://randomuser.me/api/portraits/men/3.jpg', approved: true },
  { id: 4, name: 'Health First', email: 'hello@healthfirst.com', category: 'Healthcare', profileImage: 'https://randomuser.me/api/portraits/women/4.jpg', approved: false },
  // Add more businesses as needed
];

const Page = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const businessesPerPage = 10;

  const filteredBusinesses = businesses.filter(business =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastBusiness = currentPage * businessesPerPage;
  const indexOfFirstBusiness = indexOfLastBusiness - businessesPerPage;
  const currentBusinesses = filteredBusinesses.slice(indexOfFirstBusiness, indexOfLastBusiness);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      <h1 className="text-xl font-bold mb-4 text-gray-800 text-left">Businesses</h1>

      <div className="mb-4 w-full max-w-md">
        <div className="flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
          <Image src="/search.png" alt="" width={14} height={14} />
          <input
            type="text"
            placeholder="Search businesses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 bg-transparent outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Profile</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Approved</th>
            </tr>
          </thead>
          <tbody>
            {currentBusinesses.map((business, index) => (
              <tr key={business.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'} hover:bg-gray-200 transition-colors`}>
                <td className="py-2 px-4 text-left">{business.id}</td>
                <td className="py-2 px-4 text-left">
                  <Image src={business.profileImage} alt={business.name} width={40} height={40} className="rounded-full" />
                </td>
                <td className="py-2 px-4 text-left">{business.name}</td>
                <td className="py-2 px-4 text-left">{business.email}</td>
                <td className="py-2 px-4 text-left">{business.category}</td>
                <td className="py-2 px-4 text-left">
                  <input type="checkbox" checked={business.approved} readOnly />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <nav>
          <ul className="inline-flex -space-x-px">
            {Array.from({ length: Math.ceil(filteredBusinesses.length / businessesPerPage) }, (_, index) => (
              <li key={index}>
                <button
                  onClick={() => paginate(index + 1)}
                  className={`px-3 py-2 leading-tight ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'} border border-gray-300 hover:bg-gray-100 hover:text-blue-700`}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Page;