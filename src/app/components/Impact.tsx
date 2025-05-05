'use client';

import { useState } from 'react';
import CountUp from 'react-countup';
import { impactStats, impactSection } from '@/data/impact';

export default function Impact() {
  const [stats] = useState(impactStats.filter(stat => stat.isActive).sort((a, b) => a.order - b.order));
  const [section] = useState(impactSection);

  return (
    <section className="relative">
      {/* Background Image with Overlay */}
      <div className="h-[50vh] relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${section.backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        {/* Title Section - Centered */}
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{section.title}</h2>
            <div className="w-24 h-1 bg-[#FFD700] mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Plain background section */}
      <div className="bg-gray-50 h-[25vh]"></div>

      {/* Stats Grid - Overlapping both sections */}
      <div className="absolute left-0 right-0 top-[40vh]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={index} 
                  className="bg-white rounded-lg p-6 text-center transform hover:-translate-y-2 transition-all duration-300 shadow-xl"
                >
                  <div className="flex justify-center mb-4">
                    <IconComponent className="w-12 h-12 text-[#FFD700]" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    <CountUp
                      end={stat.value}
                      duration={2.5}
                      separator=","
                    />
                    {stat.suffix && <span className="ml-1">{stat.suffix}</span>}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}