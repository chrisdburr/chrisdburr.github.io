import type { Metadata } from "next";
import { Fragment } from "react";
import { ProjectCard } from "@/components/project-card";
import { Separator } from "@/components/ui/separator";
import { projects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Projects — Dr Christopher Burr",
  description:
    "Current and past research projects by Dr Christopher Burr on AI ethics, trustworthy systems, and digital twins.",
};

export default function ProjectsPage() {
  const activeProjects = projects.filter((p) => p.active);
  const pastProjects = projects.filter((p) => !p.active);

  return (
    <div className="space-y-10">
      <section>
        <h1 className="mb-2 font-bold text-3xl">Projects</h1>
        <p className="text-muted-foreground text-sm/relaxed">
          Current and past research projects.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="font-semibold text-xl">Current Projects</h2>
        <div className="space-y-6">
          {activeProjects.map((project, i) => (
            <Fragment key={project.title}>
              <ProjectCard project={project} />
              {i < activeProjects.length - 1 && <Separator />}
            </Fragment>
          ))}
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="font-semibold text-xl">Past Projects</h2>
        <div className="space-y-1">
          {pastProjects.map((project) => (
            <ProjectCard compact key={project.title} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
