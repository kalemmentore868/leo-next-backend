"use client";

import React, { useEffect, useState } from "react";
import UserCard from "@/src/components/UserCard";
import MessageList from "@/src/components/MessageList";
import { MdShoppingCart } from "react-icons/md";
import { IoPeopleSharp, IoBag } from "react-icons/io5";
import { FaShop, FaDollarSign } from "react-icons/fa6";
import { Timestamp } from "firebase/firestore";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AdminService } from "@/src/data/services/AdminService";
import { User } from "@/src/types/User";
import { Business } from "@/src/types/Business";

interface DailyCount {
  date: string;
  count: number;
}

const formatTimestamp = (createdAt: any): string => {
  if (!createdAt) return "N/A";

  // If it's a Firestore timestamp (seconds & nanoseconds)
  if (typeof createdAt === "object" && "seconds" in createdAt) {
    return new Date(createdAt.seconds * 1000).toLocaleDateString();
  }

  // If it's already a string, return it directly
  if (typeof createdAt === "string") {
    return new Date(createdAt).toLocaleDateString();
  }

  return "Invalid Date";
};

const AdminPage = () => {
  const [productL, setProductL] = useState<number>(0);
  const [userL, setUserL] = useState<number>(0);
  const [businessL, setBusinessL] = useState<number>(0);
  const [serviceL, setServiceL] = useState<number>(0);
  const [specialsL, setSpecialsL] = useState<number>(0);
  const [userData, setUserData] = useState<User[]>([]);
  const [businessData, setBusinessData] = useState<Business[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("AUTH_TOKEN");

        const stats = await AdminService.getAdminPageStats(`${token}`);

        if (stats) {
          setProductL(stats.totalProducts);
          setUserL(stats.totalUsers);
          setBusinessL(stats.totalBusinesses);
          setServiceL(stats.totalServices);
          setBusinessData(stats.allBusinesses);
          setUserData(stats.allUsers);
          setSpecialsL(stats.totalSpecials);
        }
      } catch (error) {}
    };
    fetchData();
  }, []);

  const calculateDailyCounts = (
    data: { created_at: string }[]
  ): DailyCount[] => {
    const counts: Record<string, number> = {};
    data.forEach(({ created_at }) => {
      counts[created_at] = (counts[created_at] || 0) + 1;
    });
    return Object.entries(counts).map(([date, count]) => ({
      date,
      count,
    }));
  };

  const userDailyCounts = calculateDailyCounts(userData as any);
  const businessDailyCounts = calculateDailyCounts(businessData as any);

  const color1 = ["#7C00FE", "#3b82f6"];
  const color2 = ["#FFAF00", "#F5004F"];

  return (
    <div className="p-6 bg-gray-100 flex flex-col gap-6 md:flex-row text-gray-800">
      {/* LEFT PANEL */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* User Cards */}
        <div className="flex gap-6 flex-wrap">
          <UserCard
            type="user"
            date={new Date().toLocaleDateString()}
            color="#7C00FE"
            count={userL}
            Icon={<IoPeopleSharp className="text-2xl text-white" />}
          />
          <UserCard
            type="business"
            date={new Date().toLocaleDateString()}
            color="#3b82f6"
            count={businessL}
            Icon={<FaShop className="text-2xl text-white" />}
          />
          <UserCard
            type="product"
            date={new Date().toLocaleDateString()}
            color="#FFAF00"
            count={productL}
            Icon={<MdShoppingCart className="text-2xl text-white" />}
          />
          <UserCard
            type="service"
            date={new Date().toLocaleDateString()}
            color="#F5004F"
            count={serviceL}
            Icon={<IoBag className="text-2xl text-white" />}
          />
          <UserCard
            type="special"
            date={new Date().toLocaleDateString()}
            color="oklch(62.7% 0.194 149.214)"
            count={specialsL}
            Icon={<FaDollarSign className="text-2xl text-white" />}
          />
        </div>

        {/* Pie Charts */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 h-[350px] shadow-lg rounded-lg bg-white p-4">
            <h3 className="text-gray-600 font-bold mb-4">
              User vs. Business Distribution
            </h3>
            <div className="h-full">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={[
                      { name: "Users", value: userL },
                      { name: "Businesses", value: businessL },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                  >
                    {color1.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex-1 h-[350px] shadow-lg rounded-lg bg-white p-4">
            <h3 className="text-gray-600 font-bold mb-4">
              Product vs. Service Distribution
            </h3>
            <div className="h-full">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={[
                      { name: "Products", value: productL },
                      { name: "Services", value: serviceL },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                  >
                    {color2.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bar Charts */}
        {/* <div className="flex flex-col gap-8">
          <div className="h-[350px] shadow-lg rounded-lg bg-white p-4">
            <h3 className="text-gray-600 font-bold mb-4">
              User Registration Trend
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={userDailyCounts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Registrations" fill="#7C00FE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="h-[350px] shadow-lg rounded-lg bg-white p-4">
            <h3 className="text-gray-600 font-bold mb-4">
              Business Registration Trend
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={businessDailyCounts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Registrations" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>*/}
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/3">
        <MessageList />
      </div>
    </div>
  );
};

export default AdminPage;
