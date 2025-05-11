"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {FiHome, FiFileText, FiSettings, FiUsers, FiImage, FiMessageSquare, FiCalendar} from "react-icons/fi";
import {theme} from "@/config/theme";

const menuItems = [
  {href: "/admin/dashboard", label: "Dashboard", icon: FiHome},
  {href: "/admin/content", label: "Content", icon: FiFileText},
  {href: "/admin/users", label: "Users", icon: FiUsers},
  {href: "/admin/media", label: "Media", icon: FiImage},
  {href: "/admin/messages", label: "Messages", icon: FiMessageSquare},
  {href: "/admin/events", label: "Events", icon: FiCalendar},
  {href: "/admin/settings", label: "Settings", icon: FiSettings},
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="p-4 space-y-1">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              backgroundColor: isActive ? `${theme.colors.secondary}20` : "transparent",
              color: isActive ? theme.colors.secondary : theme.colors.text.light,
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = theme.colors.primaryHover;
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200`}
          >
            <Icon
              className="w-5 h-5"
              style={{
                color: isActive ? theme.colors.secondary : theme.colors.text.light,
              }}
            />
            <span className="font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
