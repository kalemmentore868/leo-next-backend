"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/firebase';
import {
  collection,
  getDocs,
  DocumentData,
  QuerySnapshot,
} from 'firebase/firestore';

interface Subscription {
  id: string;
  business_id: string;
  plan_type: 'free' | 'premium';
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export default function Page() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subscriptionsCollection = collection(db, 'Subscriptions');
        const subscriptionsSnapshot: QuerySnapshot<DocumentData> = await getDocs(subscriptionsCollection);
        const subscriptionsData = subscriptionsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            business_id: data.business_id,
            plan_type: data.plan_type,
            start_date: data.start_date,
            end_date: data.end_date,
            created_at: data.created_at,
            updated_at: data.updated_at,
          } as Subscription;
        });
        // Sort subscriptions by end_date in ascending order
        subscriptionsData.sort((a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime());
        setSubscriptions(subscriptionsData);
      } catch (error) {
        console.error('Error fetching subscriptions: ', error);
      }
    };

    fetchData();
  }, []);

  const handleRowClick = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
  };

  const closeModal = () => {
    setSelectedSubscription(null);
  };

  const filteredSubscriptions = subscriptions.filter(subscription =>
    subscription.business_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      <h1 className="text-xl font-bold mb-4 text-gray-800 text-left">Subscriptions</h1>

      <div className="mb-4 w-full max-w-md">
        <div className="flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
          <input
            type="text"
            placeholder="Search by business ID..."
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
              <th className="py-2 px-4 text-left">Business ID</th>
              <th className="py-2 px-4 text-left">Plan Type</th>
              <th className="py-2 px-4 text-left">Start Date</th>
              <th className="py-2 px-4 text-left">End Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubscriptions.map((subscription, index) => (
              <tr key={subscription.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'} hover:bg-gray-200 transition-colors cursor-pointer`} onClick={() => handleRowClick(subscription)}>
                <td className="py-2 px-4 text-left">{subscription.business_id}</td>
                <td className="py-2 px-4 text-left">{subscription.plan_type}</td>
                <td className="py-2 px-4 text-left">{new Date(subscription.start_date).toLocaleDateString()}</td>
                <td className="py-2 px-4 text-left">{new Date(subscription.end_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Subscription Details</h2>
            <div className="flex flex-col gap-2">
              <p><strong>ID:</strong> {selectedSubscription.id}</p>
              <p><strong>Business ID:</strong> {selectedSubscription.business_id}</p>
              <p><strong>Plan Type:</strong> {selectedSubscription.plan_type}</p>
              <p><strong>Start Date:</strong> {new Date(selectedSubscription.start_date).toLocaleDateString()}</p>
              <p><strong>End Date:</strong> {new Date(selectedSubscription.end_date).toLocaleDateString()}</p>
              <p><strong>Created At:</strong> {new Date(selectedSubscription.created_at).toLocaleDateString()}</p>
              <p><strong>Updated At:</strong> {new Date(selectedSubscription.updated_at).toLocaleDateString()}</p>
            </div>
            <button onClick={closeModal} className="mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}