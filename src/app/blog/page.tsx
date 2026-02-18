import type { Metadata } from "next";
import Image from "next/image";
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
              <Card className="gap-0 overflow-hidden p-0 transition-colors hover:bg-muted/50 md:flex-row">
                {post.metadata.image && (
                  <div className="relative aspect-[2/1] md:aspect-auto md:w-72 md:shrink-0">
                    <Image
                      alt={post.metadata.title}
                      className="object-cover"
                      fill
                      sizes="(max-width: 768px) 100vw, 288px"
                      src={post.metadata.image}
                    />
                  </div>
                )}
                <div className="flex flex-col gap-4 py-4">
                  <CardHeader>
                    <CardTitle>{post.metadata.title}</CardTitle>
                    <CardDescription>{post.metadata.date}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-muted-foreground text-sm/relaxed">
                      {post.metadata.excerpt}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      {post.metadata.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                      <span className="ml-auto text-muted-foreground text-sm">
                        Read more &rarr;
                      </span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))
        )}
      </section>
    </div>
  );
}
