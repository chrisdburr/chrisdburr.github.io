import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "src/content");
const MDX_EXTENSION = /\.mdx$/;

interface ContentItem<T> {
  metadata: T;
  content: string;
}

export function getContentBySlug<T>(
  directory: string,
  slug: string
): ContentItem<T> {
  const filePath = path.join(contentDirectory, directory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContents);

  return {
    metadata: data as T,
    content,
  };
}

export function getAllContent<T>(directory: string): ContentItem<T>[] {
  const dirPath = path.join(contentDirectory, directory);

  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const files = fs.readdirSync(dirPath).filter((file) => file.endsWith(".mdx"));

  const items = files.map((file) => {
    const slug = file.replace(MDX_EXTENSION, "");
    return getContentBySlug<T>(directory, slug);
  });

  return items.sort((a, b) => {
    const dateA = (a.metadata as Record<string, string>).date ?? "";
    const dateB = (b.metadata as Record<string, string>).date ?? "";
    return dateB.localeCompare(dateA);
  });
}
