"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { db } from "@/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  DocumentData,
  QuerySnapshot,
  getDoc,
} from "firebase/firestore";

interface Special {
  id: string;
  businessName: string;
  title: string;
  description: string;
  image_url: string;
  status: string;
  created_at: string;
}

const Page = () => {
  const [specials, setSpecials] = useState<Special[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSpecial, setSelectedSpecial] = useState<Special | null>(null);
  const specialsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const specialsCollection = collection(db, "Specials");
        const specialsSnapshot: QuerySnapshot<DocumentData> = await getDocs(
          specialsCollection
        );
        const specialsData = await Promise.all(
          specialsSnapshot.docs.map(async (doc) => {
            const data = doc.data();

            const businessName = await fetchBusinessData(data.business_id);
            return {
              id: doc.id,
              businessName,
              title: data.title,
              description: data.description,
              image_url: data.image_url,
              status: data.status,
              created_at: data.created_at.toDate().toLocaleDateString(),
            };
          })
        );
        setSpecials(specialsData);
      } catch (error) {
        console.error("Error fetching specials: ", error);
      }
    };

    fetchData();
  }, []);

  const fetchBusinessData = async (businessId: string): Promise<string> => {
    try {
      const businessDoc = doc(db, "Businesses", businessId);
      const businessSnapshot = await getDoc(businessDoc);

      if (businessSnapshot.exists()) {
        return businessSnapshot.data().name || "N/A";
      } else {
        console.warn(`Business with ID ${businessId} not found.`);
        return "N/A";
      }
    } catch (error) {
      console.error("Error fetching business data: ", error);
      return "N/A";
    }
  };

  const handleRowClick = (special: Special) => {
    setSelectedSpecial(special);
  };

  const closeModal = () => {
    setSelectedSpecial(null);
  };

  const filteredspecials = specials.filter(
    (product) =>
      product.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProduct = currentPage * specialsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - specialsPerPage;
  const currentspecials = filteredspecials.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      <h1 className="text-xl font-bold mb-4 text-gray-800 text-left">
        Specials
      </h1>

      <div className="mb-4 w-full max-w-md">
        <div className="flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
          <input
            type="text"
            placeholder="Search specials..."
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
              <th className="py-2 px-4 text-left">Business Name</th>
              <th className="py-2 px-4 text-left">Image</th>
              <th className="py-2 px-4 text-left">Title</th>
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Date Created</th>
            </tr>
          </thead>
          <tbody>
            {currentspecials.map((special, index) => (
              <tr
                key={special.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                } hover:bg-gray-200 transition-colors cursor-pointer`}
                onClick={() => handleRowClick(special)}
              >
                <td className="py-2 px-4 text-left">{special.businessName}</td>
                <td className="py-2 px-4 text-left">
                  <Image
                    src={special.image_url || "/default-image.png"} // Use a placeholder
                    alt={special.image_url || "special Image"}
                    width={50}
                    height={50}
                    className="rounded-md"
                  />
                </td>
                <td className="py-2 px-4 text-left">{special.title}</td>
                <td className="py-2 px-4 text-left">
                  {truncateText(special.description, 50)}
                </td>
                <td className="py-2 px-4 text-left">{special.status}</td>
                <td className="py-2 px-4 text-left">{special.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <nav>
          <ul className="inline-flex -space-x-px">
            {Array.from(
              { length: Math.ceil(filteredspecials.length / specialsPerPage) },
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

      {selectedSpecial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Special Details</h2>
            <div className="mb-4">
              <Image
                src={selectedSpecial.image_url ? selectedSpecial.image_url : ""}
                alt={selectedSpecial.title}
                width={100}
                height={100}
                className="rounded-md"
              />
            </div>
            <p>
              <strong>ID:</strong> {selectedSpecial.id}
            </p>
            <p>
              <strong>Business Name:</strong> {selectedSpecial.businessName}
            </p>
            <p>
              <strong>Title:</strong> {selectedSpecial.title}
            </p>
            <p>
              <strong>Description:</strong> {selectedSpecial.description}
            </p>
            <p>
              <strong>Status:</strong> {selectedSpecial.status}
            </p>
            <p>
              <strong>Date Created:</strong> {selectedSpecial.created_at}
            </p>
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
