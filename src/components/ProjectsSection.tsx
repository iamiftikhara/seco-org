'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/types/projects';
import { projectUtils } from '@/utils/projects';

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await projectUtils.getHomePageProjects();
      if (response.success) {
        setProjects(response.data);
      }
    };
    fetchProjects();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Our Projects</h2>
          <Link 
            href="/projects" 
            className="px-6 py-2 bg-[#4B0082] text-white rounded-lg hover:bg-[#3B0062] transition-colors"
          >
            View All Projects
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Link href={`/projects/${project.slug}`} key={project.id}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={project.featuredImage}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-[#4B0082]">{project.category}</span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      project.status === 'ongoing' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm">{project.shortDescription}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}