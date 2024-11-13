"use client";
import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import Image from 'next/image';

interface Review {
  id: number;
  businessName: string;
  userName: string;
  rating: number;
  comment: string;
  profileImage: string;
  approved: boolean;
}

const reviews: Review[] = [
  { id: 1, businessName: 'Tech Solutions', userName: 'John Doe', rating: 5, comment: 'Excellent service!', profileImage: 'https://randomuser.me/api/portraits/men/1.jpg', approved: true },
  { id: 2, businessName: 'Green Grocers', userName: 'Jane Smith', rating: 4, comment: 'Great quality products.', profileImage: 'https://randomuser.me/api/portraits/women/2.jpg', approved: false },
  { id: 3, businessName: 'Auto Fix', userName: 'Alice Johnson', rating: 3, comment: 'Average experience.', profileImage: 'https://randomuser.me/api/portraits/women/3.jpg', approved: true },
  { id: 4, businessName: 'Health First', userName: 'Bob Brown', rating: 2, comment: 'Not satisfied with the service.', profileImage: 'https://randomuser.me/api/portraits/men/4.jpg', approved: false },
  // Add more reviews as needed
];

const Page = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;

  const filteredReviews = reviews.filter(review =>
    review.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      <h1 className="text-xl font-bold mb-4 text-gray-800 text-left">Reviews</h1>

      <div className="mb-4 w-full max-w-md">
        <div className="flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
          <input
            type="text"
            placeholder="Search reviews..."
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
              <th className="py-2 px-4 text-left">Approved</th>
              <th className="py-2 px-4 text-left">Business Name</th>
              <th className="py-2 px-4 text-left">User</th>
              <th className="py-2 px-4 text-left">Comment</th>
              <th className="py-2 px-4 text-left">Rating</th>
            </tr>
          </thead>
          <tbody>
            {currentReviews.map((review, index) => (
              <tr key={review.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'} hover:bg-gray-200 transition-colors`}>
                <td className="py-2 px-4">{review.id}</td>
                <td className="py-2 px-4">
                  <input type="checkbox" checked={review.approved}  />
                </td>
                <td className="py-2 px-4">{review.businessName}</td>
                <td className="py-2 px-4 flex items-center gap-2">
                  <Image src={review.profileImage} alt={review.userName} width={24} height={24} className="rounded-full" />
                  <span>{review.userName}</span>
                </td>
                <td className="py-2 px-4">{review.comment}</td>
                <td className="py-2 px-4 flex items-center gap-1">
                  {Array.from({ length: review.rating }, (_, index) => (
                    <FaStar key={index} className="text-yellow-500" />
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <nav>
          <ul className="inline-flex -space-x-px">
            {Array.from({ length: Math.ceil(filteredReviews.length / reviewsPerPage) }, (_, index) => (
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