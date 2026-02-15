import { orderElementsByTime } from "../lib/utils";

// Define raw data array
const rawProfessionalService = [
  {
    title: "BSI Working Group on IOT/1 Internet of Things and Digital Twin",
    role: "Member",
    organization: "British Standards Institution",
    time: "2023–Present",
  },
  {
    title:
      "IEEE Industry Connections Program on Ethical Assurance of Data-Driven Technologies for Mental Healthcare",
    role: "Chair",
    organization: "Institute of Electrical and Electronics Engineers",
    time: "2021–23",
  },
  {
    title: "hoRRIzon project Advisory Board",
    role: "Member",
    organization:
      "Horizon Digital Economy Research Centre, University of Nottingham",
    time: "2022–23",
  },
  {
    title: "IEEE P7010 Standards Committee and Working Group",
    role: "Member",
    organization: "Institute of Electrical and Electronics Engineers",
    time: "2020–22",
  },
];

// Export pre-sorted array
export const professionalService = [...rawProfessionalService].sort(
  orderElementsByTime
);
