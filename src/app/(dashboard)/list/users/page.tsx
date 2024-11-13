"use client";
import React, { useState } from 'react';
import Image from 'next/image';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  profileImage: string;
}

const users: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', profileImage: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: 3, name: 'Alice Johnson', email: 'alice@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/women/3.jpg' },
  { id: 4, name: 'Bob Brown', email: 'bob@example.com', role: 'Admin', profileImage: 'https://randomuser.me/api/portraits/men/4.jpg' },
  { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/men/5.jpg' },
  { id: 6, name: 'Diana Evans', email: 'diana@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/women/6.jpg' },
  { id: 7, name: 'Ethan Foster', email: 'ethan@example.com', role: 'Admin', profileImage: 'https://randomuser.me/api/portraits/men/7.jpg' },
  { id: 8, name: 'Fiona Green', email: 'fiona@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/women/8.jpg' },
  { id: 9, name: 'George Harris', email: 'george@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/men/9.jpg' },
  { id: 10, name: 'Hannah Irving', email: 'hannah@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/women/10.jpg' },
  { id: 11, name: 'Ian Johnson', email: 'ian@example.com', role: 'Admin', profileImage: 'https://randomuser.me/api/portraits/men/11.jpg' },
  { id: 12, name: 'Julia King', email: 'julia@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/women/12.jpg' },
  { id: 13, name: 'Kevin Lee', email: 'kevin@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/men/13.jpg' },
  { id: 14, name: 'Laura Miller', email: 'laura@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/women/14.jpg' },
  { id: 15, name: 'Michael Nelson', email: 'michael@example.com', role: 'Admin', profileImage: 'https://randomuser.me/api/portraits/men/15.jpg' },
  { id: 16, name: 'Nina Owens', email: 'nina@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/women/16.jpg' },
  { id: 17, name: 'Oscar Perez', email: 'oscar@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/men/17.jpg' },
  { id: 18, name: 'Paula Quinn', email: 'paula@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/women/18.jpg' },
  { id: 19, name: 'Quincy Roberts', email: 'quincy@example.com', role: 'Admin', profileImage: 'https://randomuser.me/api/portraits/men/19.jpg' },
  { id: 20, name: 'Rachel Scott', email: 'rachel@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/women/20.jpg' },
  { id: 21, name: 'Steve Turner', email: 'steve@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/men/21.jpg' },
  { id: 22, name: 'Tina Underwood', email: 'tina@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/women/22.jpg' },
  { id: 23, name: 'Ulysses Vance', email: 'ulysses@example.com', role: 'Admin', profileImage: 'https://randomuser.me/api/portraits/men/23.jpg' },
  { id: 24, name: 'Victoria White', email: 'victoria@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/women/24.jpg' },
  { id: 25, name: 'William Xander', email: 'william@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/men/25.jpg' },
  { id: 26, name: 'Xena Young', email: 'xena@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/women/26.jpg' },
  { id: 27, name: 'Yvonne Zane', email: 'yvonne@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/women/27.jpg' },
  { id: 28, name: 'Zachary Adams', email: 'zachary@example.com', role: 'Admin', profileImage: 'https://randomuser.me/api/portraits/men/28.jpg' },
  { id: 29, name: 'Amy Brown', email: 'amy@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/women/29.jpg' },
  { id: 30, name: 'Brian Clark', email: 'brian@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/men/30.jpg' },
  { id: 31, name: 'Catherine Davis', email: 'catherine@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/women/31.jpg' },
  { id: 32, name: 'David Evans', email: 'david@example.com', role: 'Admin', profileImage: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 33, name: 'Ella Foster', email: 'ella@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/women/33.jpg' },
  { id: 34, name: 'Frank Green', email: 'frank@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/men/34.jpg' },
  { id: 35, name: 'Grace Harris', email: 'grace@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/women/35.jpg' },
  { id: 36, name: 'Henry Irving', email: 'henry@example.com', role: 'Admin', profileImage: 'https://randomuser.me/api/portraits/men/36.jpg' },
  { id: 37, name: 'Isla Johnson', email: 'isla@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/women/37.jpg' },
  { id: 38, name: 'Jack King', email: 'jack@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/men/38.jpg' },
  { id: 39, name: 'Kara Lee', email: 'kara@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/women/39.jpg' },
  { id: 40, name: 'Liam Miller', email: 'liam@example.com', role: 'Admin', profileImage: 'https://randomuser.me/api/portraits/men/40.jpg' },
  { id: 41, name: 'Mia Nelson', email: 'mia@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/women/41.jpg' },
  { id: 42, name: 'Noah Owens', email: 'noah@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/men/42.jpg' },
  { id: 43, name: 'Olivia Perez', email: 'olivia@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/women/43.jpg' },
  { id: 44, name: 'Paul Quinn', email: 'paul@example.com', role: 'Admin', profileImage: 'https://randomuser.me/api/portraits/men/44.jpg' },
  { id: 45, name: 'Quinn Roberts', email: 'quinn@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/men/45.jpg' },
  { id: 46, name: 'Riley Scott', email: 'riley@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/women/46.jpg' },
  { id: 47, name: 'Samuel Turner', email: 'samuel@example.com', role: 'Admin', profileImage: 'https://randomuser.me/api/portraits/men/47.jpg' },
  { id: 48, name: 'Tara Underwood', email: 'tara@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/women/48.jpg' },
  { id: 49, name: 'Umar Vance', email: 'umar@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/men/49.jpg' },
  { id: 50, name: 'Vera White', email: 'vera@example.com', role: 'User', profileImage: 'https://randomuser.me/api/portraits/women/50.jpg' },
];

const Page = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={user.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'} hover:bg-gray-200 transition-colors`}>
                <td className="py-2 px-4 text-left">{user.id}</td>
                <td className="py-2 px-4 text-left">
                  <Image src={user.profileImage} alt={user.name} width={40} height={40} className="rounded-full" />
                </td>
                <td className="py-2 px-4 text-left">{user.name}</td>
                <td className="py-2 px-4 text-left">{user.email}</td>
                <td className="py-2 px-4 text-left">{user.role}</td>
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