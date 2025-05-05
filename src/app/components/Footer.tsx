"use client";

import Image from "next/image";
import Link from "next/link";
import {theme} from "@/config/theme";
import {footerData} from "@/data/footer";
import * as Fa from "react-icons/fa";

export default function Footer() {
  const IconMap: {[key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>>} = {
    FaFacebook: Fa.FaFacebook,
    FaTwitter: Fa.FaTwitter,
    FaInstagram: Fa.FaInstagram,
    FaLinkedin: Fa.FaLinkedin,
  };

  const getIcon = (iconName: string) => {
    const Icon = IconMap[iconName];
    return Icon ? <Icon className="w-5 h-5" /> : null;
  };

  const renderColumn = (column: (typeof footerData.columns)[0]) => {
    switch (column.type) {
      case "text":
        return (
          <>
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image src={footerData.logo.image} alt={footerData.logo.alt} width={footerData.logo.width} height={footerData.logo.height} className="object-contain" />
                <div className="flex flex-col">
                  <span className="text-[#FFD700] text-2xl font-bold ml-2" style={{color: theme.colors.secondary}}>
                    {footerData.logoTitle.title.text}
                  </span>
                  <span className="text-sm font-bold ml-2" style={{color: theme.colors.secondary}}>
                    {footerData.logoTitle.subTitle.text}
                  </span>
                </div>
              </Link>
            </div>
            <p className="text-gray-400 leading-relaxed">{column.content.text?.text}</p>
          </>
        );
      case "links":
        return (
          <ul className="space-y-3">
            {column.content.links?.map((link, index) => (
              <li key={index}>
                <Link href={link.url} className="text-gray-400 hover:text-white transition-colors duration-300">
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        );
      case "contact":
        return (
          <ul className="space-y-3 text-gray-400">
            {column.content.contact?.address.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
            <li>
              <a href={`tel:${column.content.contact?.phone}`} className="hover:text-white transition-colors duration-300">
                {column.content.contact?.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${column.content.contact?.email}`} className="hover:text-white transition-colors duration-300">
                {column.content.contact?.email}
              </a>
            </li>
          </ul>
        );
      case "social":
        return (
          <div className="flex flex-wrap gap-4">
            {column.content.social?.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  backgroundColor: `${theme.colors.primary}40`,
                  color: theme.colors.text.light,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.primaryHover;
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${theme.colors.primary}40`;
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                {getIcon(social.icon)}
              </a>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <footer style={{backgroundColor: theme.colors.primary}}>
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {footerData.columns.map((column, index) => (
            <div key={index}>
              {column.type === "text" ? (
                <>
                  <div className="flex items-center mb-4">
                    <Link href="/" className="flex items-center">
                      <Image src={footerData.logo.image} alt={footerData.logo.alt} width={footerData.logo.width} height={footerData.logo.height} className="object-contain" />
                      <div className="flex flex-col">
                        <span className="text-[#FFD700] text-2xl font-bold ml-2" style={{color: theme.colors.secondary}}>
                          {footerData.logoTitle.title.text}
                        </span>
                        <span className="text-sm font-bold ml-2" style={{color: theme.colors.secondary}}>
                          {footerData.logoTitle.subTitle.text}
                        </span>
                      </div>
                    </Link>
                  </div>
                  <h3 className="text-lg font-bold mb-6" style={{color: theme.colors.secondary}}>
                    {column.title.text}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">{column.content.text?.text}</p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-bold mb-6" style={{color: theme.colors.secondary}}>
                    {column.title.text}
                  </h3>
                  {renderColumn(column)}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t" style={{borderColor: `${theme.colors.text.light}20`}}>
          <p className="text-center text-sm" style={{color: `${theme.colors.text.light}80`}}>
            {footerData.copyright.text}
          </p>
        </div>
      </div>
    </footer>
  );
}
