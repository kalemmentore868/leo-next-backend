"use client";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { db } from "@/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore";

interface Review {
  id: string;
  business_id: string;
  user_id: string;
  comment: string;
  rating: number;
  approved: boolean;
  created_at: string;
}

const Page = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const reviewsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reviewsCollection = collection(db, "Reviews");
        const reviewsSnapshot: QuerySnapshot<DocumentData> = await getDocs(
          reviewsCollection
        );
        const reviewsData = reviewsSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            business_id: data.business_id,
            user_id: data.user_id,
            comment: data.comment,
            rating: data.rating,
            approved: data.approved,
            created_at: data.created_at.toDate().toLocaleString(),
          } as Review;
        });
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching reviews: ", error);
      }
    };

    fetchData();
  }, []);

  const handleApproveChange = async (reviewId: string, approved: boolean) => {
    try {
      const reviewDoc = doc(db, "Reviews", reviewId);
      await updateDoc(reviewDoc, { approved });
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId ? { ...review, approved } : review
        )
      );
    } catch (error) {
      console.error("Error updating review approval: ", error);
    }
  };

  const handleRowClick = (review: Review) => {
    setSelectedReview(review);
  };

  const closeModal = () => {
    setSelectedReview(null);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  const filteredReviews = reviews.filter((review) =>
    review.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      <h1 className="text-xl font-bold mb-4 text-gray-800 text-left">
        Reviews
      </h1>

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
              <th className="py-2 px-4 text-left">Approved</th>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Business ID</th>
              <th className="py-2 px-4 text-left">User ID</th>
              <th className="py-2 px-4 text-left">Comment</th>
              <th className="py-2 px-4 text-left">Rating</th>
              <th className="py-2 px-4 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {currentReviews.map((review, index) => (
              <tr
                key={review.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                } hover:bg-gray-200 transition-colors cursor-pointer`}
                onClick={() => handleRowClick(review)}
              >
                <td
                  className="py-2 px-4 text-left"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={review.approved}
                    onChange={(e) =>
                      handleApproveChange(review.id, e.target.checked)
                    }
                  />
                </td>
                <td className="py-2 px-4">{truncateText(review.id, 5)}</td>
                <td className="py-2 px-4">
                  {truncateText(review.business_id, 5)}
                </td>
                <td className="py-2 px-4">{truncateText(review.user_id, 5)}</td>
                <td className="py-2 px-4 text-sm">
                  {truncateText(review.comment, 50)}
                </td>
                <td className="py-2 px-4 flex items-center gap-1">
                  {Array.from({ length: review.rating }, (_, index) => (
                    <FaStar key={index} className="text-yellow-500" />
                  ))}
                </td>
                <td className="py-2 px-4">
                  {new Date(review.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <nav>
          <ul className="inline-flex -space-x-px">
            {Array.from(
              { length: Math.ceil(filteredReviews.length / reviewsPerPage) },
              (_, index) => (
                <li key={index}>
                  <button
                    onClick={() => paginate(index + 1)}
                    className={`px-3 py-2 leading-tight ${
                      currentPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "bg-white text-blue-500"
                    } border border-gray-300 hover:bg-gray-100 hover:text-blue-700`}
                  >
                    {index + 1}
                  </button>
                </li>
              )
            )}
          </ul>
        </nav>
      </div>

      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Review Details</h2>
            <div className="flex flex-col gap-2">
              <p>
                <strong>ID:</strong> {selectedReview.id}
              </p>
              <p>
                <strong>Business ID:</strong> {selectedReview.business_id}
              </p>
              <p>
                <strong>User ID:</strong> {selectedReview.user_id}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(selectedReview.created_at).toLocaleDateString()}
              </p>
              <p>
                <strong>Comment:</strong> {selectedReview.comment}
              </p>
              <div className="flex items-center gap-1">
                <p>
                  <strong>Rating:</strong>
                </p>
                {Array.from({ length: selectedReview.rating }, (_, index) => (
                  <FaStar key={index} className="text-yellow-500" />
                ))}
              </div>
              <p>
                <strong>Approved:</strong>{" "}
                {selectedReview.approved ? "Yes" : "No"}
              </p>
            </div>
            <button
              onClick={closeModal}
              className="mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
