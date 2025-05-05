import { ImpactStat } from '@/types/impact';

export const impactUtils = {
  getActiveStats: async () => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/impact');
      const data = await response.json();
      return {
        success: true,
        data: data as ImpactStat[]
      };
    } catch (error) {
      console.error('Error fetching impact stats:', error);
      return {
        success: false,
        data: []
      };
    }
  }
};