"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiClock } from 'react-icons/fi';
import { ArticleType } from '../types';

interface FeaturedArticleProps {
  article: ArticleType;
}

const FeaturedArticle: React.FC<FeaturedArticleProps> = ({ article }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden md:flex">
      <div className="md:w-1/2">
        {article.eyecatch ? (
          <Image
            src={article.eyecatch.url}
            alt={article.title}
            width={800}
            height={500}
            className="w-full h-64 md:h-full object-cover"
            priority={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : article.thumbnail ? (
          <Image
            src={article.thumbnail.url}
            alt={article.title}
            width={800}
            height={500}
            className="w-full h-64 md:h-full object-cover"
            priority={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="bg-gray-300 w-full h-64 md:h-full flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>
      <div className="p-6 md:w-1/2 md:flex md:flex-col md:justify-center">
        <div className="flex items-center text-sm text-blue-600 mb-2">
          <FiClock className="mr-1" />
          <time dateTime={article.publishedAt}>
            {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
          </time>
        </div>
        <h3 className="text-2xl font-bold mb-3">{article.title}</h3>
        <p className="text-gray-600 mb-6 line-clamp-3">
          {article.description || "この記事の詳細をご覧ください..."}
        </p>
        <Link href={`/posts/${article.id}`} className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition duration-200">
          続きを読む
        </Link>
      </div>
    </div>
  );
};

export default FeaturedArticle;
