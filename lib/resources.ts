import { Partner, Project, ProjectCategory, Service, Statistic, Testimonial } from "@/models";

type ResourceConfig = {
  model: any;
  sort: Record<string, 1 | -1>;
};

export const resources: Record<string, ResourceConfig> = {
  projects: { model: Project, sort: { displayOrder: 1, createdAt: -1 } },
  categories: { model: ProjectCategory, sort: { displayOrder: 1, createdAt: -1 } },
  services: { model: Service, sort: { displayOrder: 1, createdAt: -1 } },
  statistics: { model: Statistic, sort: { displayOrder: 1, createdAt: -1 } },
  partners: { model: Partner, sort: { displayOrder: 1, createdAt: -1 } },
  testimonials: { model: Testimonial, sort: { displayOrder: 1, createdAt: -1 } },
};

export function getResource(name: string): ResourceConfig | null {
  return resources[name] ?? null;
}
