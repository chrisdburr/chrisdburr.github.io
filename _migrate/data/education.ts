import { orderElementsByTime } from "../lib/utils";

// Define raw data array
const rawEducation = [
  {
    school: "University of Bristol",
    time: "2013--2016",
    degree: "PhD Philosophy of Cognitive Science",
    location: "Bristol, England",
    description: "with No Corrections",
  },
  {
    school: "University of Bristol",
    time: "2009--2011",
    degree: "MA History and Philosophy of Science",
    location: "Bristol, England",
    description: "with Distinction",
  },
  {
    school: "University of Exeter",
    time: "2005--2008",
    degree: "BA Philosophy",
    location: "Exeter, England",
    description: "with First Class Honours",
  },
];

// Export pre-sorted array
export const education = [...rawEducation].sort(orderElementsByTime);
