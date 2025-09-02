"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiFileText, FiSettings, FiUsers, FiImage, FiMessageSquare, FiCalendar, FiChevronDown, FiTarget } from "react-icons/fi";
import { theme } from "@/config/theme";
import { useState } from "react";

const menuItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: FiHome },
  {
    href: "/admin/content",
    label: "Home Page",
    icon: FiFileText,
    children: [
      { href: "/admin/content/header", label: "Header Section" },
      { href: "/admin/content/hero", label: "Hero Section" },
      { href: "/admin/content/impact", label: "Impact" },
      { href: "/admin/content/gallery", label: "Gallery" },
      { href: "/admin/content/testimonials", label: "Testimonials" },
      { href: "/admin/partners", label: "Partners", icon: FiUsers },
      { href: "/admin/content/contact", label: "Contact Section" },
      { href: "/admin/content/footer", label: "Footer" },
    ],
  },
  { href: "/admin/users", label: "Users", icon: FiUsers },
  { href: "/admin/messages", label: "Messages", icon: FiMessageSquare },
  { href: "/admin/events", label: "Events", icon: FiCalendar },
  { href: "/admin/blogs", label: "Blogs", icon: FiFileText },
  { href: "/admin/services", label: "Services", icon: FiFileText },
  { href: "/admin/programs", label: "Programs", icon: FiTarget },
  { href: "/admin/gallery", label: "Gallery", icon: FiImage },
  { href: "/admin/settings", label: "Settings", icon: FiSettings },
];

export default function AdminNav() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (href: string) => {
    setOpenDropdown(openDropdown === href ? null : href);
  };

  return (
    <nav className="p-4 space-y-1">
      {menuItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        const hasChildren = item.children && item.children.length > 0;
        const isOpen = openDropdown === item.href;

        return (
          <div key={item.href}>
            <Link
              href={hasChildren ? "#" : item.href}
              onClick={hasChildren ? () => toggleDropdown(item.href) : undefined}
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
              className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors duration-200`}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className="w-5 h-5"
                  style={{
                    color: isActive ? theme.colors.secondary : theme.colors.text.light,
                  }}
                />
                <span className="font-medium">{item.label}</span>
              </div>
              {hasChildren && (
                <FiChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isOpen ? "transform rotate-180" : ""
                  }`}
                />
              )}
            </Link>
            {hasChildren && isOpen && (
              <div className="ml-8 mt-1 space-y-1">
                {item.children.map((child) => {
                  const isChildActive = pathname === child.href;
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      style={{
                        backgroundColor: isChildActive ? `${theme.colors.secondary}20` : "transparent",
                        color: isChildActive ? theme.colors.secondary : theme.colors.text.light,
                      }}
                      className="flex items-center px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-opacity-10"
                    >
                      <span className="font-medium text-sm">{child.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
