import { Event, EventResponse, EventsResponse } from '@/types/events';

export const eventUtils = {
  getAllEvents: async (): Promise<EventsResponse> => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching events:', error);
      return { success: false, message: 'Failed to fetch events' };
    }
  },

  getEventBySlug: async (slug: string): Promise<EventResponse> => {
    try {
      const response = await fetch(`/api/events/${slug}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching event:', error);
      return { success: false, message: 'Failed to fetch event' };
    }
  },

  getRecentEvents: async (limit: number = 4): Promise<EventsResponse> => {
    try {
      const response = await fetch(`/api/events?limit=${limit}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching recent events:', error);
      return { success: false, message: 'Failed to fetch recent events' };
    }
  }
};