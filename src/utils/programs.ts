import { programs } from '@/data/programs';

export const programUtils = {
  getAllPrograms: async () => {
    return {
      success: true,
      data: programs.filter(program => program.isActive)
    };
  },

  getHomePagePrograms: async () => {
    return {
      success: true,
      data: programs.filter(program => program.showOnHomepage && program.isActive)
    };
  },

  getProgramBySlug: async (slug: string) => {
    const program = programs.find(p => p.slug === slug && p.isActive);
    return {
      success: !!program,
      data: program || null
    };
  },

  getProgramNavigation: async (slug: string) => {
    try {
      const activePrograms = programs.filter(program => program.isActive);
      const currentIndex = activePrograms.findIndex(p => p.slug === slug);
      return {
        success: true,
        data: {
          prev: currentIndex > 0 ? activePrograms[currentIndex - 1] : null,
          next: currentIndex < activePrograms.length - 1 ? activePrograms[currentIndex + 1] : null
        }
      };
    } catch (error) {
      console.error('Error getting program navigation:', error);
      return {
        success: false,
        data: { prev: null, next: null }
      };
    }
  }
};