'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function About() {
  const [aboutData, setAboutData] = useState({
    title: 'About SECO',
    description: 'Supporting communities through sustainable development initiatives',
    image: '/images/about.jpg',
    stats: [
      { label: 'Communities Served', value: '1000+' },
      { label: 'Projects Completed', value: '500+' },
      { label: 'Team Members', value: '100+' }
    ]
  });

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch('/api/content/about');
        const data = await response.json();
        if (data) setAboutData(data);
      } catch (error) {
        console.error('Error fetching about data:', error);
      }
    };
    fetchAboutData();
  }, []);

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px]">
            <Image
              src={aboutData.image}
              alt="About SECO"
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-lg"
            />
          </div>
          <div>
            <h2 className="text-4xl font-bold mb-6">{aboutData.title}</h2>
            <p className="text-gray-600 mb-8">{aboutData.description}</p>
            <div className="grid grid-cols-3 gap-4">
              {aboutData.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}