import Image from "next/image";
import { ReactNode } from "react";

interface UserCardProps {
  type: string;
  date: string;
  color: string;
  count: number;
  Icon: ReactNode; // Update Icon prop type to ReactNode
}

const UserCard: React.FC<UserCardProps> = ({ type, date, color, count, Icon }) => {
  return (
    <div className="rounded-2xl p-4 flex-1 min-w-[130px]" style={{ backgroundColor: color }}>
      <div className="flex justify-between items-center">
        {Icon}
      </div>
      <h1 className="text-2xl font-semibold my-4 text-white">{count.toLocaleString()}</h1>
      <h2 className="capitalize text-sm font-medium text-white">{type}s</h2>
    </div>
  );
};

export default UserCard;