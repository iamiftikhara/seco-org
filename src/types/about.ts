export interface AboutPageData {
  heroSection: {
    title: string;
    image: string;
    story: string[];
    stats: {
      projects: string;
      livesImpacted: string;
    };
  };
  missionVision: {
    mission: string;
    vision: string;
  };
  values: {
    title: string;
    description: string;
  }[];
  companyDetails: {
    title: string;
    content: string | string[];
  }[];
  labels: {
    companyDetails: string;
    values: {
      title: string;
    };
  };
}