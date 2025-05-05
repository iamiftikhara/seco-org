export interface ImpactSection {
  id: string;
  title: string;
  backgroundImage: string;
  isActive: boolean;
  updatedAt: Date;
}

export interface ImpactStat {
  id: string;
  value: number;
  label: string;
  suffix: string;
  iconSvg: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}