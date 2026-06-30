import { z } from "zod";
import rawData from "@/data/publications.json";
import { publicationSchema } from "@/lib/schemas/content";

interface ZoteroCreator {
  firstName?: string;
  lastName?: string;
  name?: string;
  creatorType: string;
}

interface ZoteroItem {
  itemType: string;
  title: string;
  date?: string;
  creators?: ZoteroCreator[];
  abstractNote?: string;
  url?: string;
  DOI?: string;
  publicationTitle?: string;
  bookTitle?: string;
  proceedingsTitle?: string;
  publisher?: string;
  institution?: string;
  websiteTitle?: string;
  repository?: string;
}

const EXCLUDED_TYPES = new Set(["attachment", "note"]);

// The Zotero export is the full reference library; the Publications page should
// show only items authored or edited by the site owner, not the reading list.
const OWNER_SURNAME = "burr";

function isOwnAuthored(item: ZoteroItem): boolean {
  return (item.creators ?? []).some(
    (c) => (c.lastName ?? "").toLowerCase() === OWNER_SURNAME
  );
}

const TYPE_LABELS: Record<string, string> = {
  journalArticle: "Journal Article",
  conferencePaper: "Conference Paper",
  bookSection: "Book Chapter",
  book: "Edited Book",
  report: "Report",
  preprint: "Preprint",
  webpage: "Web Article",
};

function formatCreators(creators: ZoteroCreator[]): {
  authors: string;
  editors: string | undefined;
} {
  const authors = creators.filter((c) => c.creatorType === "author");
  const editors = creators.filter((c) => c.creatorType === "editor");

  const format = (list: ZoteroCreator[]) =>
    list.map((c) => `${c.firstName} ${c.lastName}`).join(", ");

  return {
    authors: authors.length > 0 ? format(authors) : format(editors),
    editors:
      editors.length > 0 && authors.length > 0 ? format(editors) : undefined,
  };
}

function getVenue(item: ZoteroItem): string {
  return (
    item.publicationTitle ??
    item.bookTitle ??
    item.proceedingsTitle ??
    item.institution ??
    item.websiteTitle ??
    item.publisher ??
    item.repository ??
    ""
  );
}

function getLink(item: ZoteroItem): string | undefined {
  if (item.DOI) {
    return `https://doi.org/${item.DOI}`;
  }
  return item.url ?? undefined;
}

function parseDateValue(date: string): number {
  const ms = Date.parse(date);
  if (!Number.isNaN(ms)) {
    return ms;
  }
  return 0;
}

const items = (rawData as { items: ZoteroItem[] }).items
  .filter(
    (item) =>
      !EXCLUDED_TYPES.has(item.itemType) && item.title && isOwnAuthored(item)
  )
  .map((item) => {
    const { authors, editors } = formatCreators(item.creators ?? []);
    return {
      title: item.title,
      authors,
      editors,
      venue: getVenue(item),
      date: item.date ?? "",
      type: TYPE_LABELS[item.itemType] ?? item.itemType,
      link: getLink(item),
      abstract: item.abstractNote,
    };
  })
  .sort((a, b) => parseDateValue(b.date) - parseDateValue(a.date));

export const publications = z.array(publicationSchema).parse(items);
