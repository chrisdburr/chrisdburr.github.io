import { Brain, Copy, ShieldCheck, Users } from "lucide-react";
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
import { researchAreas, site } from "@/lib/data";
import type { BlogFrontmatter } from "@/lib/schemas/content";

const iconMap: Record<string, React.ReactNode> = {
  trust: <ShieldCheck className="size-5 text-muted-foreground" />,
  copy: <Copy className="size-5 text-muted-foreground" />,
  users: <Users className="size-5 text-muted-foreground" />,
  brain: <Brain className="size-5 text-muted-foreground" />,
};

export default function Home() {
  const posts = getAllContent<BlogFrontmatter>("blog");
  const featuredPost = posts[0];

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="flex flex-col items-center gap-4 text-center">
        <Image
          alt={site.profile.fullName}
          className="size-28 shrink-0 rounded-full object-cover sm:size-32"
          height={128}
          src="/images/happy.jpg"
          width={128}
        />
        <div>
          <h1 className="mb-2 font-bold text-3xl">
            {site.profile.title} {site.profile.fullName}
          </h1>
          <p className="mb-4 text-muted-foreground text-sm/relaxed">
            {site.profile.role} at the {site.profile.institute}
          </p>
          <p className="mx-auto max-w-prose text-sm/relaxed">
            I specialise in AI assurance — developing practical methods to
            evaluate and demonstrate the trustworthiness of AI systems. My
            research connects ethical principles with actionable governance
            frameworks, spanning responsible innovation, agentic digital twins,
            and the philosophy of cognitive science.
          </p>
        </div>
      </section>

      {/* Areas of Expertise — Bento Grid */}
      <section>
        <h2 className="mb-4 font-semibold text-xl">Areas of Expertise</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {researchAreas.map((area) => (
            <Card
              className="border-l-4 border-l-primary px-5 py-6"
              key={area.field}
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  {iconMap[area.iconName]}
                  <CardTitle className="font-semibold">{area.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm/relaxed">
                  {area.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Blog Post */}
      {featuredPost && (
        <section>
          <h2 className="mb-4 font-semibold text-xl">Latest Post</h2>
          <Link href={`/blog/${featuredPost.slug}`}>
            <Card className="gap-0 overflow-hidden p-0 transition-colors hover:bg-muted/50 md:flex-row">
              {featuredPost.metadata.image && (
                <div className="relative aspect-[2/1] md:aspect-auto md:w-72 md:shrink-0">
                  <Image
                    alt={featuredPost.metadata.title}
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, 288px"
                    src={featuredPost.metadata.image}
                  />
                </div>
              )}
              <div className="flex flex-col gap-4 py-4">
                <CardHeader>
                  <CardTitle>{featuredPost.metadata.title}</CardTitle>
                  <CardDescription>
                    {featuredPost.metadata.date}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground text-sm/relaxed">
                    {featuredPost.metadata.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {featuredPost.metadata.tags.map((tag) => (
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
        </section>
      )}
    </div>
  );
}
