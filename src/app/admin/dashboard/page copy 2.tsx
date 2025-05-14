'use client';

import { theme } from '@/config/theme';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLoader from '../components/DashboardLoader';
import { 
  CalendarIcon, 
  DocumentTextIcon, 
  LanguageIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  MapPinIcon,
  WrenchScrewdriverIcon,
  NewspaperIcon // Add this import
} from '@heroicons/react/24/outline';

interface EventTitle {
  text: string;
  language: 'en' | 'ur';
}

interface ServiceTitle {
  text: string;
  language: 'en' | 'ur';
}

interface ProgramTitle {
  text: string;
  language: 'en' | 'ur';
}

interface Event {
  id: string;
  title: EventTitle;
  language: 'en' | 'ur';
  date: string;
  status: 'upcoming' | 'past';
  location: {
    text: string;
    language: string;
  };
  showOnHome: boolean;
  isActive: boolean;
}

interface Service {
  id: string;
  title: ServiceTitle;
  shortDescription: {
    text: string;
    language: string;
  };
  language: 'en' | 'ur';
  isActive: boolean;
  showOnHomepage: boolean;
}

interface Program {
  id: string;
  title: ProgramTitle;
  language: 'en' | 'ur';
  category: {
    text: string;
    language: string;
  };
  isActive: boolean;
  showOnHomepage: boolean;
}

interface EventsResponse {
  success: boolean;
  data: {
    eventsList: Event[];
    eventsPage: {
      en: { title: string; description: string };
      ur: { title: string; description: string };
      hero: { image: string; alt: string };
    };
  };
}

interface ServiceResponse {
  success: boolean;
  data: {
    servicePage: {
      title: {
        en: { text: string; language: string };
        ur: { text: string; language: string };
      };
      description: {
        en: { text: string; language: string };
        ur: { text: string; language: string };
      };
    };
    servicesList: Service[];
  };
}

interface ProgramResponse {
  success: boolean;
  data: {
    programPage: {
      title: {
        en: { text: string; language: string };
        ur: { text: string; language: string };
      };
      description: {
        en: { text: string; language: string };
        ur: { text: string; language: string };
      };
    };
    programsList: Program[];
  };
}

interface EventCounts {
  total: number;
  english: number;
  urdu: number;
  upcoming: number;
  past: number;
  featured: number;
}

interface ServiceCounts {
  total: number;
  english: number;
  urdu: number;
  active: number;
  featured: number;
}

interface ProgramCounts {
  total: number;
  english: number;
  urdu: number;
  active: number;
  featured: number;
}

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  color = theme.colors.primary 
}: { 
  title: string; 
  value: number; 
  icon: any;
  trend?: string;
  color?: string;
}) {
  return (
    <div 
      className="relative overflow-hidden rounded-lg shadow-sm transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]"
      style={{ 
        backgroundColor: theme.colors.background.secondary,
        border: `1px solid ${color}20`
      }}>
      <div className="flex items-center p-3">
        <div 
          className="rounded-lg p-2 mr-3" 
          style={{ 
            backgroundColor: `${color}15`,
            boxShadow: `0 0 1px ${color}15`
          }}>
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p 
            className="text-xs font-bold uppercase tracking-wide truncate" 
            style={{ color: theme.colors.text.primary }}>
            {title}
          </p>
          <div className="flex items-baseline">
            <p 
              className="text-xl font-bold mr-2" 
              style={{ color }}>
              {value}
            </p>
            {trend && (
              <p 
                className="text-xs truncate" 
                style={{ color: theme.colors.text.secondary }}>
                {trend}
              </p>
            )}
          </div>
        </div>
      </div>
      <div 
        className="absolute bottom-0 left-0 h-0.5 w-full" 
        style={{ 
          backgroundColor: color,
          boxShadow: `0 0 2px ${color}`
        }}></div>
    </div>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <div 
      className="group relative rounded-lg p-3 transition-all duration-200 hover:translate-y-[-2px]"
      style={{ 
        backgroundColor: theme.colors.background.primary + 20,
        border: `1px solid ${theme.colors.primary}15`
      }}>
      <div className="flex items-center gap-3">
        <div 
          className="rounded-lg p-2 flex-shrink-0" 
          style={{ 
            backgroundColor: `${theme.colors.primary}15`,
            boxShadow: `0 0 12px ${theme.colors.primary}15`
          }}>
          <WrenchScrewdriverIcon 
            className="h-4 w-4" 
            style={{ color: theme.colors.primary }} />
        </div>
        <div className="min-w-0">
          <h3 
            className="font-bold text-sm truncate" 
            style={{ color: theme.colors.text.primary }}>
            {service.title.text}
          </h3>
          <p 
            className="text-xs truncate" 
            style={{ color: theme.colors.text.secondary }}>
            {service.shortDescription.text}
          </p>
        </div>
      </div>
    </div>
  );
}

