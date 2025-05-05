import { FaMapMarked, FaProjectDiagram, FaCheckCircle, FaUsers } from 'react-icons/fa';

export const impactSection = {
  id: '1',
  title: 'We Can Make A Difference',
  backgroundImage: '/images/impact-bg.jpg',
  isActive: true,
  updatedAt: new Date()
};

export const impactStats = [
  { 
    id: '1',
    value: 32, 
    label: 'Districts', 
    suffix: '',
    icon: FaMapMarked,
    isActive: true,
    order: 1
  },
  { 
    id: '2',
    value: 14, 
    label: 'Ongoing Projects', 
    suffix: '',
    icon: FaProjectDiagram,
    isActive: true,
    order: 2
  },
  { 
    id: '3',
    value: 195, 
    label: 'Completed Projects', 
    suffix: '',
    icon: FaCheckCircle,
    isActive: true,
    order: 3
  },
  { 
    id: '4',
    value: 8, 
    label: 'Total Beneficiaries', 
    suffix: 'Million',
    icon: FaUsers,
    isActive: true,
    order: 4
  }
];