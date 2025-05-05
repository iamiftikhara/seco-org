import { programs } from '@/data/programs';
import { ProgramItem } from '@/types/programs';

export const programService = {
  getProgramBySlug: async (slug: string) => {
    try {
      const program = programs?.programsList?.find(
        p => p.slug === slug
      );
      return {
        success: true,
        data: program || null
      };
    } catch (error) {
      console.error('Error fetching program:', error);
      return {
        success: false,
        data: null
      };
    }
  },

  getProgramNavigation: async (slug: string, language: 'en' | 'ur' = 'en') => {
    try {
      if (!programs?.programsList) {
        return {
          success: false,
          data: { prev: null, next: null }
        };
      }

      const programsList = [...programs.programsList];
      // Get base programs (excluding language variants)
      const basePrograms = programsList.filter(p => !p.slug.includes('-ur'));
      
      // Find current program's base slug
      const baseSlug = slug.replace('-ur', '');
      const currentIndex = basePrograms.findIndex(p => p.slug === baseSlug);

      // Get the corresponding language version
      const getLanguageVersion = (program: ProgramItem | null) => {
        if (!program) return null;
        const targetSlug = language === 'ur' ? `${program.slug}-ur` : program.slug;
        return programsList.find(p => p.slug === targetSlug) || program;
      };

      return {
        success: true,
        data: {
          prev: getLanguageVersion(currentIndex > 0 ? basePrograms[currentIndex - 1] : null),
          next: getLanguageVersion(currentIndex < basePrograms.length - 1 ? basePrograms[currentIndex + 1] : null)
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