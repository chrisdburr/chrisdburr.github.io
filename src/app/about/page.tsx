import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Dr Christopher Burr",
  description:
    "Principal Research Scientist and lead of the Trustworthy and Assured AI theme at the Alan Turing Institute.",
};

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <section>
        <h1 className="mb-2 font-bold text-3xl">About</h1>
        <p className="text-muted-foreground text-sm/relaxed">
          Principal Research Scientist and lead of the Trustworthy and Assured
          AI theme at the Alan Turing Institute.
        </p>
      </section>

      <section className="max-w-prose space-y-4">
        <p className="text-muted-foreground text-sm/relaxed">
          I am a Principal Research Scientist at the{" "}
          <Link
            className="text-foreground underline underline-offset-4 hover:text-foreground/80"
            href="https://www.turing.ac.uk/people/researchers/christopher-burr"
            rel="noopener noreferrer"
            target="_blank"
          >
            Alan Turing Institute
          </Link>
          , where I lead the Trustworthy and Assured AI theme. My work focuses
          on the assurance of AI systems: the evidence, methods, and tools that
          let us show, and not merely assert, that an AI system is safe, fair,
          and fit for the decisions it informs.
        </p>
        <p className="text-muted-foreground text-sm/relaxed">
          In general, I think of myself as an interdisciplinary researcher who
          is passionate about a wide variety of topics and their intersections.
          Admittedly, this creates complications in academic circles, as people
          typically want to place others inside neat departmental boundaries.
          However, it really doesn&apos;t do a good job of capturing my interest
          or expertise.
        </p>
        <p className="text-muted-foreground text-sm/relaxed">
          For instance, I enjoy reading philosophy as much as writing Python,
          and detailed data analysis as much as designing skills workshops. My
          curiosity also ranges from empirical studies of human decision-making
          to the complex networks of large language models. In short, the
          following phrase resonates well with how I see myself:
        </p>
        <blockquote className="border-border border-l-2 pl-4 text-muted-foreground text-sm/relaxed italic">
          A jack of all trades is a master of none, but oftentimes better than a
          master of one.
        </blockquote>
      </section>

      <section className="max-w-prose space-y-4">
        <h2 className="font-semibold text-xl">Research Impact</h2>
        <p className="text-muted-foreground text-sm/relaxed">
          I strongly believe that addressing major societal challenges requires
          deep collaboration. As such, my research connects theory with practice
          to achieve tangible and meaningful outcomes. This approach has led to
          direct contributions to public policy, including work featured in the
          UK Department for Science, Innovation, and Technology&apos;s (DSIT){" "}
          <Link
            className="text-foreground underline underline-offset-4 hover:text-foreground/80"
            href="https://www.gov.uk/government/publications/introduction-to-ai-assurance/introduction-to-ai-assurance"
            rel="noopener noreferrer"
            target="_blank"
          >
            Introduction to AI Assurance framework
          </Link>
          .
        </p>
        <p className="text-muted-foreground text-sm/relaxed">
          This belief also drives the creation and application of free and
          open-source resources like the{" "}
          <Link
            className="text-foreground underline underline-offset-4 hover:text-foreground/80"
            href="https://assuranceplatform.azurewebsites.net/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Trustworthy and Ethical Assurance (TEA) Platform
          </Link>
          . This methodology is now integral to major initiatives such as the
          ~£8M EPSRC-funded{" "}
          <Link
            className="text-foreground underline underline-offset-4 hover:text-foreground/80"
            href="https://cvd-net.com/"
            rel="noopener noreferrer"
            target="_blank"
          >
            CVD-Net project
          </Link>
          , where I co-lead the work package focused on assurance, engagement,
          and ethics. Additionally, the{" "}
          <Link
            className="text-foreground underline underline-offset-4 hover:text-foreground/80"
            href="https://alan-turing-institute.github.io/turing-commons/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Turing Commons
          </Link>{" "}
          project I co-founded provides valuable educational resources for
          responsible innovation as one of two strategic skills projects for the
          Alan Turing Institute&apos;s Turing 2.0 strategy.
        </p>
        <p className="text-muted-foreground text-sm/relaxed">
          Furthermore, my work fosters consensus and shared practice within key
          technology domains. This includes leading the Special Interest Group
          on Uncertainty and Trust for the{" "}
          <Link
            className="text-foreground underline underline-offset-4 hover:text-foreground/80"
            href="https://dtnetplus.ac.uk/"
            rel="noopener noreferrer"
            target="_blank"
          >
            UKRI Digital Twin Network+
          </Link>{" "}
          and co-authoring influential papers, such as the{" "}
          <Link
            className="text-foreground underline underline-offset-4 hover:text-foreground/80"
            href="https://doi.org/10.5281/zenodo.14259252"
            rel="noopener noreferrer"
            target="_blank"
          >
            Trustworthy and Ethical Assurance of Digital Twins
          </Link>{" "}
          report, which was developed collaboratively with several partners and
          organisations to help operationalise assurance principles within the
          UK&apos;s digital twinning community.
        </p>
      </section>
    </div>
  );
}
