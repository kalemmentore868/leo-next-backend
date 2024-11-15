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

interface Service {
  business_id: string;
  id: string;
  name: string;
  description: string;
  display_image_url: string;
  price_amount: number;
  price_unit: string;
  approved: boolean;
}

interface PriceData {
  item_id: string;
  price_amount: number;
  price_unit: string;
}

const Page = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const servicesPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesCollection = collection(db, 'Services');
        const servicesSnapshot: QuerySnapshot<DocumentData> = await getDocs(servicesCollection);
        const servicesData = await Promise.all(
          servicesSnapshot.docs.map(async (doc) => {
            const data = doc.data();
            const priceData = await fetchPriceData(doc.id);
            return {
              business_id: data.business_id,
              id: doc.id,
              name: data.name,
              description: data.description,
              display_image_url: data.display_image_url,
              price_amount: priceData.price_amount,
              price_unit: priceData.price_unit,
              approved: data.approved,
            } as Service;
          })
        );
        setServices(servicesData);
      } catch (error) {
        console.error('Error fetching services: ', error);
      }
    };

    fetchData();
  }, []);

  const fetchPriceData = async (serviceId: string): Promise<PriceData> => {
    const priceCollection = collection(db, 'Prices');
    const priceSnapshot = await getDocs(priceCollection);
    const priceData = priceSnapshot.docs
      .map(doc => doc.data() as PriceData)
      .find(price => price.item_id === serviceId);
    return priceData || { item_id: serviceId, price_amount: 0, price_unit: '' };
  };

  const handleApproveChange = async (serviceId: string, approved: boolean) => {
    try {
      const serviceDoc = doc(db, 'Services', serviceId);
      await updateDoc(serviceDoc, { approved });
      setServices(prevServices =>
        prevServices.map(service =>
          service.id === serviceId ? { ...service, approved } : service
        )
      );
    } catch (error) {
      console.error('Error updating service approval: ', error);
    }
  };

  const handleRowClick = (service: Service) => {
    setSelectedService(service);
  };

  const closeModal = () => {
    setSelectedService(null);
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.business_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const formatPriceUnit = (priceUnit: string) => {
    switch (priceUnit) {
      case 'per_hour':
        return 'hr';
      case 'per_week':
        return 'wk';
      default:
        return priceUnit;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      <h1 className="text-xl font-bold mb-4 text-gray-800 text-left">Services</h1>

      <div className="mb-4 w-full max-w-md">
        <div className="flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
          <input
            type="text"
            placeholder="Search services..."
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
            {currentServices.map((service, index) => (
              <tr key={service.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'} hover:bg-gray-200 transition-colors cursor-pointer`} onClick={() => handleRowClick(service)}>
                <td className="py-2 px-4 text-left" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={service.approved}
                    onChange={(e) => handleApproveChange(service.id, e.target.checked)}
                  />
                </td>
                <td className="py-2 px-4 text-left">
                  <Image src={service.display_image_url} alt={service.name} width={50} height={50} className="rounded-md" />
                </td>
                <td className="py-2 px-4 text-left">{service.name}</td>
                <td className="py-2 px-4 text-left">{service.description}</td>
                <td className="py-2 px-4 text-left">${service.price_amount.toFixed(2)} / {formatPriceUnit(service.price_unit)}</td>
                <td className="py-2 px-4 text-left">{service.business_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <nav>
          <ul className="inline-flex -space-x-px">
            {Array.from({ length: Math.ceil(filteredServices.length / servicesPerPage) }, (_, index) => (
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

      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Service Details</h2>
            <div className="mb-4">
              <Image src={selectedService.display_image_url} alt={selectedService.name} width={100} height={100} className="rounded-md" />
            </div>
            <p><strong>ID:</strong> {selectedService.id}</p>
            <p><strong>Business ID:</strong> {selectedService.business_id}</p>
            <p><strong>Name:</strong> {selectedService.name}</p>
            <p><strong>Description:</strong> {selectedService.description}</p>
            <p><strong>Price:</strong> ${selectedService.price_amount.toFixed(2)} / {formatPriceUnit(selectedService.price_unit)}</p>
            <p><strong>Approved:</strong> {selectedService.approved ? 'Yes' : 'No'}</p>
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