import { profile, template } from "../settings";

/**
 * Highlights the author's name in a list of authors by adding HTML markup
 * @param authors String containing comma-separated author names
 * @returns String with the author's name highlighted using HTML
 */
export function highlightAuthor(authors: string): string {
  const author: string[] = authors.split(", ");
  if (author.includes(profile.author_name)) {
    return authors.replace(
      profile.author_name,
      `<span class='font-medium underline'>${profile.author_name}</span>`
    );
  }
  return authors;
}

/**
 * Trims text to a specified length and adds ellipsis if needed
 * @param excerpt The text to trim
 * @returns Trimmed text with ellipsis if longer than the specified length
 */
export function trimExcerpt(excerpt: string): string {
  const excerptLength: number = template.excerptLength;
  return excerpt.length > excerptLength
    ? `${excerpt.substring(0, excerptLength)}...`
    : excerpt;
}

/**
 * Orders elements by time in descending order, with "present" or similar values appearing first
 * @param a First element to compare
 * @param b Second element to compare
 * @returns Negative number if a should be before b, positive if b should be before a
 */
export function orderElementsByTime<T extends { time: string }>(
  a: T,
  b: T
): number {
  const presentValues: string[] = ["present", "now", "current", "today"];
  if (
    presentValues.includes(
      (a["time"] as string)?.split(" - ")[1]?.toLowerCase()
    )
  ) {
    // If the date is 'present', it should be the first element
    return -1;
  }
  const dateA = new Date((a["time"] as string)?.split(" - ")[1]);
  const dateB = new Date((b["time"] as string)?.split(" - ")[1]);
  return dateB.getTime() - dateA.getTime();
}

/**
 * Converts PascalCase or camelCase string to kebab-case.
 * e.g., "BookOpenCheck" -> "book-open-check"
 * e.g., "fileText" -> "file-text"
 */
export function pascalToKebab(str: string): string {
  if (!str) {
    return "";
  }
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2") // Add hyphen before uppercase letters preceded by lowercase/number
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2") // Add hyphen between consecutive uppercase letters when followed by lowercase
    .toLowerCase(); // Convert the whole string to lowercase
}
