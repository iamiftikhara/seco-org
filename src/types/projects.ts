export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  featuredImage: string;
  category: string;
  status: 'ongoing' | 'completed';
  startDate: string;
  endDate?: string;
  location: string;
  budget?: string;
  beneficiaries?: string;
  showOnHomepage: boolean;
  impact?: {
    label: string;
    value: string;
    suffix?: string;
  }[];
  keyHighlights?: string[];
  gallery?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}