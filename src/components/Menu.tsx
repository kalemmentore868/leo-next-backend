"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaHome,
  FaUsers,
  FaStar,
  FaSignOutAlt,
  FaUserAlt,
} from "react-icons/fa"; // Import icons
import { CgProfile } from "react-icons/cg";
import { RiCoupon2Fill } from "react-icons/ri";
import { IoBag } from "react-icons/io5";
import { FaShop } from "react-icons/fa6";
import { MdShoppingCart } from "react-icons/md";
import { MdOutlinePayment } from "react-icons/md";
import { BiSolidCategory } from "react-icons/bi";
import { FcInvite } from "react-icons/fc";
import { MdPayments } from "react-icons/md";
import { getAuth, signOut } from "firebase/auth";
import { app } from "@/firebase"; // Import your Firebase configuration
import { useAuth } from "@/src/context/AuthProvider"; // Import the useAuth hook
import { HiCash } from "react-icons/hi";
import { IoBookmarkOutline } from "react-icons/io5";

interface MenuItem {
  icon: JSX.Element;
  label: string;
  href: string;
  visible: string[];
  onClick?: (router: any) => Promise<void>;
}

const menuItems: { title: string; items: MenuItem[] }[] = [
  {
    title: "MENU",
    items: [
      {
        icon: <FaHome />,
        label: "Home",
        href: "/admin",
        visible: ["admin"],
      },
      {
        icon: <FaShop />,
        label: "Businesses",
        href: "/list/businesses",
        visible: ["admin"],
      },
      {
        icon: <FaUserAlt />,
        label: "Auth",
        href: "/list/auth",
        visible: ["admin"],
      },
      {
        icon: <FaUsers />,
        label: "Users",
        href: "/list/users",
        visible: ["admin"],
      },
      {
        icon: <CgProfile />,
        label: "Referral Profiles",
        href: "/list/referral-profiles",
        visible: ["admin"],
      },
      {
        icon: <RiCoupon2Fill />,
        label: "Coupons",
        href: "/list/coupons",
        visible: ["admin"],
      },
      {
        icon: <FcInvite />,
        label: "Referral Invites",
        href: "/list/referral-invites",
        visible: ["admin"],
      },
      {
        icon: <MdOutlinePayment />,
        label: "Payout",
        href: "/list/payouts",
        visible: ["admin"],
      },
      {
        icon: <IoBag />,
        label: "Services",
        href: "/list/services",
        visible: ["admin"],
      },
      {
        icon: <IoBookmarkOutline />,
        label: "Booking Services",
        href: "/list/booking",
        visible: ["admin"],
      },
      {
        icon: <MdShoppingCart />,
        label: "Products",
        href: "/list/products",
        visible: ["admin"],
      },
      {
        icon: <HiCash />,
        label: "Specials",
        href: "/list/specials",
        visible: ["admin"],
      },
      {
        icon: <FaStar />,
        label: "Reviews",
        href: "/list/reviews",
        visible: ["admin"],
      },
      {
        icon: <MdPayments />,
        label: "Orders",
        href: "/list/subscriptions",
        visible: ["admin"],
      },
      {
        icon: <BiSolidCategory />,
        label: "Categories",
        href: "/list/categories",
        visible: ["admin"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: <FaSignOutAlt />,
        label: "Logout",
        href: "#",
        visible: ["admin"],
        onClick: async (router: any) => {
          const auth = getAuth(app);
          await signOut(auth);
          router.push("/signin");
        },
      },
    ],
  },
];

const Menu = () => {
  const router = useRouter();
  const { admin } = useAuth(); // Get the authenticated admin from the AuthContext
  // const { role } = useAuth(); // Get the user's role from the AuthContext

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          {i.items.map((item) => {
            if (item.visible.includes("admin") && !admin) {
              return null; // Hide the item if the user is not an admin
            }
            if (item.onClick) {
              return (
                <button
                  key={item.label}
                  onClick={() => item.onClick!(router)}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-gray-100"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="hidden lg:block">{item.label}</span>
                </button>
              );
            }
            return (
              <Link
                href={item.href}
                key={item.label}
                className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-gray-100"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
