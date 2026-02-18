import {
  AwardIcon,
  BriefcaseIcon,
  Code2Icon,
  GraduationCapIcon,
  UsersIcon,
} from "lucide-react";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  awards,
  education,
  experiences,
  professionalService,
  skills,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "CV — Dr Christopher Burr",
  description:
    "Academic curriculum vitae for Dr Christopher Burr, Senior Researcher at the Alan Turing Institute.",
};

export default function CVPage() {
  return (
    <div className="space-y-10">
      <section>
        <h1 className="mb-2 font-bold text-3xl">Curriculum Vitae</h1>
        <p className="text-muted-foreground text-sm/relaxed">
          Academic and professional background.
        </p>
      </section>

      {/* Experience */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <BriefcaseIcon className="size-5 text-muted-foreground" />
          <h2 className="font-semibold text-xl">Experience</h2>
        </div>
        <div className="space-y-4">
          {experiences.map((exp) => (
            <Card key={`${exp.title}-${exp.company}`}>
              <CardHeader>
                <CardTitle>{exp.title}</CardTitle>
                <CardDescription>
                  {exp.company}
                  {exp.location ? ` · ${exp.location}` : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="outline">{exp.time}</Badge>
                {exp.description ? (
                  <p className="mt-2 text-muted-foreground text-sm/relaxed">
                    {exp.description}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Education */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <GraduationCapIcon className="size-5 text-muted-foreground" />
          <h2 className="font-semibold text-xl">Education</h2>
        </div>
        <div className="space-y-4">
          {education.map((edu) => (
            <Card key={`${edu.degree}-${edu.school}`}>
              <CardHeader>
                <CardTitle>{edu.degree}</CardTitle>
                <CardDescription>
                  {edu.school}
                  {edu.location ? ` · ${edu.location}` : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="outline">{edu.time}</Badge>
                {edu.description ? (
                  <p className="mt-2 text-muted-foreground text-sm/relaxed">
                    {edu.description}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Awards & Funding */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <AwardIcon className="size-5 text-muted-foreground" />
          <h2 className="font-semibold text-xl">Awards &amp; Funding</h2>
        </div>
        <div className="space-y-4">
          {awards.map((award) => (
            <Card key={`${award.title}-${award.organization}`}>
              <CardHeader>
                <CardTitle>{award.title}</CardTitle>
                <CardDescription>
                  {award.organization} · {award.value}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="outline">{award.time}</Badge>
                <p className="mt-2 text-muted-foreground text-sm/relaxed">
                  {award.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Professional Service */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <UsersIcon className="size-5 text-muted-foreground" />
          <h2 className="font-semibold text-xl">Professional Service</h2>
        </div>
        <div className="space-y-4">
          {professionalService.map((svc) => (
            <Card key={`${svc.title}-${svc.organization}`}>
              <CardHeader>
                <CardTitle>{svc.title}</CardTitle>
                <CardDescription>
                  {svc.role} · {svc.organization}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="outline">{svc.time}</Badge>
                {svc.description ? (
                  <p className="mt-2 text-muted-foreground text-sm/relaxed">
                    {svc.description}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Code2Icon className="size-5 text-muted-foreground" />
          <h2 className="font-semibold text-xl">Skills</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {skills.map((skill) => (
            <Card key={skill.title}>
              <CardHeader>
                <CardTitle>{skill.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{skill.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
