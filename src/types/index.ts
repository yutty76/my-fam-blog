export interface ImageType {
  url: string;
  height?: number;
  width?: number;
}

export interface CategoryType {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  name: string;
  description?: string;
}

export interface ArticleType {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  content: string;
  description?: string;
  eyecatch?: ImageType;
  thumbnail?: ImageType;
  category?: CategoryType;
}
