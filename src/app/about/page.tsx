"use client";

import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import {useState} from "react";
import {AboutPageData} from "@/types/about";

export default function AboutUs() {
  // Update the state to include labels
  const [aboutData] = useState<AboutPageData>({
    heroSection: {
      title: "About Us",
      image: "/images/about-us-flag.jpg",
      story: ["SECO was founded with a vision to empower communities through sustainable development.", "Today, we work across multiple regions, partnering with communities to implement sustainable development projects."],
      stats: {
        projects: "500+",
        livesImpacted: "100K+",
      },
    },
    missionVision: {
      mission: "To harness potential of the rural poor to help themselves, assume control of local development and improve their standard of living.",
      vision: "A prosperous Balochistan where people especially the poor and women are provided with equal livelihood opportunities and are not socially and economically excluded.",
    },
    values: [
      {
        title: "Sustainability",
        description: "We believe in creating long-lasting positive impact through sustainable practices.",
      },
      {
        title: "Community First",
        description: "Every decision we make puts the community's needs at the forefront.",
      },
      {
        title: "Innovation",
        description: "We combine traditional wisdom with modern solutions for better outcomes.",
      },
    ],
    companyDetails: [
      {
        title: "Status of Company",
        content: "Large Scale Company (LSC)"
      },
      {
        title: "License Under Companies Act",
        content: [
          "License No: 791",
          "Date: 21 May 2015",
          "Type: Section 42 of the repealed Companies Ordinance, 1984 – Now Companies Act, 2017"
        ]
      },
      {
        title: "Investment Finance Services License",
        content: [
          "License No: SC/NBFC-171/BRSP/2021/02",
          "Date: 20 December 2020",
          "Type: Non-Banking Finance Company"
        ]
      },
      {
        title: "Registration Details",
        content: [
          "NTN NO: 3240280-5",
          "Old Registration No: Q-00062/19910404",
          "CUIN No: 0023763",
          "Date of Registration: 08-04-1991"
        ]
      },
      {
        title: "Industry Memberships",
        content: [
          "Pakistan Microfinance Network (PMN)",
          "Rural Support Programme Network (RSPN)"
        ]
      }
    ],
    labels: {
      companyDetails: "Company Details",
      values: {
        title: "Our Values"
      }
    },
  });

  // Move Values section above Company Details
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-20 pb-0">
        <div className="max-w-7xl mx-auto px-4 py-16">
          {aboutData?.heroSection?.title && (
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900">{aboutData.heroSection.title}</h1>
              <div className="w-20 h-1 bg-[#FFD700] mx-auto mt-4"></div>
            </div>
          )}

          {(aboutData?.heroSection?.image || aboutData?.heroSection?.story?.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
              {aboutData?.heroSection?.image && (
                <div className="relative h-[400px]">
                  <Image src={aboutData.heroSection.image} alt="About SECO" fill className="rounded-lg object-cover" />
                </div>
              )}
              {aboutData?.heroSection?.story?.length > 0 && (
                <div>
                  <h2 className="text-3xl font-semibold mb-6 text-gray-800">Our Story</h2>
                  {aboutData.heroSection.story.map(
                    (paragraph, index) =>
                      paragraph && (
                        <p key={index} className="text-gray-600 mb-6">
                          {paragraph}
                        </p>
                      )
                  )}
                  {(aboutData?.heroSection?.stats?.projects || aboutData?.heroSection?.stats?.livesImpacted) && (
                    <div className="grid grid-cols-2 gap-6 mt-8">
                      {aboutData?.heroSection?.stats?.projects && (
                        <div className="text-center">
                          <h3 className="text-4xl font-bold text-[#4B0082] mb-2">{aboutData.heroSection.stats.projects}</h3>
                          <p className="text-gray-600">Projects Completed</p>
                        </div>
                      )}
                      {aboutData?.heroSection?.stats?.livesImpacted && (
                        <div className="text-center">
                          <h3 className="text-4xl font-bold text-[#4B0082] mb-2">{aboutData.heroSection.stats.livesImpacted}</h3>
                          <p className="text-gray-600">Lives Impacted</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* After Mission/Vision section and before Company Details */}
          {(aboutData?.missionVision?.mission || aboutData?.missionVision?.vision) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
              {aboutData?.missionVision?.mission && (
                <div className="bg-gray-50 p-8 rounded-lg">
                  <h2 className="text-2xl font-semibold mb-4 text-[#4B0082]">Our Mission</h2>
                  <p className="text-gray-600">{aboutData.missionVision.mission}</p>
                </div>
              )}
              {aboutData?.missionVision?.vision && (
                <div className="bg-gray-50 p-8 rounded-lg">
                  <h2 className="text-2xl font-semibold mb-4 text-[#4B0082]">Our Vision</h2>
                  <p className="text-gray-600">{aboutData.missionVision.vision}</p>
                </div>
              )}
            </div>
          )}

          {/* Values Section */}
          {aboutData?.values?.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-semibold text-center mb-12 text-gray-800">{aboutData.labels.values.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {aboutData.values.map(
                  (value, index) =>
                    value && (
                      <div key={index} className="bg-gray-50 p-6 rounded-lg text-center">
                        {value.title && <h3 className="text-xl font-semibold mb-4 text-gray-800">{value.title}</h3>}
                        {value.description && <p className="text-gray-600">{value.description}</p>}
                      </div>
                    )
                )}
              </div>
            </div>
          )}

          {/* Company Details Section */}
          {aboutData?.companyDetails?.length > 0 && (
            <div className="bg-gray-50 p-8 rounded-lg mb-0">
              <h2 className="text-2xl font-semibold mb-6 text-[#4B0082]">{aboutData.labels.companyDetails}</h2>
              <div className="space-y-8">
                {aboutData.companyDetails.map((detail, index) => (
                  detail && (
                    <div key={index} className="space-y-2">
                      <h3 className="font-semibold text-gray-800 mb-2">{detail.title}</h3>
                      {Array.isArray(detail.content) ? (
                        <ul className="space-y-1">
                          {detail.content.map((item, idx) => (
                            <li key={idx} className="text-gray-600">{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-600">{detail.content}</p>
                      )}
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
