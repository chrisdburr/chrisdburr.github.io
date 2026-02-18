import { evaluate } from "@mdx-js/mdx";
import type { Metadata } from "next";
import {
  jsx as jsxFn,
  Fragment as jsxFragment,
  jsxs as jsxsFn,
} from "react/jsx-runtime";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";
import { getAllSlugs, getContentBySlug } from "@/lib/content";
import type { BlogFrontmatter } from "@/lib/schemas/content";

interface BlogPostProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllSlugs("blog").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostProps): Promise<Metadata> {
  const { slug } = await params;
  const { metadata } = getContentBySlug<BlogFrontmatter>("blog", slug);
  return {
    title: `${metadata.title} — Dr Christopher Burr`,
    description: metadata.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { slug } = await params;
  const { metadata, content } = getContentBySlug<BlogFrontmatter>("blog", slug);

  const { default: MDXContent } = await evaluate(content, {
    Fragment: jsxFragment,
    jsx: jsxFn,
    jsxs: jsxsFn,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  });

  return (
    <article className="space-y-8">
      <header>
        <h1 className="mb-2 font-bold text-3xl">{metadata.title}</h1>
        <p className="mb-4 text-muted-foreground text-sm">{metadata.date}</p>
        <div className="flex flex-wrap gap-2">
          {metadata.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </header>

      <div className="prose max-w-none">
        <MDXContent />
      </div>
    </article>
  );
}
