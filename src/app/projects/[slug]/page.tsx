'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Project } from '@/types/projects';
import { projectUtils } from '@/utils/projects';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export default function ProjectDetail() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      const response = await projectUtils.getProjectBySlug(params.slug as string);
      if (response.success) {
        setProject(response.data);
      }
      setLoading(false);
    };

    if (params.slug) {
      fetchProject();
    }
  }, [params.slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!project) {
    return <div className="min-h-screen flex items-center justify-center">Project not found</div>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pb-20">
        <div className="relative h-[50vh]">
          <Image
            src={project.featuredImage}
            alt={project.title}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-medium text-[#4B0082]">{project.category}</span>
              <span className={`px-4 py-2 rounded-full ${
                project.status === 'ongoing' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {project.status}
              </span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{project.title}</h1>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-8">
              <div className="text-center">
                <p className="text-gray-600">Location</p>
                <p className="font-semibold">{project.location}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600">Start Date</p>
                <p className="font-semibold">{new Date(project.startDate).toLocaleDateString()}</p>
              </div>
              {project.budget && (
                <div className="text-center">
                  <p className="text-gray-600">Budget</p>
                  <p className="font-semibold">{project.budget}</p>
                </div>
              )}
              {project.beneficiaries && (
                <div className="text-center">
                  <p className="text-gray-600">Beneficiaries</p>
                  <p className="font-semibold">{project.beneficiaries}</p>
                </div>
              )}
            </div>

            <div className="prose max-w-none mt-8">
              <p className="text-gray-600 leading-relaxed">{project.fullDescription}</p>
            </div>

            {project.keyHighlights && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Key Highlights</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.keyHighlights.map((highlight, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-[#4B0082] rounded-full mr-3"></span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.gallery && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Project Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {project.gallery.map((image, index) => (
                    <div key={index} className="relative h-64">
                      <Image
                        src={image}
                        alt={`${project.title} gallery image ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}