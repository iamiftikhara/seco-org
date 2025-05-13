'use client';

import { theme } from '@/config/theme';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Event {
  id: string;
  title: string;
  language: 'en' | 'ur';
  date: string;
}

interface EventCounts {
  total: number;
  english: number;
  urdu: number;
}

interface Service {
  id: string;
  title: string;
  description: string;
}

export default function AdminDashboard() {
  const [eventCounts, setEventCounts] = useState<EventCounts>({
    total: 0,
    english: 0,
    urdu: 0
  });
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch events data
        const eventsResponse = await fetch('/api/events');
        const eventsData: Event[] = await eventsResponse.json();
        
        // Count events by language
        const counts = {
          total: eventsData.length,
          english: eventsData.filter((event) => event.language === 'en').length,
          urdu: eventsData.filter((event) => event.language === 'ur').length
        };
        setEventCounts(counts);

        // Fetch services data
        const servicesResponse = await fetch('/api/services');
        const servicesData = await servicesResponse.json();
        setServices(servicesData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6">
        <p style={{ color: theme.colors.text.secondary }}>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 style={{ 
        color: theme.colors.text.primary,
        fontFamily: theme.fonts.en.primary,
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem'
      }}>
        Dashboard Overview
      </h1>
      
      {/* Events Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ 
          padding: '1.5rem', 
          borderRadius: '0.5rem', 
          backgroundColor: theme.colors.background.naturalGray,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            color: theme.colors.text.primary,
            fontFamily: theme.fonts.en.primary,
            fontSize: '1.125rem',
            fontWeight: '600',
            marginBottom: '0.5rem'
          }}>Total Events</h3>
          <p style={{ 
            color: theme.colors.text.secondary,
            fontSize: '1.875rem',
            fontWeight: 'bold'
          }}>{eventCounts.total}</p>
        </div>
        <div style={{ 
          padding: '1.5rem', 
          borderRadius: '0.5rem', 
          backgroundColor: theme.colors.background.naturalGray,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            color: theme.colors.text.primary,
            fontFamily: theme.fonts.en.primary,
            fontSize: '1.125rem',
            fontWeight: '600',
            marginBottom: '0.5rem'
          }}>English Events</h3>
          <p style={{ 
            color: theme.colors.text.secondary,
            fontSize: '1.875rem',
            fontWeight: 'bold'
          }}>{eventCounts.english}</p>
        </div>
        <div style={{ 
          padding: '1.5rem', 
          borderRadius: '0.5rem', 
          backgroundColor: theme.colors.background.naturalGray,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            color: theme.colors.text.primary,
            fontFamily: theme.fonts.en.primary,
            fontSize: '1.125rem',
            fontWeight: '600',
            marginBottom: '0.5rem'
          }}>Urdu Events</h3>
          <p style={{ 
            color: theme.colors.text.secondary,
            fontSize: '1.875rem',
            fontWeight: 'bold'
          }}>{eventCounts.urdu}</p>
        </div>
      </div>

      {/* Services Overview */}
      <div style={{ 
        padding: '1.5rem', 
        borderRadius: '0.5rem', 
        backgroundColor: theme.colors.background.naturalGray,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{ 
          color: theme.colors.text.primary,
          fontFamily: theme.fonts.en.primary,
          fontSize: '1.25rem',
          fontWeight: '600',
          marginBottom: '1rem'
        }}>Services Overview</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {services.slice(0, 3).map((service) => (
            <div key={service.id} style={{ 
              borderBottom: `1px solid ${theme.colors.border}`,
              paddingBottom: '1rem'
            }}>
              <h3 style={{ 
                color: theme.colors.text.primary,
                fontFamily: theme.fonts.en.primary,
                fontWeight: '500'
              }}>{service.title}</h3>
              <p style={{ 
                color: theme.colors.text.secondary,
                fontSize: '0.875rem'
              }}>{service.description}</p>
            </div>
          ))}
          {services.length > 3 && (
            <p style={{ 
              color: theme.colors.text.secondary,
              fontSize: '0.875rem'
            }}>And {services.length - 3} more services...</p>
          )}
        </div>
      </div>

   
    </div>
  );
}