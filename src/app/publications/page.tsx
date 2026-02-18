import type { Metadata } from "next";
import { PublicationsTabs } from "@/components/publications-tabs";
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

      <section>
        <PublicationsTabs publications={publications} />
      </section>
    </div>
  );
}
