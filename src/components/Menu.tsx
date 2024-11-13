import Link from "next/link";
import { FaHome, FaUsers, FaStar, FaBullhorn, FaSignOutAlt } from "react-icons/fa"; // Import icons
import { IoBag } from "react-icons/io5";
import { FaShop } from "react-icons/fa6";
import { MdShoppingCart } from "react-icons/md";
import { BiSolidCategory } from "react-icons/bi";

const menuItems = [
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
        icon: <FaUsers />,
        label: "Users",
        href: "/list/users",
        visible: ["admin"],
      },
      {
        icon: <IoBag />,
        label: "Services",
        href: "/list/services",
        visible: ["admin"],
      },
      {
        icon: <MdShoppingCart />,
        label: "Products",
        href: "/list/products",
        visible: ["admin"],
      },
      {
        icon: <FaStar />,
        label: "Reviews",
        href: "/list/reviews",
        visible: ["admin"],
      },
      {
        icon: <FaBullhorn />,
        label: "Announcements",
        href: "/list/announcements",
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
        href: "/logout",
        visible: ["admin"],
      },
    ],
  },
];

const Menu = () => {
  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
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