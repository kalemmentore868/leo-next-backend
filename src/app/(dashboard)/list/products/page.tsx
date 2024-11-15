"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { db } from '@/firebase';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  DocumentData,
  QuerySnapshot,
} from 'firebase/firestore';

interface Product {
  id: string;
  business_id: string;
  name: string;
  description: string;
  display_image_url: string;
  price_amount: number;
  approved: boolean;
}

interface PriceData {
  item_id: string;
  price_amount: number;
}

const Page = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const productsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsCollection = collection(db, 'Products');
        const productsSnapshot: QuerySnapshot<DocumentData> = await getDocs(productsCollection);
        const productsData = await Promise.all(
          productsSnapshot.docs.map(async (doc) => {
            const data = doc.data();
            const priceData = await fetchPriceData(doc.id);
            return {
              id: doc.id,
              business_id: data.business_id,
              name: data.name,
              description: data.description,
              display_image_url: data.display_image_url,
              price_amount: priceData.price_amount,
              approved: data.approved,
            } as Product;
          })
        );
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products: ', error);
      }
    };

    fetchData();
  }, []);

  const fetchPriceData = async (productId: string): Promise<PriceData> => {
    const priceCollection = collection(db, 'Prices');
    const priceSnapshot = await getDocs(priceCollection);
    const priceData = priceSnapshot.docs
      .map(doc => doc.data() as PriceData)
      .find(price => price.item_id === productId);
    return priceData || { item_id: productId, price_amount: 0 };
  };

  const handleApproveChange = async (productId: string, approved: boolean) => {
    try {
      const productDoc = doc(db, 'Products', productId);
      await updateDoc(productDoc, { approved });
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === productId ? { ...product, approved } : product
        )
      );
    } catch (error) {
      console.error('Error updating product approval: ', error);
    }
  };

  const handleRowClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.business_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      <h1 className="text-xl font-bold mb-4 text-gray-800 text-left">Products</h1>

      <div className="mb-4 w-full max-w-md">
        <div className="flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
          <input
            type="text"
            placeholder="Search products..."
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
              <th className="py-2 px-4 text-left">Image</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-left">Price</th>
              <th className="py-2 px-4 text-left">Business ID</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product, index) => (
              <tr key={product.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'} hover:bg-gray-200 transition-colors cursor-pointer`} onClick={() => handleRowClick(product)}>
                <td className="py-2 px-4 text-left" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={product.approved}
                    onChange={(e) => handleApproveChange(product.id, e.target.checked)}
                  />
                </td>
                <td className="py-2 px-4 text-left">
                  <Image src={product.display_image_url} alt={product.name} width={50} height={50} className="rounded-md" />
                </td>
                <td className="py-2 px-4 text-left">{product.name}</td>
                <td className="py-2 px-4 text-left">{truncateText(product.description, 50)}</td>
                <td className="py-2 px-4 text-left">${product.price_amount.toFixed(2)}</td>
                <td className="py-2 px-4 text-left">{product.business_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <nav>
          <ul className="inline-flex -space-x-px">
            {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, index) => (
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

      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Product Details</h2>
            <div className="mb-4">
              <Image src={selectedProduct.display_image_url} alt={selectedProduct.name} width={100} height={100} className="rounded-md" />
            </div>
            <p><strong>ID:</strong> {selectedProduct.id}</p>
            <p><strong>Business ID:</strong> {selectedProduct.business_id}</p>
            <p><strong>Name:</strong> {selectedProduct.name}</p>
            <p><strong>Description:</strong> {selectedProduct.description}</p>
            <p><strong>Price:</strong> ${selectedProduct.price_amount.toFixed(2)}</p>
            <p><strong>Approved:</strong> {selectedProduct.approved ? 'Yes' : 'No'}</p>
            <button onClick={closeModal} className="mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;