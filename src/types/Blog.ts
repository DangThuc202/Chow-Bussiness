export interface GenerateBlogPayload {
  user_prompt: string;
  blog_count: number;
  knowledge_base?: string;
  rss_feeds?: string[];
  items_per_feed: number;
  word_count: number;
  loop_until_word_count: boolean;
}

export interface SaveBlog {
  title?: string;
  content: string;
}
