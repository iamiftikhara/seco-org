'use client';

import { useState } from 'react';
import { theme } from '@/config/theme';
import Link from 'next/link';
import { 
  DocumentTextIcon,
  PhotoIcon,
  NewspaperIcon,
  BriefcaseIcon,
  UserGroupIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

interface ContentSection {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  count?: number;
}

export default function ContentManagement() {
  const sections: ContentSection[] = [
    {
      id: 'programs',
      title: 'Programs',
      description: 'Manage program listings and details',
      icon: BriefcaseIcon,
      href: '/admin/content/programs',
    },
    {
      id: 'services',
      title: 'Services',
      description: 'Update service offerings and information',
      icon: BuildingOfficeIcon,
      href: '/admin/content/services',
    },
    {
      id: 'blog',
      title: 'Blog Posts',
      description: 'Create and edit blog content',
      icon: DocumentTextIcon,
      href: '/admin/content/blog',
    },
    {
      id: 'gallery',
      title: 'Gallery',
      description: 'Manage image gallery and media',
      icon: PhotoIcon,
      href: '/admin/content/gallery',
    },
    {
      id: 'testimonials',
      title: 'Testimonials',
      description: 'Update client testimonials',
      icon: UserGroupIcon,
      href: '/admin/content/testimonials',
    },
    {
      id: 'partners',
      title: 'Partners',
      description: 'Manage partner organizations',
      icon: BuildingOfficeIcon,
      href: '/admin/content/partners',
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 
          className="text-2xl font-bold mb-2"
          style={{ color: theme.colors.text.primary }}
        >
          Content Management
        </h1>
        <p 
          className="text-sm"
          style={{ color: theme.colors.text.secondary }}
        >
          Manage and update website content sections
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link 
              key={section.id}
              href={section.href}
              className="group block"
            >
              <div 
                className="p-6 rounded-lg transition-all duration-200 hover:shadow-md"
                style={{ backgroundColor: theme.colors.background.secondary }}
              >
                <div className="flex items-start">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${theme.colors.primary}15` }}
                  >
                    <Icon 
                      className="w-6 h-6"
                      style={{ color: theme.colors.primary }}
                    />
                  </div>
                  <div className="ml-4">
                    <h3 
                      className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors duration-200"
                      style={{ color: theme.colors.text.primary }}
                    >
                      {section.title}
                    </h3>
                    <p 
                      className="text-sm"
                      style={{ color: theme.colors.text.secondary }}
                    >
                      {section.description}
                    </p>
                    {section.count !== undefined && (
                      <span 
                        className="text-xs mt-2 inline-block px-2 py-1 rounded"
                        style={{ 
                          backgroundColor: `${theme.colors.primary}15`,
                          color: theme.colors.primary
                        }}
                      >
                        {section.count} items
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}