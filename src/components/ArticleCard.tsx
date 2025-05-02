"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiClock, FiTag } from 'react-icons/fi';

// 一時的な型定義（@/typesを作成するまでの間）
interface ImageType {
  url: string;
  height?: number;
  width?: number;
}

interface CategoryType {
  id: string;
  name: string;
}

interface ArticleType {
  id: string;
  publishedAt: string;
  title: string;
  description?: string;
  eyecatch?: ImageType;
  thumbnail?: ImageType;
  category?: CategoryType;
}

interface ArticleCardProps {
  article: ArticleType;
  priority?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, priority = false }) => {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <Link href={`/posts/${article.id}`}>
        <div className="relative h-48">
          {article.eyecatch ? (
            <Image
              src={article.eyecatch.url}
              alt={article.title || "記事のサムネイル画像"}
              fill
              priority={priority}
              className="object-cover"
            />
          ) : article.thumbnail ? (
            <Image
              src={article.thumbnail.url}
              alt={article.title || "記事のサムネイル画像"}
              fill
              priority={priority}
              className="object-cover"
            />
          ) : (
            <div className="bg-gray-200 w-full h-full flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <FiClock className="mr-1" />
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
            </time>
            {article.category && (
              <>
                <FiTag className="ml-4 mr-1" />
                <span>{article.category.name}</span>
              </>
            )}
          </div>
          <h3 className="text-xl font-bold mb-2 line-clamp-2">{article.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-3">
            {article.description || "この記事の詳細をご覧ください..."}
          </p>
        </div>
      </Link>
    </article>
  );
};

export default ArticleCard;