// Add these interfaces
interface BlogCounts {
  total: number;
  english: number;
  urdu: number;
  featured: number;
}

interface BlogResponse {
  success: boolean;
  data: {
    blogsList: any[];
  };
}

export default function AdminDashboard() {
  const [eventCounts, setEventCounts] = useState<EventCounts>({
    total: 0,
    english: 0,
    urdu: 0,
    upcoming: 0,
    past: 0,
    featured: 0
  });
  const [serviceCounts, setServiceCounts] = useState<ServiceCounts>({
    total: 0,
    english: 0,
    urdu: 0,
    active: 0,
    featured: 0
  });
  const [programCounts, setProgramCounts] = useState<ProgramCounts>({
    total: 0,
    english: 0,
    urdu: 0,
    active: 0,
    featured: 0
  });
  const [blogCounts, setBlogCounts] = useState<BlogCounts>({
    total: 0,
    english: 0,
    urdu: 0,
    featured: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch services data
        const servicesResponse = await fetch('/api/services?limit=0');
        const servicesData: ServiceResponse = await servicesResponse.json();
        
        if (!servicesData.success) {
          throw new Error('Failed to fetch services data');
        }
        
        const servicesList = servicesData.data.servicesList;
        const serviceCounts = {
          total: servicesList.length,
          english: servicesList.filter(service => service.language === 'en').length,
          urdu: servicesList.filter(service => service.language === 'ur').length,
          active: servicesList.filter(service => service.isActive).length,
          featured: servicesList.filter(service => service.showOnHomepage).length
        };
        setServiceCounts(serviceCounts);

        // Fetch programs data
        const programsResponse = await fetch('/api/programs?limit=0');
        const programsData: ProgramResponse = await programsResponse.json();
        
        if (!programsData.success) {
          throw new Error('Failed to fetch programs data');
        }
        
        const programsList = programsData.data.programsList;
        const programCounts = {
          total: programsList.length,
          english: programsList.filter(program => program.language === 'en').length,
          urdu: programsList.filter(program => program.language === 'ur').length,
          active: programsList.filter(program => program.isActive).length,
          featured: programsList.filter(program => program.showOnHomepage).length
        };
        setProgramCounts(programCounts);

        // Fetch events data
        const eventsResponse = await fetch('/api/events?limit=0');
        const eventsData: EventsResponse = await eventsResponse.json();
        
        if (!eventsData.success) {
          throw new Error('Failed to fetch events data');
        }
        
        const eventsList = eventsData.data.eventsList;
        const counts = {
          total: eventsList.length,
          english: eventsList.filter((event) => event.language === 'en').length,
          urdu: eventsList.filter((event) => event.language === 'ur').length,
          upcoming: eventsList.filter((event) => event.status === 'upcoming').length,
          past: eventsList.filter((event) => event.status === 'past').length,
          featured: eventsList.filter((event) => event.showOnHome).length
        };
        
        setEventCounts(counts);

        // Add blog data fetching
        const blogsResponse = await fetch('/api/blogs');
        const blogsData: BlogResponse = await blogsResponse.json();
        
        if (!blogsData.success) {
          throw new Error('Failed to fetch blogs data');
        }
        
        const blogsList = blogsData.data.blogsList;
        const blogCounts = {
          total: blogsList.length,
          english: blogsList.filter(blog => blog.title.language === 'en').length,
          urdu: blogsList.filter(blog => blog.title.language === 'ur').length,
          featured: blogsList.filter(blog => blog.showOnHome).length
        };
        
        setBlogCounts(blogCounts);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error instanceof Error ? error.message : 'An error occurred while fetching data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <DashboardLoader />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-lg" style={{ color: theme.colors.text.secondary }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-0">
      <div className='mb-3'>
        <h1 className="text-xl font-bold mb-1" style={{ color: theme.colors.text.primary }}>
          Dashboard Overview
        </h1>
        <p className="text-xs" style={{ color: theme.colors.text.secondary }}>
          Welcome back! Here's what's happening with your organization.
        </p>
      </div>

      {/* Services Stats Card */}
      <div className="rounded-xl shadow-sm p-4 mb-6" 
           style={{ backgroundColor: theme.colors.background.secondary }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold" style={{ color: theme.colors.text.primary }}>
              Services Statistics
            </h2>
          </div>
          <Link 
            href="/admin/services"
            className="rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-200"
            style={{ 
              backgroundColor: `${theme.colors.primary}20`,
              color: theme.colors.primary
            }}
          >
            Manage
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* <StatCard
            title="Total Services"
            value={serviceCounts.total}
            icon={WrenchScrewdriverIcon}
            trend="All services"
            color={theme.colors.primary}
          />
          <StatCard
            title="Active"
            value={serviceCounts.active}
            icon={CheckCircleIcon}
            trend="In operation"
            color="#10B981"
          />
          <StatCard
            title="Featured"
            value={serviceCounts.featured}
            icon={ArrowPathIcon}
            trend="Homepage"
            color="#8B5CF6"
          /> */}
          <StatCard
            title="English"
            value={serviceCounts.english}
            icon={DocumentTextIcon}
            trend="Content"
            color="#0EA5E9"
          />
          <StatCard
            title="Urdu"
            value={serviceCounts.urdu}
            icon={LanguageIcon}
            trend="Content"
            color="#F59E0B"
          />
        </div>
      </div>

      {/* Programs Stats Card */}
      <div className="rounded-xl shadow-sm p-4 mb-6" 
           style={{ backgroundColor: theme.colors.background.secondary }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold" style={{ color: theme.colors.text.primary }}>
              Programs Statistics
            </h2>
          </div>
          <Link 
            href="/admin/programs"
            className="rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-200"
            style={{ 
              backgroundColor: `${theme.colors.primary}20`,
              color: theme.colors.primary
            }}
          >
            Manage
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* <StatCard
            title="Total Programs"
            value={programCounts.total}
            icon={CalendarIcon}
            trend="All programs"
            color={theme.colors.primary}
          /> */}
          {/* <StatCard
            title="Active"
            value={programCounts.active}
            icon={CheckCircleIcon}
            trend="In operation"
            color="#10B981"
          /> */}
          {/* <StatCard
            title="Featured"
            value={programCounts.featured}
            icon={ArrowPathIcon}
            trend="Homepage"
            color="#8B5CF6"
          /> */}
          <StatCard
            title="English"
            value={programCounts.english}
            icon={DocumentTextIcon}
            trend="Content"
            color="#0EA5E9"
          />
          <StatCard
            title="Urdu"
            value={programCounts.urdu}
            icon={LanguageIcon}
            trend="Content"
            color="#F59E0B"
          />
        </div>
      </div>

      {/* Events Stats Card */}
      <div className="rounded-xl shadow-sm p-4" 
           style={{ backgroundColor: theme.colors.background.secondary }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold" style={{ color: theme.colors.text.primary }}>
              Events Statistics
            </h2>
          </div>
          <Link 
            href="/admin/events"
            className="rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-200"
            style={{ 
              backgroundColor: `${theme.colors.primary}20`,
              color: theme.colors.primary
            }}
          >
            Manage
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* <StatCard
            title="Total Events"
            value={eventCounts.total}
            icon={CalendarIcon}
            trend="All time"
            color={theme.colors.primary}
          />
          <StatCard
            title="Upcoming"
            value={eventCounts.upcoming}
            icon={ClockIcon}
            trend="Pipeline"
            color="#0EA5E9"
          />
          <StatCard
            title="Past Events"
            value={eventCounts.past}
            icon={CheckCircleIcon}
            trend="Completed"
            color="#8B5CF6"
          /> */}
          <StatCard
            title="English"
            value={eventCounts.english}
            icon={DocumentTextIcon}
            trend="Content"
            color="#10B981"
          />
          <StatCard
            title="Urdu"
            value={eventCounts.urdu}
            icon={LanguageIcon}
            trend="Content"
            color="#F59E0B"
          />
          {/* <StatCard
            title="Featured"
            value={eventCounts.featured}
            icon={ArrowPathIcon}
            trend="Homepage"
            color="#EC4899"
          /> */}
        </div>
      </div>

      {/* Blogs Stats Card */}
      <div className="rounded-xl shadow-sm p-4 mb-6" 
           style={{ backgroundColor: theme.colors.background.secondary }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold" style={{ color: theme.colors.text.primary }}>
              Blogs Statistics
            </h2>
          </div>
          <Link 
            href="/admin/blogs"
            className="rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-200"
            style={{ 
              backgroundColor: `${theme.colors.primary}20`,
              color: theme.colors.primary
            }}
          >
            Manage
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* <StatCard
            title="Total Blogs"
            value={blogCounts.total}
            icon={NewspaperIcon}
            trend="All blogs"
            color={theme.colors.primary}
          /> */}
          {/* <StatCard
            title="Featured"
            value={blogCounts.featured}
            icon={ArrowPathIcon}
            trend="Homepage"
            color="#8B5CF6"
          /> */}
          <StatCard
            title="English"
            value={blogCounts.english}
            icon={DocumentTextIcon}
            trend="Content"
            color="#0EA5E9"
          />
          <StatCard
            title="Urdu"
            value={blogCounts.urdu}
            icon={LanguageIcon}
            trend="Content"
            color="#F59E0B"
          />
        </div>
      </div>

    </div>
  );
}