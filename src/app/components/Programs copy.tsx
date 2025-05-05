'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Programs() {
  const [programs, setPrograms] = useState([
    {
      title: 'Community Development',
      description: 'Supporting sustainable community initiatives',
      image: '/images/program1.jpg',
      link: '/programs/community'
    },
    {
      title: 'Education Support',
      description: 'Providing educational opportunities',
      image: '/images/program2.jpg',
      link: '/programs/education'
    },
    {
      title: 'Healthcare Access',
      description: 'Improving healthcare accessibility',
      image: '/images/program3.jpg',
      link: '/programs/healthcare'
    },
    {
      title: 'Economic Empowerment',
      description: 'Creating economic opportunities',
      image: '/images/program4.jpg',
      link: '/programs/economic'
    }
  ]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Our Programs</h2>
          <div className="w-20 h-1 bg-yellow-500 mx-auto mt-4"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((program, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48">
                <Image
                  src={program.image}
                  alt={program.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{program.title}</h3>
                <p className="text-gray-600 mb-4">{program.description}</p>
                <a
                  href={program.link}
                  className="inline-block bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors duration-300"
                >
                  Learn More
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}