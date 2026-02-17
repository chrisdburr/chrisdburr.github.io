import { ExternalLink } from "lucide-react";
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
import { publications } from "@/lib/publications";

export const metadata: Metadata = {
  title: "Publications — Dr Christopher Burr",
  description:
    "Selected publications by Dr Christopher Burr on AI ethics, trustworthy systems, and digital twins.",
};

export default function PublicationsPage() {
  return (
    <div className="space-y-10">
      <section>
        <h1 className="mb-2 font-bold text-3xl">Publications</h1>
        <p className="text-muted-foreground text-sm/relaxed">
          Selected academic publications sorted by date.
        </p>
      </section>

      <section className="space-y-4">
        {publications.map((pub) => (
          <Card key={pub.title}>
            <CardHeader>
              <CardTitle className="text-base">{pub.title}</CardTitle>
              <CardDescription>{pub.authors}</CardDescription>
              {pub.editors ? (
                <CardDescription>Edited by {pub.editors}</CardDescription>
              ) : null}
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-muted-foreground text-sm">
                {pub.venue}
                {pub.venue && pub.date ? " · " : ""}
                {pub.date}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{pub.type}</Badge>
                {pub.link ? (
                  <Link
                    href={pub.link}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Badge variant="outline">
                      <ExternalLink data-icon="inline-start" />
                      View publication
                    </Badge>
                  </Link>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
