export type CuotFeed = {
  description: string;
  feedUrl: string;
  generator: string;
  image: {
    height: string;
    link: string;
    title: string;
    url: string;
    width: string;
  };
  language: string;
  lastBuildDate: string;
  link: string;
  paginationLinks: Record<string, string>;
  title: string;
};

export type CuotItem = {
  categories: string[];
  content: string;
  'content:encoded': string;
  'content:encodedSnippet': string;
  contentSnippet: string;
  creator: string;
  'dc:creator': string;
  guid: string;
  isoDate: string;
  link: string;
  pubDate: string;
  title: string;
};
