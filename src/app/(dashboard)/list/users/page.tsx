"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { db } from '@/firebase';
import {
  collection,
  getDocs,
} from 'firebase/firestore';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  isbusiness: boolean;
  email: string;
  role: {
    business: boolean;
    customer: boolean;
    admin: boolean;
  };
  display_picture_url: string;
}

const Page = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersCollection = collection(db, 'Users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersData = usersSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            first_name: data.first_name,
            last_name: data.last_name,
            username: data.username,
            isbusiness: data.isbusiness,
            email: data.email,
            role: data.role,
            display_picture_url: data.display_picture_url,
          } as User;
        });
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users: ', error);
      }
    };

    fetchData();
  }, []);

  const formatRoles = (role: { business: boolean; customer: boolean; admin: boolean }) => {
    const roles = [];
    if (role.business) roles.push('business');
    if (role.customer) roles.push('customer');
    if (role.admin) roles.push('admin');
    return roles.join(' / ');
  };

  const filteredUsers = users.filter(user =>
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      <h1 className="text-xl font-bold mb-4 text-gray-800 text-left">Users</h1>

      <div className="mb-4 w-full max-w-md">
        <div className="flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
          <Image src="/search.png" alt="" width={14} height={14} />
          <input
            type="text"
            placeholder="Search users..."
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
              <th className="py-2 px-4 text-left">Username</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={user.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'} hover:bg-gray-200 transition-colors`}>
                <td className="py-2 px-4 text-left">{user.id}</td>
                <td className="py-2 px-4 text-left">
                  <div className="w-10 h-10 relative">
                    <Image src={user.display_picture_url || '/avatar.png'} alt={user.username} layout="fill" objectFit="cover" className="rounded-full" />
                  </div>
                </td>
                <td className="py-2 px-4 text-left">
                {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : 'Nil'}
                </td>
                <td className="py-2 px-4 text-left">
                  {user.username || 'Nil'}
                </td>
                <td className="py-2 px-4 text-left">
                  {user.email || 'Nil'}
                </td>
                <td className="py-2 px-4 text-left">{formatRoles(user.role)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <nav>
          <ul className="inline-flex -space-x-px">
            {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, index) => (
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