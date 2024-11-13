import UserCard from "@/components/UserCard";
import MessageList from "@/components/MessageList";
import { MdShoppingCart } from "react-icons/md";
import { IoPeopleSharp } from "react-icons/io5";
import { FaShop } from "react-icons/fa6";
import { IoBag } from "react-icons/io5";

const AdminPage = () => {
  // get current year and month
  const getCurrentYearMonth = (): string => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-11
    return `${year}-${month}`;
  };
  const currentYearMonth = getCurrentYearMonth();

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="user" date={currentYearMonth} color="#7C00FE" count={20} Icon={<IoPeopleSharp className="text-[50px]  px-2 py-1 text-white" />} />
          <UserCard type="businesse" date={currentYearMonth} color="#3b82f6" count={20} Icon={<FaShop className="text-[50px]  px-2 py-1 text-white" />} />
          <UserCard type="product" date={currentYearMonth} color="#FFAF00" count={20} Icon={<MdShoppingCart className="text-[50px]  px-2 py-1 text-white" />} />
          <UserCard type="service" date={currentYearMonth} color="#F5004F" count={20} Icon={<IoBag className="text-[50px]  px-2 py-1 text-white" />} />
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