import { projects } from '@/data/projects';

export const projectUtils = {
  getAllProjects: () => {
    return {
      success: true,
      data: projects
    };
  },

  getHomePageProjects: () => {
    return {
      success: true,
      data: projects.filter(project => project.showOnHomepage && project.isActive)
    };
  },

  getProjectBySlug: (slug: string) => {
    const project = projects.find(p => p.slug === slug && p.isActive);
    return {
      success: !!project,
      data: project || null
    };
  }
};