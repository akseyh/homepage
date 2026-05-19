import Parser from "rss-parser";

export interface Post {
  title: string;
  link: string;
  date: string;
  excerpt: string;
  slug: string;
}

let cached: Post[] | null = null;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

export async function getPosts(): Promise<Post[]> {
  if (cached) return cached;

  const feedUrl = import.meta.env.PUBLIC_SUBSTACK_URL;

  if (!feedUrl) {
    console.warn("PUBLIC_SUBSTACK_URL is not set");
    cached = [];
    return cached;
  }

  try {
    const parser = new Parser();
    const feed = await parser.parseURL(feedUrl);

    cached = (feed.items ?? []).map((item) => ({
      title: item.title ?? "Untitled",
      link: item.link ?? "#",
      date: item.pubDate ?? item.isoDate ?? "",
      excerpt: (item.contentSnippet ?? "").slice(0, 250),
      slug: slugify(item.title ?? "untitled"),
    }));

    return cached;
  } catch (err) {
    console.error("Failed to fetch RSS feed:", err);
    cached = [];
    return cached;
  }
}
