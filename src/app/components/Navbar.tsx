"use client";

import Link from "next/link";
import Image from "next/image";
import {useState, useEffect} from "react";
import {theme} from "@/config/theme";
import {navbarData} from "@/data/navbar";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Handler to check screen width
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1000);
    };

    // Initial check
    handleResize();

    // Listen for resize
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, section: string) => {
  //   e.preventDefault();
  //   const element = document.getElementById(section);
  //   if (element) {
  //     element.scrollIntoView({behavior: "smooth"});
  //     setIsOpen(false);
  //   }
  // };

  return (
    <nav className="bg-[#4B0082] shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image src={navbarData.logo.image} alt={navbarData.logo.alt} width={navbarData.logo.width} height={navbarData.logo.height} className="object-contain" />
              <div className="flex flex-col">
                <span className="text-[#FFD700] text-2xl font-bold ml-2" style={{color: theme.colors.secondary}}>
                  {navbarData.logoTitle.title.text}
                </span>
                <span className="text-sm font-bold ml-2" style={{color: theme.colors.secondary}}>
                  {navbarData.logoTitle.subTitle.text}
                </span>
              </div>
            </Link>
          </div>

          {/* Mobile menu button */}
          {isMobile && (
            <div className="flex items-center">
              <button onClick={() => setIsOpen(!isOpen)} className="text-[#FFD700]">
                <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${isOpen ? "rotate-45 translate-y-1" : ""}`}></span>
                <span className={`block h-0.5 w-6 bg-current transition-all duration-300 mt-1 ${isOpen ? "opacity-0" : ""}`}></span>
                <span className={`block h-0.5 w-6 bg-current transition-all duration-300 mt-1 ${isOpen ? "-rotate-45 -translate-y-1" : ""}`}></span>
              </button>
            </div>
          )}

          {/* Desktop menu */}
          {!isMobile && (
            <div className="flex md:items-center md:space-x-4">
              {["home", "about", "services", "programs", "events", "gallery", "blog", "contact"].map((item) => (
                <Link
                  key={item}
                  href={item === "home" ? "/" : `/${item}`}
                  className="px-3 py-2 transition-colors capitalize"
                  style={{color: theme.colors.secondary, fontFamily: theme.fonts.en.secondary}}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = theme.colors.text.light;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = theme.colors.secondary;
                  }}
                >
                  {item}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {isMobile && (
          <div className={` ${isOpen ? "block" : "hidden"}`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {["home", "about", "programs", "impact", "events", "gallery", "blog", "contact"].map((item) => (
                <Link
                  key={item}
                  href={item === "home" ? "/" : `/${item}`}
                  className="block px-3 py-2 rounded transition-colors capitalize"
                  style={{color: theme.colors.secondary, fontFamily: theme.fonts.en.secondary}}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = theme.colors.text.light;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = theme.colors.secondary;
                  }}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
