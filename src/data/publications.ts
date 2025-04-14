// Import publications from JSON file
import publicationsData from "./publications.json";

// Export the publications data
export const publications = publicationsData.items.filter(item => item.inPublications !== false);