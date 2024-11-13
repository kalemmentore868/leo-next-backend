"use client";
import React, { useEffect } from "react";
import UserCard from "@/src/components/UserCard";
import MessageList from "@/src/components/MessageList";
import { MdShoppingCart } from "react-icons/md";
import { IoPeopleSharp } from "react-icons/io5";
import { FaShop } from "react-icons/fa6";
import { IoBag } from "react-icons/io5";

import { db, storage } from '@/firebase';

import {
  collection,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  WithFieldValue,
  DocumentData,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
} from 'firebase/storage';


const AdminPage = () => {
  const [productL, setProductL] = React.useState<number>(0);
  const [userL, setUserL] = React.useState<number>(0);
  const [businessL, setBusinessL] = React.useState<number>(0);
  const [serviceL, setServiceL] = React.useState<number>(0);

  

  // get current year and month
  const getCurrentYearMonth = (): string => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-11
    return `${year}-${month}`;
  };
  const currentYearMonth = getCurrentYearMonth();

  useEffect(() => {
    // fetch data
    const fetchData = async () => {
      try {
        
        // get all products
        const productQuery = query(collection(db, 'Products'));
        const productSnapshot = await getDocs(productQuery);
        setProductL(productSnapshot.size);

        // get all users
        const userQuery = query(collection(db, 'Users'));
        const userSnapshot = await getDocs(userQuery);
        setUserL(userSnapshot.size);

        // get all businesses
        const businessQuery = query(collection(db, 'Businesses'));
        const businessSnapshot = await getDocs(businessQuery);
        setBusinessL(businessSnapshot.size);

        // get all services
        const serviceQuery = query(collection(db, 'Services'));
        const serviceSnapshot = await getDocs(serviceQuery);
        setServiceL(serviceSnapshot.size);

      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="user" date={currentYearMonth} color="#7C00FE" count={userL} Icon={<IoPeopleSharp className="text-[50px]  px-2 py-1 text-white" />} />
          <UserCard type="businesse" date={currentYearMonth} color="#3b82f6" count={businessL} Icon={<FaShop className="text-[50px]  px-2 py-1 text-white" />} />
          <UserCard type="product" date={currentYearMonth} color="#FFAF00" count={productL} Icon={<MdShoppingCart className="text-[50px]  px-2 py-1 text-white" />} />
          <UserCard type="service" date={currentYearMonth} color="#F5004F" count={serviceL} Icon={<IoBag className="text-[50px]  px-2 py-1 text-white" />} />
        </div>
        {/* Messages List */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3 h-[450px]">
            
          </div>
          {/* ATTENDANCE CHART */}
          <div className="w-full lg:w-2/3 h-[450px]">
            
          </div>
        </div>
        {/* BOTTOM CHART */}
        <div className="w-full h-[500px]">
          
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <MessageList />
      </div>
    </div>
  );
};

export default AdminPage;