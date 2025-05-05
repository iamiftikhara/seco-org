export const serviceUtils = {
  getServiceBySlug: async (slug: string) => {
    try {
      const response = await fetch(`/api/services/${slug}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching service:', error);
      return { success: false, message: 'Failed to fetch service' };
    }
  },

  getAllServices: async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching all services:', error);
      return { success: false, message: 'Failed to fetch services' };
    }
  }
};