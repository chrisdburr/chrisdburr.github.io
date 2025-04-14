import { orderElementsByTime } from '../lib/utils';

// Define raw data array
const rawAwards = [
  {
    "title": "EPSRC Networks of Cardiovascular Digital Twins",
    "organization": "Alan Turing Institute",
    "time": "October 2024 - October 2029",
    "location": "England",
    "value": "£8,000,000",
    "description": "Awarded to Professor Steven Niederer as PI. I am Co-Investigator focused on WP6: Assurance and Engagement of Cardiovascular Digital Twins."
  },
  {
    "title": "UKRI BRAID Scoping Research",
    "organization": "Alan Turing Institute",
    "time": "February 2024 - October 2024",
    "location": "England",
    "value": "£310,000",
    "description": "Awarded as Principal Investigator for the project, 'Trustworthy and Ethical Assurance of Digital Twins'"
  },
  {
    "title": "AAIP Demonstrator Project University of York",
    "organization": "Alan Turing Institute",
    "time": "February 2023 - November 2023",
    "location": "England",
    "value": "£110,000",
    "description": "Awarded as Principal Investigator for the project, 'Trustworthy and Ethical Assurance of Digital Healthcare'"
  },
  {
    "title": "AI for Science and Government (ASG) Research Programme",
    "organization": "Alan Turing Institute",
    "time": "April 2022 - March 2023",
    "location": "England",
    "value": "£170,000",
    "description": "Awarded to further develop the Turing Commons platform and support ongoing work with UK Centre's for Doctoral Training'"
  },
  {
    "title": "UKRI TAS Hub Pump Priming Award",
    "organization": "Alan Turing Institute",
    "time": "July 2021 - June 2022",
    "location": "England",
    "value": "£150,000",
    "description": "Awarded as Principal Investigator for the project, 'Ethical assurance of digital mental healthcare'"
  },
  {
    "title": "European Research Council PhD Scholarship",
    "organization": "University of Bristol",
    "time": "2013-2016",
    "location": "England",
    "value": "£150,000",
    "description": "Funding included tuition fees, full maintenance grant, and additional research expenses."
  }
];

// Export pre-sorted array
export const awards = [...rawAwards].sort(orderElementsByTime);
