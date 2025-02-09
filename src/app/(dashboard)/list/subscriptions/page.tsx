"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  DocumentData,
  QuerySnapshot,
  query,
  where,
} from "firebase/firestore";

interface Subscription {
  id: string;
  business_id: string;
  business_name: string;
  coupon_id: string;
  date_created: string;
  expiry_date: string;
  status: "active" | "expired" | "pending";
  subscription_type: "yearly" | "monthly";
  total: number;
  type: "subscription";
  type_id: string;
  updated_at: string;
  was_discount_applied: boolean;
}

export default function Page() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersCollection = collection(db, "Orders");

        // Query to get only documents where type == "subscription"
        const q = query(ordersCollection, where("type", "==", "subscription"));

        const ordersSnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

        // Fetch all business names concurrently
        const ordersData = await Promise.all(
          ordersSnapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();
            const business_name = await fetchBusinessName(data.type_id); // ✅ Await the business name

            return {
              id: docSnap.id,
              business_id: data.business_id,
              type_id: data.type_id,
              subscription_type: data.subscription_type,
              total: data.total,
              status: data.status,
              coupon_id: data.coupon_id,
              was_discount_applied: data.was_discount_applied,
              date_created: data.date_created.toDate(),
              expiry_date: data.expiry_date.toDate(),
              business_name,
            };
          })
        );

        //@ts-ignore
        setSubscriptions(ordersData);
      } catch (error) {
        console.error("Error fetching orders: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchBusinessName = async (businessId: string): Promise<string> => {
    try {
      const businessDoc = doc(db, "Businesses", businessId);
      const businessSnapshot = await getDoc(businessDoc);

      return businessSnapshot.exists()
        ? businessSnapshot.data().name || "N/A"
        : "N/A";
    } catch (error) {
      console.error("Error fetching business name: ", error);
      return "N/A";
    }
  };

  const updateStatus = async (
    subscriptionId: string,
    newStatus: "active" | "expired" | "pending"
  ) => {
    try {
      const subscriptionDoc = doc(db, "Orders", subscriptionId);
      await updateDoc(subscriptionDoc, { status: newStatus });

      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === subscriptionId ? { ...sub, status: newStatus } : sub
        )
      );
    } catch (error) {
      console.error("Error updating status: ", error);
    }
  };

  const filteredSubscriptions = subscriptions.filter(
    (subscription) =>
      subscription.business_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      subscription.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return <div className="p-6 text-gray-600">Loading subscriptions...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      <h1 className="text-xl font-bold mb-4 text-gray-800 text-left">
        Subscriptions
      </h1>

      <div className="mb-4 w-full max-w-md">
        <div className="flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
          <input
            type="text"
            placeholder="Search by business name..."
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
              <th className="py-2 px-4 text-left">Order Id</th>
              <th className="py-2 px-4 text-left">Start Date</th>
              <th className="py-2 px-4 text-left">End Date</th>
              <th className="py-2 px-4 text-left">Total</th>
              <th className="py-2 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubscriptions.map((subscription, index) => (
              <tr
                key={subscription.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                } hover:bg-gray-200 transition-colors`}
              >
                <td className="py-2 px-4 text-left">
                  {subscription.business_name}
                </td>
                <td className="py-2 px-4 text-left">{subscription.id}</td>
                <td className="py-2 px-4 text-left">
                  {new Date(subscription.date_created).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 text-left">
                  {new Date(subscription.expiry_date).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 text-left">${subscription.total}</td>
                <td className="py-2 px-4 text-left">
                  <select
                    value={subscription.status}
                    onChange={(e) =>
                      updateStatus(
                        subscription.id,
                        e.target.value as "active" | "expired" | "pending"
                      )
                    }
                    className="p-1 border rounded-md"
                  >
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="pending">Pending</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
