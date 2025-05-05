import { events } from '@/data/events';

export const eventService = {
  getEventBySlug: async (slug: string) => {
    try {
      // Find the event with matching slug
      const event = events.eventsList.find(event => 
        event.slug === slug || 
        event.slug === `${slug}-en` || 
        event.slug === `${slug}-ur`
      );
      
      return {
        success: true,
        data: event || null
      };
    } catch (error) {
      console.log("API error", error)
      return {
        success: false,
        error: 'Failed to fetch event'
      };
    }
  },

  getEventNavigation: async (currentSlug: string) => {
    try {
      // Get base slug without language suffix
      // const baseSlug = currentSlug.replace(/-[a-z]{2}$/, '');
      
      // Find events with the same language
      const currentEvent = events.eventsList.find(event => event.slug === currentSlug);
      const language = currentEvent?.language || 'en';
      
      const languageEvents = events.eventsList.filter(event => event.language === language);
      const currentIndex = languageEvents.findIndex(event => event.slug === currentSlug);

      return {
        success: true,
        data: {
          prev: currentIndex > 0 ? languageEvents[currentIndex - 1] : null,
          next: currentIndex < languageEvents.length - 1 ? languageEvents[currentIndex + 1] : null
        }
      };
    } catch (error) {
      console.log("API error", error)
      return {
        success: false,
        error: 'Failed to fetch navigation'
      };
    }
  }
};