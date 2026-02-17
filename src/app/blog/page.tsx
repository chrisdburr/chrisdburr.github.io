import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllContent } from "@/lib/content";
import type { BlogFrontmatter } from "@/lib/schemas/content";

export const metadata: Metadata = {
  title: "Blog — Dr Christopher Burr",
  description:
    "Blog posts on AI ethics, trustworthy systems, and responsible innovation.",
};

export default function BlogIndexPage() {
  const posts = getAllContent<BlogFrontmatter>("blog");

  return (
    <div className="space-y-10">
      <section>
        <h1 className="mb-2 font-bold text-3xl">Blog</h1>
        <p className="text-muted-foreground text-sm/relaxed">
          Thoughts on AI ethics, trustworthy systems, and responsible
          innovation.
        </p>
      </section>

      <section className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-muted-foreground text-sm">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.slug}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardHeader>
                  <CardTitle>{post.metadata.title}</CardTitle>
                  <CardDescription>{post.metadata.date}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-muted-foreground text-sm/relaxed">
                    {post.metadata.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {post.metadata.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </section>
    </div>
  );
}
