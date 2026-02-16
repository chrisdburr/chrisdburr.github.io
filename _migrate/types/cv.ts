export interface Experience {
  company: string;
  time: string;
  title: string;
  location?: string;
  description?: string;
}

export interface Education {
  school: string;
  time: string;
  degree: string;
  location?: string;
  description?: string;
}

export interface Skill {
  title: string;
  description: string;
}

export interface Publication {
  title: string;
  authors: string;
  journal: string;
  time: string;
  link?: string;
  abstract?: string;
}

export interface Award {
  title: string;
  organization: string;
  time: string;
  location?: string;
  value: string;
  description: string;
}

export interface ProfessionalService {
  title: string;
  role: string;
  organization: string;
  time: string;
  description?: string;
}

export interface Project {
  title: string;
  link: string;
  description: string;
  active: boolean;
}

export function isExperience(
  element: Experience | Education
): element is Experience {
  return "title" in element && "company" in element;
}

export function isEducation(
  element: Education | Experience
): element is Education {
  return "school" in element && "degree" in element;
}

export function isSkill(element: Skill | Publication): element is Skill {
  return "description" in element && !("authors" in element);
}

export function isPublication(
  element: Skill | Publication
): element is Publication {
  return "authors" in element;
}

export function isAward(element: any): element is Award {
  return "title" in element && "value" in element && "organization" in element;
}

export function isProfessionalService(
  element: any
): element is ProfessionalService {
  return "title" in element && "role" in element && "organization" in element;
}

export function isProject(element: any): element is Project {
  return "title" in element && "link" in element && "active" in element;
}
