import {
  Brain,
  Copy,
  ExternalLink,
  Scale,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { projects, researchAreas, site } from "@/lib/data";

const iconMap: Record<string, React.ReactNode> = {
  trust: <ShieldCheck className="size-5 text-muted-foreground" />,
  copy: <Copy className="size-5 text-muted-foreground" />,
  users: <Users className="size-5 text-muted-foreground" />,
  scale: <Scale className="size-5 text-muted-foreground" />,
  brain: <Brain className="size-5 text-muted-foreground" />,
};

const activeProjects = projects.filter((p) => p.active);

export default function Home() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <section>
        <h1 className="mb-2 font-bold text-3xl">{site.profile.fullName}</h1>
        <p className="mb-4 text-muted-foreground text-sm/relaxed">
          {site.profile.role} at the {site.profile.institute}
        </p>
        <p className="max-w-prose text-sm/relaxed">
          I research the trustworthiness and ethics of data-driven technologies,
          with a focus on developing practical assurance methods for AI systems.
          My work spans responsible innovation, digital twinning, and the
          philosophical foundations of cognitive science.
        </p>
      </section>

      {/* Research Areas */}
      <section>
        <h2 className="mb-4 font-semibold text-xl">Research Areas</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {researchAreas.map((area) => (
            <Card key={area.field}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  {iconMap[area.iconName]}
                  <CardTitle>{area.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{area.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Active Projects */}
      <section>
        <h2 className="mb-4 font-semibold text-xl">Current Projects</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {activeProjects.map((project) => (
            <Card key={project.title}>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <CardDescription>{project.description}</CardDescription>
                <div>
                  <Link
                    href={project.link}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Badge variant="outline">
                      <ExternalLink data-icon="inline-start" />
                      Visit project
                    </Badge>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
