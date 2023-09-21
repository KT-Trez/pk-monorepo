export type RssFeed = {
  category: string;
  description: string;
  docs: string;
  generator: string;
  language: string;
  link: string;
  managingEditor: string;
  title: string;
};

export type RssItem = {
  description: string;
  link: string;
  pubDate: string;
  title: string;
};
