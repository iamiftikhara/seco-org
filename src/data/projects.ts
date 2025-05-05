import { Project } from '@/types/projects';

export const projects: Project[] = [
  {
    id: '1',
    title: 'Rural Development Initiative',
    slug: 'rural-development-initiative',
    shortDescription: 'Empowering rural communities through sustainable development practices',
    fullDescription: 'Detailed description of the rural development initiative...',
    featuredImage: '/images/projects/rural-dev.jpg',
    category: 'Rural Development',
    status: 'ongoing',
    startDate: '2023-01-01',
    location: 'Pishin District',
    budget: '10M PKR',
    beneficiaries: '5000+',
    showOnHomepage: true,
    impact: [
      { label: 'Villages', value: '25', suffix: '+' },
      { label: 'Families', value: '1200', suffix: '+' }
    ],
    keyHighlights: [
      'Community mobilization',
      'Infrastructure development',
      'Skills training'
    ],
    gallery: [
      '/images/projects/rural-dev-1.jpg',
      '/images/projects/rural-dev-2.jpg'
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  // Add more projects...
];